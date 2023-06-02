const fs = require('fs')
const database = require('../lib/db-helper')

const run = async () => {
  const data = JSON.parse(fs.readFileSync('./data.json', 'utf8'))

  await database.connectDb()

  let i = 0
  for (let exercise of data) {
    i++;
    try {
      await database.createExercise(exercise)
      console.log('ok', i)
    } catch (e) {
      console.log('err', i)
    }
  }

  await database.disconnectDb()
};

run()