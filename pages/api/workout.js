import { ObjectId } from 'mongodb'
import NextCors from 'nextjs-cors'
import { getExercisesByAggregation } from '../../lib/db-helper'

export const getQuery = match => ([
  {
    '$addFields': {
      'mainMuscle': {
        '$arrayElemAt': [
          '$targets', 0
        ]
      }
    }
  }, {
    '$match': { '$and': [
        ...match, {
          'category': {
            '$nin': [
              'Yoga',
              'TRX',
              'Medicine Ball',
              'Machine',
              'Cables',
              'Stretches' // todo re-add and sort
            ]
          }
        }, {
          'difficulty': {
            '$nin': [
              'Yoga'
            ]
          }
        }
      ]
    }
  }
])

const handler = async (req, res) => {
  if (req.method === 'GET') {
    // get by ids via POST, bc it might get to long for header query param
    // const { id } = req.query
    // const query = getQuery([
    //   {
    //     _id: {
    //       $in: ids.map(e => new ObjectId(e))
    //     }
    //   }
    // ])
    // const workouts = await getExercisesByAggregation(query)
    console.log( req.query)

    res.status(200).json({})
  }
  else {
    res.status(404).send()
  }
}

export default handler

