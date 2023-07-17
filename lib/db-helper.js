import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb'

const MONGODB_URI = process.env.MONGODB_URI
const EXERCISE_COLLECTION = 'exercises'
const USER_COLLECTION = 'users'

const connectDb = () => {
  const client = new MongoClient(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
  })
  return client.connect()
}

const getAll = async (collectionName) => {
  let result = []
  let client
  try {
    client = await connectDb()
    const db = client.db()

    const collection = db.collection(collectionName)

    result = await collection.find().toArray()
  } catch (e) {
    console.log(`error on getting all ${collectionName}`, e)
  } finally {
    if (client) {
      await client.close()
    }
  }

  return result
}

const create = async (collectionName, data) => {
  let result
  let client
  try {
    client = await connectDb()
    const db = client.db()
    const collection = db.collection(collectionName)

    result = await collection.insertOne(data)
  } catch (e) {
    console.log(`error on creating ${collectionName}`, e)
  } finally {
    if (client) {
      await client.close()
    }
  }

  return result
}

const updateByQuery = async (collectionName, query, update) => {
  let result
  let client
  try {
    client = await connectDb()
    const db = client.db()
    const collection = db.collection(collectionName)

    result = await collection.findOneAndUpdate(
      query,
      { $set: update },
      { returnDocument: 'after' }
    )
  } catch (e) {
    console.log('error on updating user', e)
  } finally {
    if (client) {
      await client.close()
    }
  }

  return result
}

const findByQuery = async (collectionName, query, projection) => {
  let result = []
  let client
  try {
    client = await connectDb()
    const db = client.db()
    const collection = db.collection(collectionName)

    result = await collection.find(query, { projection }).toArray()
  } catch (e) {
    console.log('error on getting user', e)
  } finally {
    if (client) {
      await client.close()
    }
  }

  return result
}

export const getAllExercises = async () => await getAll(EXERCISE_COLLECTION)
export const getAllUsers = async () => await getAll(USER_COLLECTION)
export const createExercise = async (exercise) =>
  await create(EXERCISE_COLLECTION, exercise)
export const createUser = async (user) => await create(USER_COLLECTION, user)

export const updateUserByQuery = async (query, update) =>
  await updateByQuery(USER_COLLECTION, query, update)
export const updateExercise = async ({ _id, update }) =>
  await updateByQuery(EXERCISE_COLLECTION, { _id }, update)

export const getUserByQuery = async (query, projection) =>
  await findByQuery(USER_COLLECTION, query, projection)
export const getExercisesByQuery = async (query) =>
  await findByQuery(EXERCISE_COLLECTION, query)

export const getExercisesByAggregation = async (query) => {
  let result = []
  let client
  try {
    client = await connectDb()
    const db = client.db()
    const collection = db.collection(EXERCISE_COLLECTION)

    result = await collection.aggregate(query).toArray()
  } catch (e) {
    console.log('error on getting exercise', e)
  } finally {
    if (client) {
      await client.close()
    }
  }

  return result
}
