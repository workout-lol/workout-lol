// import { ObjectId } from 'mongodb'
import { getExercisesByQuery } from '../../lib/db-helper' // updateExercise

const handler = async (req, res) => {
  if (req.method === 'GET') {
    const { equipment = [], muscles = [] } = req.query
    const mappedEquipment = equipment.split(',').filter(Boolean)
    const mappedMuscles = muscles.split(',').filter(Boolean)

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
              'mainMuscle': {
                '$in': mappedMuscles
              }
            }, {
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
      }
    ]

    const workouts = await getExercisesByQuery(query)

    res.status(200).json(workouts)
  }
  // else if (req.method === 'PUT') { // only for temp admin stuff
  //   const { update, _id } = req.body
  //   const result = await updateExercise({ _id: new ObjectId(_id), update })

  //   res.status(200).json(result)
  // }
  else {
    res.status(404).send()
  }
}

export default handler

