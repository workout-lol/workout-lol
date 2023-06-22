import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb'

const MONGODB_URI = process.env.MONGODB_URI
const EXERCISE_COLLECTION = 'exercises'
const USER_COLLECTION = 'users'

const connectDb = () => {
  const client = new MongoClient(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 })
  return client.connect()
}

export const getAllExercises = async () => {
  let result = []
  let client
  try {
    client = await connectDb()
    const db = client.db()

    const collection = db.collection(EXERCISE_COLLECTION)

    result = await collection.find().toArray()
  } catch (e) {
    console.log('error on getting all exercises', e)
  }
  finally {
    if (client) {
      await client.close()
    }
  }

  return result
}

export const getAllUsers = async () => {
  let result = []
  let client
  try {
    client = await connectDb()
    const db = client.db()
    const collection = db.collection(USER_COLLECTION)

    result = await collection.find().toArray()
  } catch (e) {
    console.log("error on getting all users", e)
  } finally {
    if (client) {
      await client.close()
    }
  }

  return result
}

export const getExercisesByQuery = async query => {
  let result = []
  let client
  try {
    client = await connectDb()
    const db = client.db()
    const collection = db.collection(EXERCISE_COLLECTION)

    result = await collection.aggregate(query).toArray()
  } catch (e) {
    console.log('error on getting exercise', e)
  }
  finally {
    if (client) {
      await client.close()
    }
  }

  return result
}

export const createExercise = async exercise => {
  let result
  let client
  try {
    client = await connectDb()
    const db = client.db()
    const collection = db.collection(EXERCISE_COLLECTION)

    result = await collection.insertOne(exercise)
  } catch (e) {
    console.log('error on creating exercise', e)
  }
  finally {
    if (client) {
      await client.close()
    }
  }

  return result
}

export const updateExercise = async ({ _id, update }) => {
  let result
  let client
  try {
    client = await connectDb()
    const db = client.db()
    const collection = db.collection(EXERCISE_COLLECTION)

    result = await collection.findOneAndUpdate({ _id }, { $set: update }, { returnDocument: 'after' })
  } catch (e) {
    console.log('error on updating user', e)
  }
  finally {
    if (client) {
      await client.close()
    }
  }

  return result
}

export const deleteExercise = async ({ _id }) => {
  let result
  let client
  try {
    client = await connectDb()
    const db = client.db()
    const collection = db.collection(EXERCISE_COLLECTION)

    result = await collection.deleteOne({ _id: new ObjectId(_id) });
  } catch (e) {
    console.log('error on updating user', e)
  }
  finally {
    if (client) {
      await client.close()
    }
  }

  return result
}

export const getUserByQuery = async (query, projection) => {
  let result = []
  let client
  try {
    client = await connectDb()
    const db = client.db()
    const collection = db.collection(USER_COLLECTION)

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

export const createUser = async user => {
  let result
  let client
  try {
    client = await connectDb()
    const db = client.db()
    const collection = db.collection(USER_COLLECTION)

    result = await collection.insertOne(user)
  } catch (e) {
    console.log('error on creating user', e)
  }
  finally {
    if (client) {
      await client.close()
    }
  }

  return result
}

export const updateUserByQuery = async (query, update) => {
  let result
  let client
  try {
    client = await connectDb()
    const db = client.db()
    const collection = db.collection(USER_COLLECTION)

    result = await collection.findOneAndUpdate(query, { $set: update }, { returnDocument: 'after' })
  } catch (e) {
    console.log('error on updating user', e)
  }
  finally {
    if (client) {
      await client.close()
    }
  }

  return result
}