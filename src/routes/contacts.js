const express = require("express")
const router = express.Router()
const Contact = require("../models/Contact")
const { validateContact, handleValidation } = require("../middleware/validation")
const slackService = require("../services/slackService")
const emailService = require("../services/emailService")
const logger = require("../utils/logger")

/**
 * POST /api/contact - Submit a new contact form
 */
router.post("/", validateContact, handleValidation, async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body

    const contact = new Contact({
      name,
      email,
      phone,
      subject,
      message,
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    })

    await contact.save()
    logger.info(`Contact created: ${contact._id}`)

    // Send emails
    try {
      await emailService.sendContactConfirmation(contact)
      await emailService.sendAdminNotification(contact)
    } catch (emailError) {
      logger.error("Email sending failed, continuing:", emailError.message)
    }

    // Send to Slack
    try {
      const slackMessage = slackService.formatContactNotification(contact)
      const slackResponse = await slackService.sendWebhookMessage(slackMessage)
      contact.slackMessageId = slackResponse?.ts || null
      await contact.save()
    } catch (slackError) {
      logger.error("Slack notification failed, continuing:", slackError.message)
    }

    res.status(201).json({
      success: true,
      message: "Contact submitted successfully",
      data: {
        id: contact._id,
        email: contact.email,
      },
    })
  } catch (error) {
    next(error)
  }
})

/**
 * GET /api/contact - List all contacts (protected)
 */
router.get("/", async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query
    const query = {}

    if (status) query.status = status

    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Contact.countDocuments(query)

    res.json({
      success: true,
      data: contacts,
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
 * GET /api/contact/:id - Get single contact
 */
router.get("/:id", async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id)

    if (!contact) {
      return res.status(404).json({
        success: false,
        error: "Contact not found",
      })
    }

    res.json({
      success: true,
      data: contact,
    })
  } catch (error) {
    next(error)
  }
})

/**
 * PATCH /api/contact/:id/status - Update contact status
 */
router.patch("/:id/status", async (req, res, next) => {
  try {
    const { status } = req.body
    const validStatuses = ["new", "read", "in-progress", "resolved"]

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: "Invalid status",
      })
    }

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: new Date() },
      { new: true, runValidators: true },
    )

    if (!contact) {
      return res.status(404).json({
        success: false,
        error: "Contact not found",
      })
    }

    res.json({
      success: true,
      data: contact,
    })
  } catch (error) {
    next(error)
  }
})

/**
 * DELETE /api/contact/:id - Delete contact
 */
router.delete("/:id", async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id)

    if (!contact) {
      return res.status(404).json({
        success: false,
        error: "Contact not found",
      })
    }

    res.json({
      success: true,
      message: "Contact deleted successfully",
    })
  } catch (error) {
    next(error)
  }
})

module.exports = router
