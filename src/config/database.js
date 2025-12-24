const mongoose = require("mongoose")
const logger = require("../utils/logger")

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/landing-page"

    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    logger.info("MongoDB connected successfully")
    return mongoose.connection
  } catch (error) {
    logger.error("MongoDB connection error:", error)
    process.exit(1)
  }
}

const disconnectDB = async () => {
  try {
    await mongoose.disconnect()
    logger.info("MongoDB disconnected")
  } catch (error) {
    logger.error("MongoDB disconnection error:", error)
  }
}

module.exports = { connectDB, disconnectDB }
