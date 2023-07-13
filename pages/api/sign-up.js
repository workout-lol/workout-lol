import CryptoJS from 'crypto-js'
import { createUser, getUserByQuery } from '../../lib/db-helper'
import { generateSlug } from 'random-word-slugs'
import NextCors from 'nextjs-cors'

const PASSWORD_HASH_SECRET = process.env.PASSWORD_HASH_SECRET

const handler = async (req, res) => {
  await NextCors(req, res, {
    // Options
    methods: ['POST'],
    origin: '*',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  })

  if (req.method === 'POST') {
    const { email, password } = req.body
    let [existingUser] = await getUserByQuery({ email })
    let slug = generateSlug()
    let [slugAlreadyExists] = await getUserByQuery({ slug })

    while (slugAlreadyExists) {
      slug = generateSlug()
      const [existingUsers] = await getUserByQuery({ slug })
      slugAlreadyExists = !!existingUsers
    }

    if (existingUser) {
      res.status(409).json({ email: 'Email already exists' })
    } else {
      const passHash = CryptoJS.SHA256(password, PASSWORD_HASH_SECRET).toString(
        CryptoJS.enc.Hex
      )

      await createUser({ email, password: passHash, slug })

      res.status(201).json({})
    }
  } else {
    res.status(404).json({})
  }
}

export default handler
