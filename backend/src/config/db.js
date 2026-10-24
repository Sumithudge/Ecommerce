import mongoose from 'mongoose'

let connectionPromise = null

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be configured')
  }

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(process.env.MONGO_URI)
      .then(connection => {
        console.log(
          `MongoDB connected: ${connection.connection.host}`
        )
        return connection
      })
      .catch(error => {
        connectionPromise = null
        console.error(
          'MongoDB connection failed:',
          error.message
        )
        throw error
      })
  }

  return connectionPromise
}

export default connectDB
