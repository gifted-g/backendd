// Jest setup file
const jest = require("jest") // Import jest to declare the variable

process.env.NODE_ENV = "test"
process.env.MONGODB_URI = process.env.MONGODB_TEST_URI || "mongodb://localhost:27017/landing-page-test"
process.env.SLACK_WEBHOOK_URL = "https://hooks.slack.com/services/test/webhook"
process.env.EMAIL_FROM = "test@example.com"
process.env.ADMIN_EMAIL = "admin@example.com"

// Mock console methods to reduce noise during tests
global.console.log = jest.fn()
global.console.error = jest.fn()
