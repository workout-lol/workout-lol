// import { ObjectId } from 'mongodb'
import { getExercisesByQuery } from '../../lib/db-helper' // updateExercise

const handler = async (req, res) => {
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

    const workouts = await getExercisesByQuery(query)

    res.status(200).json(workouts)
  }
  else {
    res.status(404).send()
  }
}

export default handler

