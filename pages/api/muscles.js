// import { ObjectId } from 'mongodb'
import NextCors from 'nextjs-cors'
import { getExercisesByAggregation } from '../../lib/db-helper' // updateExercise

const handler = async (req, res) => {
  await NextCors(req, res, {
    // Options
    methods: ['GET'],
    origin: '*',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  });

  if (req.method === 'GET') {
    const { equipment = [] } = req.query
    const mappedEquipment = equipment.split(',').filter(Boolean)

    const query = [
      {
        '$addFields': {
          'mainMuscle': {
            '$arrayElemAt': [
              '$targets', 0
            ]
          }
        }
      }, {
        '$match': {
          '$and': [
            {
              'equipment': {
                '$not': {
                  '$elemMatch': {
                    '$nin': mappedEquipment
                  }
                }
              }
            }, {
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
      },
      {
        $group: {
          '_id' : '$mainMuscle', count:{ $sum:1 }
        }
      }
    ]

    const workouts = await getExercisesByAggregation(query)

    res.status(200).json(workouts)
  }
  else {
    res.status(404).send()
  }
}

export default handler

