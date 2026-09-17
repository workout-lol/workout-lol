import handler from '../../pages/api/auth/forgot-password'
import * as dbHelper from '../../lib/db-helper'

jest.mock('../../lib/db-helper')

const createMockReqRes = (method = 'POST', body = {}) => {
  const req = { method, body }
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  }
  return { req, res }
}

describe('/api/auth/forgot-password', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('rejects non-POST methods with 405', async () => {
    const { req, res } = createMockReqRes('GET')
    await handler(req, res)
    expect(res.status).toHaveBeenCalledWith(405)
    expect(res.json).toHaveBeenCalledWith({ error: 'Method not allowed' })
  })

  it('rejects missing or malformed email with 400', async () => {
    const { req, res } = createMockReqRes('POST', { email: 'bad-email' })
    await handler(req, res)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: 'Please enter a valid email address' })
  })

  it('returns generic 200 without writing token when user is not found (anti-enumeration)', async () => {
    dbHelper.getUserByQuery.mockResolvedValueOnce([])
    const { req, res } = createMockReqRes('POST', { email: 'nonexistent@workout.lol' })

    await handler(req, res)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.stringContaining('If an account with that email exists'),
      })
    )
    expect(dbHelper.updateUserByQuery).not.toHaveBeenCalled()
  })

  it('generates token and stores resetTokenExpires for existing user with 200', async () => {
    dbHelper.getUserByQuery.mockResolvedValueOnce([{ email: 'user@workout.lol', _id: '123' }])
    dbHelper.updateUserByQuery.mockResolvedValueOnce({ ok: 1 })

    const { req, res } = createMockReqRes('POST', { email: 'User@Workout.lol' })
    await handler(req, res)

    expect(dbHelper.updateUserByQuery).toHaveBeenCalledWith(
      { email: 'user@workout.lol' },
      expect.objectContaining({
        resetToken: expect.any(String),
        resetTokenExpires: expect.any(String),
      })
    )
    expect(res.status).toHaveBeenCalledWith(200)
  })

  it('handles database errors with 500', async () => {
    dbHelper.getUserByQuery.mockRejectedValueOnce(new Error('DB Connection Failed'))
    const { req, res } = createMockReqRes('POST', { email: 'user@workout.lol' })

    await handler(req, res)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ error: 'An unexpected error occurred' })
  })
})
