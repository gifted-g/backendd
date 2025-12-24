const mongoose = require("mongoose")

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    phone: {
      type: String,
      trim: true,
      match: /^[+]?[0-9\s-()]+$/,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 200,
    },
    message: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 5000,
    },
    status: {
      type: String,
      enum: ["new", "read", "in-progress", "resolved"],
      default: "new",
    },
    source: {
      type: String,
      enum: ["contact-form", "newsletter", "api"],
      default: "contact-form",
    },
    slackMessageId: {
      type: String,
      default: null,
    },
    ipAddress: String,
    userAgent: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
)

// Index for queries
contactSchema.index({ email: 1, createdAt: -1 })
contactSchema.index({ status: 1, createdAt: -1 })

module.exports = mongoose.model("Contact", contactSchema)
