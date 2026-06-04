import crypto from 'crypto'
import { getUserByQuery, updateUserByQuery } from '../../../lib/db-helper'
import { sendPasswordResetEmail } from '../../../lib/email'

const RESET_TOKEN_TTL_MS = 2 * 60 * 60 * 1000

const getBaseUrl = (req) => {
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL
  }

  const protocol = req.headers['x-forwarded-proto'] || 'http'
  return `${protocol}://${req.headers.host}`
}

const hashToken = (token) =>
  crypto.createHash('sha256').update(token).digest('hex')

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({})
  }

  const email = (req.body.email || '').trim().toLowerCase()

  if (!email) {
    return res.status(400).json({ email: 'E-Mail Address is required' })
  }

  const [user] = await getUserByQuery({ email })
  const genericResponse = {
    message:
      'If an account exists for this email, a password reset link has been sent.',
  }

  if (!user || !user.password) {
    return res.status(200).json(genericResponse)
  }

  const resetToken = crypto.randomBytes(32).toString('hex')
  const passwordResetToken = hashToken(resetToken)
  const passwordResetExpires = new Date(Date.now() + RESET_TOKEN_TTL_MS)

  await updateUserByQuery(
    { email },
    {
      passwordResetToken,
      passwordResetExpires,
    }
  )

  const resetUrl = `${getBaseUrl(req)}/reset-password?token=${resetToken}`
  const emailResult = await sendPasswordResetEmail({ to: email, resetUrl })

  return res.status(200).json({
    ...genericResponse,
    resetUrl:
      emailResult.skipped && process.env.NODE_ENV !== 'production'
        ? resetUrl
        : undefined,
  })
}
