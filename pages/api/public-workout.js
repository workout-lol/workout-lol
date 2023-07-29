import { getServerSession } from 'next-auth/next'
import { authOptions } from './auth/[...nextauth]'
import {
  createPublicWorkout,
  getUserByQuery,
  getPublicWorkoutByQuery,
} from '../../lib/db-helper'

const handler = async (req, res) => {
  if (req.method === 'GET') {
    console.log('query', req.query) // TODO query filter
    const result = await getPublicWorkoutByQuery({})
    const userIds = result.map((item) => item.created_by)
    const users = await getUserByQuery({ _id: { $in: userIds } })
    const mergedResult = result.map((item) => ({
      ...item,
      created_by: users.find(
        (u) => u._id.toString() === item.created_by.toString()
      ).slug,
    }))
    res.status(200).json(mergedResult)
  } else if (req.method === 'PUT') {
    const session = await getServerSession(req, res, authOptions)
    if (!session || !session.user || !session.user.email) {
      res.status(401).json({})
    } else {
      const [user] = await getUserByQuery({ email: session.user.email })
      if (!user) {
        res.status(401).json({})
      } else {
        // TODO update
        res.status(200).json({})
      }
    }
  } else if (req.method === 'POST') {
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
        await createPublicWorkout({
          name,
          description,
          exercises,
          created_at: new Date().toISOString(),
          created_by: user._id,
          votes: {},
          equipment,
          muscles,
          difficulty,
        })
        res.status(201).send()
      }
    }
  } else {
    res.status(404).send()
  }
}

module.exports = handler
