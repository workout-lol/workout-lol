import { v4 as uuidv4 } from 'uuid'
import NextCors from 'nextjs-cors'
import { getUserByQuery, updateUserByQuery } from '../../../lib/db-helper'

const handler = async (req, res) => {
  await NextCors(req, res, {
    methods: ['POST'],
    origin: '*',
    optionsSuccessStatus: 200,
  })

  if (req.method === 'POST') {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ error: 'Email is required' })
    }

    const [user] = await getUserByQuery({ email: email.toLowerCase() })

    // If user doesn't exist, still return 200 to prevent email enumeration attacks
    if (!user) {
      return res.status(200).json({
        message: 'If an account with that email exists, password reset instructions have been sent.',
      })
    }

    const resetToken = uuidv4()
    const resetTokenExpires = new Date(Date.now() + 2 * 60 * 60 * 1000) // 2 hours expiry

    await updateUserByQuery(
      { email: user.email },
      {
        resetToken,
        resetTokenExpires: resetTokenExpires.toISOString(),
      }
    )

    const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`

    // In production, send email via nodemailer / email service if configured
    console.log(`[Password Reset] Link generated for ${user.email}: ${resetUrl}`)

    return res.status(200).json({
      message: 'If an account with that email exists, password reset instructions have been sent.',
      resetUrl: process.env.NODE_ENV === 'development' ? resetUrl : undefined,
    })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}

export default handler
