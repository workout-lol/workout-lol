import { getServerSession } from 'next-auth/next'
import { authOptions } from './auth/[...nextauth]'
import {
  createPublicWorkout,
  getUserByQuery,
  getPublicWorkoutByQuery,
} from '../../lib/db-helper'

const handler = async (req, res) => {
  if (req.method === 'POST') {
    const session = await getServerSession(req, res, authOptions)
    if (!session || !session.user || !session.user.email) {
      res.status(401).json({})
    } else {
      const [user] = await getUserByQuery({ email: session.user.email })

      if (!user) {
        res.status(401).json({})
      } else {
        const { name, description, exercises, equipment, muscles, difficulty } =
          req.body
        // TODO up or downvote
        res.status(201).send()
      }
    }
  } else {
    res.status(404).send()
  }
}

module.exports = handler
