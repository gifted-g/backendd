const mongoose = require("mongoose")

const newsletterSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    name: {
      type: String,
      trim: true,
    },
    subscribed: {
      type: Boolean,
      default: true,
    },
    verificationToken: String,
    verified: {
      type: Boolean,
      default: false,
    },
    verifiedAt: Date,
    unsubscribeToken: String,
    tags: [String],
    metadata: mongoose.Schema.Types.Mixed,
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

newsletterSchema.index({ email: 1 })
newsletterSchema.index({ subscribed: 1, verified: 1 })

module.exports = mongoose.model("Newsletter", newsletterSchema)
