const express = require("express")
const router = express.Router()
const slackService = require("../services/slackService")
const logger = require("../utils/logger")

/**
 * POST /api/slack/events - Slack event webhook
 */
router.post("/events", express.raw({ type: "application/json" }), async (req, res) => {
  try {
    let body = req.body

    // Handle both raw and parsed body
    if (typeof body === "string") {
      body = JSON.parse(body)
    }

    // Verify request from Slack
    const slackSigningSecret = process.env.SLACK_SIGNING_SECRET
    if (!slackSigningSecret) {
      logger.warn("Slack signing secret not configured")
      return res.status(400).json({ error: "Not configured" })
    }

    // In production, verify the signature
    // const signature = req.headers['x-slack-request-timestamp'] + ':' + req.rawBody;
    // Implement signature verification here

    const result = await slackService.handleSlackEvent(body)
    res.json(result)
  } catch (error) {
    logger.error("Slack event handler error:", error.message)
    res.status(500).json({ error: error.message })
  }
})

/**
 * POST /api/slack/message - Send custom Slack message
 */
router.post("/message", async (req, res, next) => {
  try {
    const { text, blocks } = req.body

    if (!text && !blocks) {
      return res.status(400).json({
        success: false,
        error: "Text or blocks required",
      })
    }

    const message = { text, ...(blocks && { blocks }) }
    const result = await slackService.sendWebhookMessage(message)

    res.json({
      success: true,
      data: result,
    })
  } catch (error) {
    next(error)
  }
})

module.exports = router
