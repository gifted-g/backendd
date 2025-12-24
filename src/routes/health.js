const express = require("express")
const router = express.Router()
const logger = require("../utils/logger")

/**
 * GET /api/health - Health check endpoint
 */
router.get("/", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  })
})

module.exports = router
