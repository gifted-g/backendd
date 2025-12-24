const axios = require("axios")
const logger = require("../utils/logger")

class SlackService {
  constructor() {
    this.webhookUrl = process.env.SLACK_WEBHOOK_URL
    this.botToken = process.env.SLACK_BOT_TOKEN
  }

  /**
   * Send a notification to Slack webhook
   */
  async sendWebhookMessage(message) {
    if (!this.webhookUrl) {
      logger.warn("Slack webhook URL not configured")
      return null
    }

    try {
      const response = await axios.post(this.webhookUrl, message)
      logger.info("Slack message sent successfully")
      return response.data
    } catch (error) {
      logger.error("Failed to send Slack message:", error.message)
      throw new Error(`Slack notification failed: ${error.message}`)
    }
  }

  /**
   * Format contact form submission for Slack
   */
  formatContactNotification(contact) {
    return {
      text: `New Contact Submission from ${contact.name}`,
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: "📬 New Contact Submission",
            emoji: true,
          },
        },
        {
          type: "section",
          fields: [
            {
              type: "mrkdwn",
              text: `*Name:*\n${contact.name}`,
            },
            {
              type: "mrkdwn",
              text: `*Email:*\n${contact.email}`,
            },
            {
              type: "mrkdwn",
              text: `*Phone:*\n${contact.phone || "N/A"}`,
            },
            {
              type: "mrkdwn",
              text: `*Subject:*\n${contact.subject}`,
            },
          ],
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*Message:*\n${contact.message}`,
          },
        },
        {
          type: "context",
          elements: [
            {
              type: "mrkdwn",
              text: `Submitted at: ${new Date(contact.createdAt).toLocaleString()}`,
            },
          ],
        },
        {
          type: "actions",
          elements: [
            {
              type: "button",
              text: {
                type: "plain_text",
                text: "View in Dashboard",
                emoji: true,
              },
              value: contact._id?.toString(),
              action_id: "view_contact",
            },
          ],
        },
      ],
    }
  }

  /**
   * Format newsletter signup for Slack
   */
  formatNewsletterNotification(subscriber) {
    return {
      text: `New Newsletter Subscriber: ${subscriber.email}`,
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `📧 *New Newsletter Subscriber*\n\nEmail: ${subscriber.email}\nName: ${subscriber.name || "Not provided"}\nTime: ${new Date(subscriber.createdAt).toLocaleString()}`,
          },
        },
      ],
    }
  }

  /**
   * Handle Slack event subscriptions
   */
  async handleSlackEvent(event) {
    logger.info("Slack event received:", event.type)

    if (event.type === "url_verification") {
      return { challenge: event.challenge }
    }

    if (event.type === "event_callback") {
      const { inner_event } = event
      logger.info("Inner event:", inner_event.type)
      // Handle different event types as needed
    }

    return { ok: true }
  }

  /**
   * Send direct message via Slack Bot
   */
  async sendDirectMessage(userId, text) {
    if (!this.botToken) {
      logger.warn("Slack bot token not configured")
      return null
    }

    try {
      const response = await axios.post(
        "https://slack.com/api/chat.postMessage",
        {
          channel: userId,
          text: text,
        },
        {
          headers: {
            Authorization: `Bearer ${this.botToken}`,
            "Content-Type": "application/json",
          },
        },
      )

      if (!response.data.ok) {
        throw new Error(response.data.error)
      }

      return response.data
    } catch (error) {
      logger.error("Failed to send direct message:", error.message)
      throw error
    }
  }

  /**
   * Update message reaction
   */
  async updateMessageReaction(channelId, timestamp, emoji) {
    if (!this.botToken) {
      logger.warn("Slack bot token not configured")
      return null
    }

    try {
      const response = await axios.post(
        "https://slack.com/api/reactions.add",
        {
          channel: channelId,
          timestamp: timestamp,
          name: emoji,
        },
        {
          headers: {
            Authorization: `Bearer ${this.botToken}`,
            "Content-Type": "application/json",
          },
        },
      )

      return response.data
    } catch (error) {
      logger.error("Failed to update message reaction:", error.message)
      throw error
    }
  }
}

module.exports = new SlackService()
