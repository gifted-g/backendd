const { body, validationResult } = require("express-validator")
const logger = require("../utils/logger")

const validateContact = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be 2-100 characters"),
  body("email").trim().isEmail().withMessage("Valid email is required"),
  body("phone")
    .optional()
    .trim()
    .matches(/^[+]?[0-9\s-()]+$/)
    .withMessage("Invalid phone format"),
  body("subject")
    .trim()
    .notEmpty()
    .withMessage("Subject is required")
    .isLength({ min: 3, max: 200 })
    .withMessage("Subject must be 3-200 characters"),
  body("message")
    .trim()
    .notEmpty()
    .withMessage("Message is required")
    .isLength({ min: 10, max: 5000 })
    .withMessage("Message must be 10-5000 characters"),
]

const validateNewsletter = [
  body("email").trim().isEmail().withMessage("Valid email is required"),
  body("name").optional().trim().isLength({ max: 100 }).withMessage("Name must be less than 100 characters"),
]

const handleValidation = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    logger.warn("Validation errors:", errors.array())
    return res.status(400).json({
      success: false,
      error: "Validation failed",
      errors: errors.array(),
    })
  }
  next()
}

module.exports = {
  validateContact,
  validateNewsletter,
  handleValidation,
}
