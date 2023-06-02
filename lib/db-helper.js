import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb'

const MONGODB_USER = process.env.MONGODB_USER
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD
const uri = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@cluster0.czn2fkl.mongodb.net/?retryWrites=true&w=majority`
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 })

const DATABASE = 'prod'
const EXERCISE_COLLECTION = 'exercises'

export const connectDb = () => client.connect()
export const disconnectDb = () => client.close()
export const getAllExercises = async () => {
  let result = []
  try {
    const dbClient = await connectDb()
    const db = dbClient.db(DATABASE)
    const collection = db.collection(EXERCISE_COLLECTION)

    result = await collection.find().toArray()
    await dbClient.close()
  } catch (e) {
    console.log('error on getting all exercises', e)
  }

  return result
}
export const getExercisesByQuery = async query => {
  let result = []

  try {
    const dbClient = await connectDb()
    const db = dbClient.db(DATABASE)
    const collection = db.collection(EXERCISE_COLLECTION)

    result = await collection.aggregate(query).toArray()
    await dbClient.close()
  } catch (e) {
    console.log('error on getting user', e)
  }

  return result
}

export const createExercise = async exercise => {
  let result

  try {
    const dbClient = await connectDb()
    const db = dbClient.db(DATABASE)
    const collection = db.collection(EXERCISE_COLLECTION)

    result = await collection.insertOne(exercise)
    await dbClient.close()
  } catch (e) {
    console.log('error on creating exercise', e)
  }

  return result
}

export const updateExercise = async ({ _id, update }) => {
  let result

  try {
    const dbClient = await connectDb()
    const db = dbClient.db(DATABASE)
    const collection = db.collection(EXERCISE_COLLECTION)
    console.log('yo,', _id, update)

    result = await collection.findOneAndUpdate({ _id }, { $set: update }, { returnDocument: 'after' })
    await dbClient.close()
  } catch (e) {
    console.log('error on updating user', e)
  }

  return result
}

export const deleteExercise = async ({ _id }) => {
  let result

  try {
    const dbClient = await connectDb()
    const db = dbClient.db(DATABASE)
    const collection = db.collection(EXERCISE_COLLECTION)

    result = await collection.deleteOne({ _id: new ObjectId(_id) });
    await dbClient.close()
  } catch (e) {
    console.log('error on updating user', e)
  }

  return result
}