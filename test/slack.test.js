const slackService = require("../src/services/slackService")
const Contact = require("../src/models/Contact")

describe("Slack Service", () => {
  describe("formatContactNotification", () => {
    test("Should format contact notification correctly", () => {
      const contact = {
        _id: "test-id",
        name: "John Doe",
        email: "john@example.com",
        phone: "+1234567890",
        subject: "Test Subject",
        message: "Test message",
        createdAt: new Date(),
      }

      const formatted = slackService.formatContactNotification(contact)

      expect(formatted.text).toContain("New Contact Submission")
      expect(formatted.blocks).toBeDefined()
      expect(formatted.blocks[0].type).toBe("header")
    })
  })

  describe("formatNewsletterNotification", () => {
    test("Should format newsletter notification correctly", () => {
      const subscriber = {
        email: "sub@example.com",
        name: "Subscriber",
        createdAt: new Date(),
      }

      const formatted = slackService.formatNewsletterNotification(subscriber)

      expect(formatted.text).toContain("New Newsletter Subscriber")
      expect(formatted.blocks).toBeDefined()
    })
  })

  describe("handleSlackEvent", () => {
    test("Should handle url_verification challenge", async () => {
      const event = {
        type: "url_verification",
        challenge: "test-challenge-123",
      }

      const result = await slackService.handleSlackEvent(event)

      expect(result.challenge).toBe("test-challenge-123")
    })

    test("Should handle event_callback", async () => {
      const event = {
        type: "event_callback",
        inner_event: {
          type: "message",
        },
      }

      const result = await slackService.handleSlackEvent(event)

      expect(result.ok).toBe(true)
    })
  })
})
