import CryptoJS from 'crypto-js'
import { createUser, getUserByQuery } from '../../lib/db-helper'

// todo validate data
const parseSessionData = (sessionData = {}) => ({
  equipment: sessionData.equipment || [],
  workouts: sessionData.workouts || [],
})

const PASSWORD_HASH_SECRET = process.env.PASSWORD_HASH_SECRET

const handler = async (req, res) => {
  if (req.method === 'POST') {
    const { email, password, session_data } = req.body
    const [existingUser] = await getUserByQuery({ email })
    if (existingUser) {
      res.status(409).json({ email: 'Email already exists' })
    } else {
      const passHash = CryptoJS.SHA256(password, PASSWORD_HASH_SECRET).toString(CryptoJS.enc.Hex);
      const sessionData = parseSessionData(session_data)
      await createUser({ email, password: passHash, ...sessionData })

      res.status(201).json({})
    }
  } else {
    res.status(404).json({})
  }
}

export default handler