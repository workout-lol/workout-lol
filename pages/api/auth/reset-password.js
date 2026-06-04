import crypto from 'crypto'
import { getUserByQuery, updateUserByQuery } from '../../../lib/db-helper'
import { hashPassword } from '../../../lib/password'

const hashToken = (token) =>
  crypto.createHash('sha256').update(token).digest('hex')

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({})
  }

  const token = (req.body.token || '').trim()
  const password = req.body.password || ''

  if (!token) {
    return res.status(400).json({ token: 'Reset token is required' })
  }

  if (!password || password.length < 6) {
    return res.status(400).json({
      password: 'Password must be at least 6 characters',
    })
  }

  const [user] = await getUserByQuery({
    passwordResetToken: hashToken(token),
    passwordResetExpires: { $gt: new Date() },
  })

  if (!user) {
    return res.status(400).json({
      token: 'This password reset link is invalid or has expired',
    })
  }

  await updateUserByQuery(
    { _id: user._id },
    {
      $set: {
        password: hashPassword(password),
      },
      $unset: {
        passwordResetToken: '',
        passwordResetExpires: '',
      },
    }
  )

  return res.status(200).json({})
}
