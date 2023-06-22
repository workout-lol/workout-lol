import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"
import { getUserByQuery, updateUserByQuery } from '../../../lib/db-helper'

const parseUser = user => ({
  equipment: user.equipment,
  workouts: user.workouts,
  slug: user.slug
})

const handler = async (req, res) => {
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