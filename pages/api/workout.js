import { getUserByQuery } from '../../lib/db-helper'

const handler = async (req, res) => {
  if (req.method === 'GET' && req.query.id) {
    const [user] = await getUserByQuery({ 'workouts.id': req.query.id })

    if (!user) {
      res.status(404).json({
        error: {
          message: 'Workout not found',
          details: `The requested workout could not be found. This may occur if the workout does not exist or has been deleted by its creator.`,
        },
      })
    } else {
      const workout = user.workouts.find((w) => w.id === req.query.id)
      res.status(200).json(workout)
    }
  } else {
    res.status(404).send()
  }
}

export default handler
