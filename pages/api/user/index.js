import { getServerSession } from 'next-auth/next'
import NextCors from 'nextjs-cors'
import { authOptions } from '../auth/[...nextauth]'
import { getUserByQuery, updateUserByQuery } from '../../../lib/db-helper'

const parseUser = (user) => ({
  equipment: user.equipment,
  workouts: user.workouts,
  slug: user.slug,
  email: user.email,
})

const handler = async (req, res) => {
  await NextCors(req, res, {
    // Options
    methods: ['GET', 'PUT'],
    origin: '*',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  })

  const session = await getServerSession(req, res, authOptions)
  if (!session || !session.user || !session.user.email) {
    res.status(401).json({})
  } else {
    const [user] = await getUserByQuery({ email: session.user.email })

    if (!user) {
      res.status(401).json({})
    } else {
      if (req.method === 'GET') {
        res.status(200).json(parseUser(user))
      } else if (req.method === 'PUT') {
        const update = parseUser(req.body)
        await updateUserByQuery({ email: session.user.email }, update)

        res.status(200).json(parseUser(req.body))
      } else {
        res.status(404).json({})
      }
    }
  }
}

export default handler
