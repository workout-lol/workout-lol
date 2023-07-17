import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { ObjectId } from 'mongodb'
import { getExercisesByAggregation } from '../../../lib/db-helper'

import { getUserByQuery, updateUserByQuery } from '../../../lib/db-helper'
import { isEmpty, isDefined } from '../../../utils/checks'

import { getQuery } from '../../api/exercises'

const handler = async (req, res) => {
  if (req.method === 'GET') {
    const { slug } = req.query

    if (!isDefined(slug) || isEmpty(slug)) {
      return res.status(404).json({
        message: 'Not found',
        error: 'No slug provided',
      })
    }

    const [user] = await getUserByQuery(
      { slug },
      { email: 0, password: 0, equipment: 0, _id: 0 }
    )

    if (!user) {
      return res.status(404).json({
        message: 'Not found',
        error: 'User not found',
      })
    }

    const ids = user.workouts.map((w) => w.exercises.map((e) => e.id)).flat()

    const query = getQuery([
      {
        _id: {
          $in: ids.map((e) => new ObjectId(e)),
        },
      },
    ])

    const workouts = await getExercisesByAggregation(query)

    return res.status(200).json({
      ...user,
      workouts: {
        ...user.workouts.map((w) => ({
          ...w,
          exercises: w.exercises.map((e) => ({
            ...e,
            ...workouts.find((w) => w._id.toString() === e.id.toString()),
          })),
        })),
      },
    })
  }

  if (req.method === 'PATCH') {
    const { slug } = req.query

    if (!isDefined(slug) || isEmpty(slug)) {
      return res.status(404).json({
        message: 'Not found',
        error: 'No slug provided',
      })
    }

    const [user] = await getUserByQuery({ slug }, { email: 0, password: 0 })

    if (!user) {
      return res.status(404).json({
        message: 'Not found',
        error: 'User not found',
      })
    }

    const [alreadyExists] = await getUserByQuery({ slug: req.body.slug })
    if (alreadyExists) {
      return res.status(409).json({
        message: 'Conflict',
        error: 'Slug already exists',
      })
    }

    const session = await getServerSession(req, res, authOptions)

    const update = {
      slug: req.body.slug,
    }

    await updateUserByQuery({ email: session.user.email }, update)
    return res.status(200).json(user)
  } else {
    res.status(404).json({
      message: 'Not found',
      error: 'Method not allowed',
    })
  }
}

export default handler
