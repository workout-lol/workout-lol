import CryptoJS from 'crypto-js'
import NextCors from 'nextjs-cors'
import { getUserByQuery, updateUserByQuery } from '../../../lib/db-helper'

const PASSWORD_HASH_SECRET = process.env.PASSWORD_HASH_SECRET

const handler = async (req, res) => {
  await NextCors(req, res, {
    methods: ['POST'],
    origin: '*',
    optionsSuccessStatus: 200,
  })

  if (req.method === 'POST') {
    const { token, password } = req.body

    if (!token) {
      return res.status(400).json({ error: 'Reset token is required' })
    }

    if (!password || password.length < 6) {
      return res
        .status(400)
        .json({ error: 'Password must be at least 6 characters long' })
    }

    const [user] = await getUserByQuery({ resetToken: token })

    if (!user) {
      return res
        .status(400)
        .json({ error: 'Invalid or expired password reset link' })
    }

    const now = new Date()
    const expiry = user.resetTokenExpires ? new Date(user.resetTokenExpires) : null

    if (!expiry || now > expiry) {
      return res
        .status(400)
        .json({ error: 'Password reset link has expired. Please request a new one.' })
    }

    const passHash = CryptoJS.SHA256(password, PASSWORD_HASH_SECRET).toString(
      CryptoJS.enc.Hex
    )

    await updateUserByQuery(
      { _id: user._id },
      {
        password: passHash,
        resetToken: null,
        resetTokenExpires: null,
      }
    )

    return res.status(200).json({ message: 'Password has been successfully updated.' })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}

export default handler
