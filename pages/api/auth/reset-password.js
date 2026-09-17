import CryptoJS from 'crypto-js'
import { getUserByQuery, updateUserByQuery } from '../../../lib/db-helper'

const PASSWORD_HASH_SECRET = process.env.PASSWORD_HASH_SECRET

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { token, password } = req.body || {}

  if (!token || typeof token !== 'string') {
    return res.status(400).json({ error: 'Reset token is required' })
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' })
  }

  try {
    const [user] = await getUserByQuery({ resetToken: token })

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired password reset link' })
    }

    const now = new Date()
    const expiresAt = new Date(user.resetTokenExpires)

    if (now > expiresAt) {
      await updateUserByQuery(
        { _id: user._id },
        { resetToken: null, resetTokenExpires: null }
      )
      return res.status(400).json({ error: 'This reset link has expired. Please request a new one.' })
    }

    const passHash = CryptoJS.SHA256(password, PASSWORD_HASH_SECRET).toString(CryptoJS.enc.Hex)

    await updateUserByQuery(
      { _id: user._id },
      {
        password: passHash,
        resetToken: null,
        resetTokenExpires: null,
      }
    )

    return res.status(200).json({ message: 'Password has been reset successfully' })
  } catch (error) {
    console.error('reset-password error:', error)
    return res.status(500).json({ error: 'An unexpected error occurred' })
  }
}
