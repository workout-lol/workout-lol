import { ObjectId } from 'mongodb'
import NextCors from 'nextjs-cors'
import { getExercisesByAggregation } from '../../lib/db-helper'

export const getQuery = (match, { includeStretches = false } = {}) => [
  {
    $addFields: {
      mainMuscle: {
        $arrayElemAt: ['$targets', 0],
      },
    },
  },
  {
    $match: {
      $and: [
        ...match,
        {
          category: {
            $nin: [
              'Yoga',
              'TRX',
              'Medicine Ball',
              'Machine',
              'Cables',
              ...(includeStretches ? [] : ['Stretches']),
            ],
          },
        },
        {
          difficulty: {
            $nin: ['Yoga'],
          },
        },
      ],
    },
  },
]

const handler = async (req, res) => {
  await NextCors(req, res, {
    // Options
    methods: ['POST'],
    origin: '*',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  })
  if (req.method === 'POST') {
    // get by ids via POST, bc it might get to long for header query param
    const { ids, includeStretches = true } = req.body
    const query = getQuery(
      [
        {
          _id: {
            $in: ids.map((e) => new ObjectId(e)),
          },
        },
      ],
      { includeStretches }
    )
    const workouts = await getExercisesByAggregation(query)

    res.status(200).json(workouts)
  } else if (req.method === 'GET') {
    const {
      equipment = '',
      muscles = '',
      difficulty = '',
      includeStretches = '',
    } = req.query
    const mappedEquipment = equipment.split(',').filter(Boolean)
    const mappedMuscles = muscles.split(',').filter(Boolean)
    const mappedDifficulties = difficulty.split(',').filter(Boolean)
    const query = getQuery(
      [
        {
          mainMuscle: {
            $in: mappedMuscles,
          },
        },
        {
          equipment: {
            $not: {
              $elemMatch: {
                $nin: mappedEquipment,
              },
            },
          },
        },
        ...(mappedDifficulties.length
          ? [
              {
                difficulty: {
                  $in: mappedDifficulties,
                },
              },
            ]
          : []),
      ],
      { includeStretches: includeStretches === 'true' }
    )

    const workouts = await getExercisesByAggregation(query)

    res.status(200).json(workouts)
  } else {
    res.status(404).send()
  }
}

export default handler
