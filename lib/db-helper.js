import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb'

const MONGODB_URI = process.env.MONGODB_URI
const client = new MongoClient(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 })

const EXERCISE_COLLECTION = 'exercises'

export const connectDb = async () => {
    if (!client.isConnected) {
        try {
            await client.connect()
        }
        catch (e) {
            console.log('error on connecting to db', e)
        }
    }

    return client.db()
}

export const disconnectDb = async () => {
    if (client.isConnected) {
      await client.close()
    }
}

export const getAllExercises = async () => {
  let result = []
  try {
    const db = await connectDb()

    const collection = db.collection(EXERCISE_COLLECTION)

    result = await collection.find().toArray()
  } catch (e) {
    console.log('error on getting all exercises', e)
  }
  finally {
    await disconnectDb()
  }

  return result
}

export const getExercisesByQuery = async query => {
  let result = []

  try {
    const db = await connectDb()
    const collection = db.collection(EXERCISE_COLLECTION)

    result = await collection.aggregate(query).toArray()
  } catch (e) {
    console.log('error on getting exercise', e)
  }
  finally {
    await disconnectDb()
  }

  return result
}

export const createExercise = async exercise => {
  let result

  try {
    const db = await connectDb()
    const collection = db.collection(EXERCISE_COLLECTION)

    result = await collection.insertOne(exercise)
  } catch (e) {
    console.log('error on creating exercise', e)
  }
  finally {
    await disconnectDb()
  }

  return result
}

export const updateExercise = async ({ _id, update }) => {
  let result

  try {
    const db = await connectDb()
    const collection = db.collection(EXERCISE_COLLECTION)
    console.log('yo,', _id, update)

    result = await collection.findOneAndUpdate({ _id }, { $set: update }, { returnDocument: 'after' })
  } catch (e) {
    console.log('error on updating user', e)
  }
  finally {
    await disconnectDb()
  }

  return result
}

export const deleteExercise = async ({ _id }) => {
  let result

  try {
    const db = await connectDb()
    const collection = db.collection(EXERCISE_COLLECTION)

    result = await collection.deleteOne({ _id: new ObjectId(_id) });
  } catch (e) {
    console.log('error on updating user', e)
  }
  finally {
    await disconnectDb()
  }

  return result
}