const logger = require("../utils/logger")

const errorHandler = (err, req, res, next) => {
  logger.error("Error:", {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  })

  const statusCode = err.statusCode || 500
  const message = process.env.NODE_ENV === "production" ? "An error occurred" : err.message

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  })
}

module.exports = { errorHandler }
