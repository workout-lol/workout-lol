// import { getAllUsers, updateUserByQuery } from '../../lib/db-helper'

// const handler = async (_, res) => {
//   const users = await getAllUsers()

//   for (let i = 0; i < users.length; i++) {
//     const userWorkouts = []
//     for (let j = 0; j < (users[i].workouts || []).length; j++) {
//       const w = users[i].workouts[j]
//       const newWorkout = {
//         id: w.id,
//         created_at: w.created_at,
//         exercises: w.exercises.map((e) => ({
//           id: e._id,
//           completed: e.completed,
//           sets: e.sets,
//         })),
//       }

//       userWorkouts.push(newWorkout)
//     }

//     await updateUserByQuery({ _id: users[i]._id }, { workouts: userWorkouts })
//   }

//   res.status(200).json(users)
// }

// export default handler
