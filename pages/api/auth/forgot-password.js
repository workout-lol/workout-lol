import crypto from 'crypto'
import { getUserByQuery, updateUserByQuery } from '../../../lib/db-helper'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { email } = req.body || {}

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ error: 'Please enter a valid email address' })
  }

  const normalizedEmail = email.toLowerCase().trim()
  const genericSuccessMessage =
    'If an account with that email exists, password reset instructions have been sent.'

  try {
    const [user] = await getUserByQuery({ email: normalizedEmail })

    if (!user) {
      return res.status(200).json({ message: genericSuccessMessage })
    }

    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpires = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()

    await updateUserByQuery(
      { email: user.email },
      { resetToken, resetTokenExpires }
    )

    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`

    if (process.env.NODE_ENV !== 'production') {
      console.log(`[Password Reset] Link for ${user.email}: ${resetUrl}`)
    }

    return res.status(200).json({
      message: genericSuccessMessage,
      ...(process.env.NODE_ENV !== 'production' && { devResetUrl: resetUrl }),
    })
  } catch (error) {
    console.error('forgot-password error:', error)
    return res.status(500).json({ error: 'An unexpected error occurred' })
  }
}
