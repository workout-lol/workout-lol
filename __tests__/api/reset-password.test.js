import CryptoJS from 'crypto-js'
import handler from '../../pages/api/auth/reset-password'
import * as dbHelper from '../../lib/db-helper'

jest.mock('../../lib/db-helper')

const PASSWORD_HASH_SECRET = 'test_secret_key_123'

const createMockReqRes = (method = 'POST', body = {}) => {
  const req = { method, body }
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  }
  return { req, res }
}

describe('/api/auth/reset-password', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.env.PASSWORD_HASH_SECRET = PASSWORD_HASH_SECRET
  })

  it('rejects non-POST methods with 405', async () => {
    const { req, res } = createMockReqRes('GET')
    await handler(req, res)
    expect(res.status).toHaveBeenCalledWith(405)
    expect(dbHelper.getUserByQuery).not.toHaveBeenCalled()
    expect(dbHelper.updateUserByQuery).not.toHaveBeenCalled()
  })

  it('rejects missing token with 400', async () => {
    const { req, res } = createMockReqRes('POST', { password: 'validPassword123' })
    await handler(req, res)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: 'Reset token is required' })
    expect(dbHelper.updateUserByQuery).not.toHaveBeenCalled()
  })

  it('rejects password shorter than 6 characters with 400', async () => {
    const { req, res } = createMockReqRes('POST', { token: 'valid_tok', password: '123' })
    await handler(req, res)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: 'Password must be at least 6 characters long' })
    expect(dbHelper.updateUserByQuery).not.toHaveBeenCalled()
  })

  it('rejects invalid or unknown token with 400 without modifying database', async () => {
    dbHelper.getUserByQuery.mockResolvedValueOnce([])
    const { req, res } = createMockReqRes('POST', { token: 'fake_token', password: 'validPassword123' })

    await handler(req, res)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid or expired password reset link' })
    expect(dbHelper.updateUserByQuery).not.toHaveBeenCalled()
  })

  it('invalidates and rejects expired token with 400, clearing resetToken and resetTokenExpires in MongoDB', async () => {
    const expiredDate = new Date(Date.now() - 1000 * 60).toISOString()
    const targetUserId = 'user_expired_987'

    dbHelper.getUserByQuery.mockResolvedValueOnce([
      { _id: targetUserId, resetToken: 'expired_tok', resetTokenExpires: expiredDate },
    ])
    dbHelper.updateUserByQuery.mockResolvedValueOnce({ ok: 1 })

    const { req, res } = createMockReqRes('POST', { token: 'expired_tok', password: 'validPassword123' })
    await handler(req, res)

    // Verify database query was targeted by token
    expect(dbHelper.getUserByQuery).toHaveBeenCalledTimes(1)
    expect(dbHelper.getUserByQuery).toHaveBeenCalledWith({ resetToken: 'expired_tok' })

    // Verify exact update payload clearing token fields without modifying password
    expect(dbHelper.updateUserByQuery).toHaveBeenCalledTimes(1)
    expect(dbHelper.updateUserByQuery).toHaveBeenCalledWith(
      { _id: targetUserId },
      {
        resetToken: null,
        resetTokenExpires: null,
      }
    )

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      error: 'This reset link has expired. Please request a new one.',
    })
  })

  it('successfully updates hashed password and clears resetToken and resetTokenExpires with 200', async () => {
    const futureDate = new Date(Date.now() + 1000 * 60 * 60).toISOString()
    const targetUserId = 'user_valid_456'
    const newPassword = 'brandNewStrongPassword!456'
    const expectedHash = CryptoJS.SHA256(newPassword, PASSWORD_HASH_SECRET).toString(CryptoJS.enc.Hex)

    dbHelper.getUserByQuery.mockResolvedValueOnce([
      { _id: targetUserId, email: 'user@workout.lol', resetToken: 'valid_tok', resetTokenExpires: futureDate },
    ])
    dbHelper.updateUserByQuery.mockResolvedValueOnce({ ok: 1 })

    const { req, res } = createMockReqRes('POST', { token: 'valid_tok', password: newPassword })
    await handler(req, res)

    expect(dbHelper.getUserByQuery).toHaveBeenCalledTimes(1)
    expect(dbHelper.getUserByQuery).toHaveBeenCalledWith({ resetToken: 'valid_tok' })

    // Verify exact database update payload: password hashed and token fields nullified
    expect(dbHelper.updateUserByQuery).toHaveBeenCalledTimes(1)
    expect(dbHelper.updateUserByQuery).toHaveBeenCalledWith(
      { _id: targetUserId },
      {
        password: expectedHash,
        resetToken: null,
        resetTokenExpires: null,
      }
    )

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ message: 'Password has been reset successfully' })
  })

  it('handles database errors with 500 without leaking sensitive error messages', async () => {
    dbHelper.getUserByQuery.mockRejectedValueOnce(new Error('DB Connection Refused'))
    const { req, res } = createMockReqRes('POST', { token: 'tok', password: 'validPassword123' })

    await handler(req, res)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ error: 'An unexpected error occurred' })
  })
})
