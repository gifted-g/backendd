const fs = require("fs")
const path = require("path")

const logDir = path.join(__dirname, "../../logs")

// Ensure logs directory exists
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true })
}

class Logger {
  log(level, message, data = {}) {
    const timestamp = new Date().toISOString()
    const logEntry = {
      timestamp,
      level,
      message,
      ...data,
    }

    console.log(`[${level}] ${timestamp}: ${message}`, data)

    // Write to file
    const logFile = path.join(logDir, `${level.toLowerCase()}.log`)
    fs.appendFileSync(logFile, JSON.stringify(logEntry) + "\n")
  }

  info(message, data) {
    this.log("INFO", message, data)
  }

  error(message, data) {
    this.log("ERROR", message, data)
  }

  warn(message, data) {
    this.log("WARN", message, data)
  }

  debug(message, data) {
    if (process.env.NODE_ENV === "development") {
      this.log("DEBUG", message, data)
    }
  }
}

module.exports = new Logger()
