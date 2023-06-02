// import { getAllExercises, updateExercise } from '../../lib/db-helper'

// const handler = async (req, res) => {
//   const workouts = await getAllExercises()
//   const noEquip = workouts.filter(workout => workout.equipment.length === 0)

//   for (let i = 0; i < noEquip.length; i++) {
//     const update = {
//       equipment: ['none'],
//     }
//     // const mappings = {
//     //   "Bodyweight": "none",
//     //   "Dumbbell": "dumbbell",
//     //   "Barbell": "barbell",
//     //   "Kettlebell": "kettlebell",
//     //   "Band": "band",
//     //   "Plate": "plate",
//     //   "Bench": "bench",
//     //   "Cable": "filter",
//     //   "Machine": "filter",
//     //   "TRX": "filter",
//     //   "Stretch": "filter"
//     // }
//     // let newEquip = Object.entries(mappings)
//     //   .map(([name, id]) => noEquip[i].title.includes(name) ? id : null)
//     //   .filter(Boolean)

//     // if (noEquip[i].steps.some(el => el.toLowerCase().includes('bench'))) {
//     //   newEquip.push('bench')
//     // }
//     // if (newEquip.length === 0) {
//     //   newEquip.push('none')
//     // }
//     // if (newEquip.length > 1 && newEquip.includes('none')) {
//     //   newEquip = newEquip.filter(el => el !== 'none')
//     // }

//     // await updateExercise({ _id: noEquip[i]._id, update })
//     // console.log(`Updated ${i+1} / ${noEquip.length}`)
//   }

//   res.status(200).json(noEquip)
// }

// export default handler


// // import { getAllExercises, deleteExercise } from '../../lib/db-helper'

// // function groupByProperty(arr, property) {
// //   const obj = arr.reduce(function(groups, item) {
// //     const val = item[property];
// //     groups[val] = groups[val] || [];
// //     groups[val].push(item);
// //     return groups;
// //   }, {});
// //   return Object.values(obj).filter(arr => arr.length > 1 && arr.every(item => item.videos[0] === arr[0].videos[0]));
// // }


// // const handler = async (req, res) => {
// //   const workouts = await getAllExercises()
// //   const grouped = groupByProperty(workouts, 'title')

// //   for (let i = 0; i < grouped.length; i++) {

// //     for (let j = 0; j < grouped[i].length; j++) {
// //       if (j === 0) {
// //         console.log('KEEP', grouped[i][j]._id, grouped[i][j].title)
// //       } else {
// //         console.log(i, 'REMOVE', grouped[i][j]._id, grouped[i][j].title)
// //         await deleteExercise({ _id: grouped[i][j]._id })
// //       }
// //     }
// //   }

// //   res.status(200).json(workouts)
// // }

// // export default handler
