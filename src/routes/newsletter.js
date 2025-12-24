const express = require("express")
const router = express.Router()
const Newsletter = require("../models/Newsletter")
const { validateNewsletter, handleValidation } = require("../middleware/validation")
const slackService = require("../services/slackService")
const emailService = require("../services/emailService")
const logger = require("../utils/logger")

/**
 * POST /api/newsletter - Subscribe to newsletter
 */
router.post("/", validateNewsletter, handleValidation, async (req, res, next) => {
  try {
    const { email, name } = req.body

    // Check if already subscribed
    let subscriber = await Newsletter.findOne({ email })

    if (subscriber) {
      if (subscriber.subscribed) {
        return res.status(400).json({
          success: false,
          error: "Already subscribed to newsletter",
        })
      }
      // Resubscribe
      subscriber.subscribed = true
      subscriber.verified = true
      await subscriber.save()
    } else {
      subscriber = new Newsletter({
        email,
        name,
        verified: true,
        subscribed: true,
      })
      await subscriber.save()
    }

    logger.info(`Newsletter subscriber added: ${subscriber._id}`)

    // Send welcome email
    try {
      await emailService.sendNewsletterWelcome(subscriber)
    } catch (emailError) {
      logger.error("Welcome email failed:", emailError.message)
    }

    // Notify Slack
    try {
      const slackMessage = slackService.formatNewsletterNotification(subscriber)
      await slackService.sendWebhookMessage(slackMessage)
    } catch (slackError) {
      logger.error("Slack notification failed:", slackError.message)
    }

    res.status(201).json({
      success: true,
      message: "Successfully subscribed to newsletter",
      data: {
        email: subscriber.email,
      },
    })
  } catch (error) {
    next(error)
  }
})

/**
 * GET /api/newsletter - List subscribers
 */
router.get("/", async (req, res, next) => {
  try {
    const { subscribed = true, page = 1, limit = 10 } = req.query

    const subscribers = await Newsletter.find({ subscribed })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select("email name createdAt")

    const total = await Newsletter.countDocuments({ subscribed })

    res.json({
      success: true,
      data: subscribers,
      pagination: {
        total,
        page: Number.parseInt(page),
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    next(error)
  }
})

/**
 * DELETE /api/newsletter/:email - Unsubscribe
 */
router.delete("/:email", async (req, res, next) => {
  try {
    const { email } = req.params

    const subscriber = await Newsletter.findOneAndUpdate({ email }, { subscribed: false }, { new: true })

    if (!subscriber) {
      return res.status(404).json({
        success: false,
        error: "Subscriber not found",
      })
    }

    res.json({
      success: true,
      message: "Successfully unsubscribed",
    })
  } catch (error) {
    next(error)
  }
})

module.exports = router
