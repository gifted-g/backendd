const nodemailer = require("nodemailer")
const logger = require("../utils/logger")

class EmailService {
  constructor() {
    this.transporter = this.initializeTransporter()
  }

  initializeTransporter() {
    const emailProvider = process.env.EMAIL_PROVIDER || "gmail"

    switch (emailProvider) {
      case "gmail":
        return nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS,
          },
        })

      case "sendgrid":
        return nodemailer.createTransport({
          host: "smtp.sendgrid.net",
          port: 587,
          auth: {
            user: "apikey",
            pass: process.env.SENDGRID_API_KEY,
          },
        })

      case "smtp":
        return nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT,
          secure: process.env.SMTP_SECURE === "true",
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        })

      default:
        logger.warn("No email provider configured, using test account")
        return null
    }
  }

  async sendContactConfirmation(contact) {
    const mailOptions = {
      from: process.env.EMAIL_FROM || "noreply@example.com",
      to: contact.email,
      subject: "We received your message",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Thank you for reaching out!</h2>
          <p>Hi ${contact.name},</p>
          <p>We received your message and will get back to you as soon as possible.</p>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3>Your Submission:</h3>
            <p><strong>Subject:</strong> ${contact.subject}</p>
            <p><strong>Message:</strong> ${contact.message}</p>
          </div>
          <p>Best regards,<br>The Team</p>
        </div>
      `,
    }

    return this.sendEmail(mailOptions)
  }

  async sendAdminNotification(contact) {
    const mailOptions = {
      from: process.env.EMAIL_FROM || "noreply@example.com",
      to: process.env.ADMIN_EMAIL || "admin@example.com",
      subject: `New Contact: ${contact.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>New Contact Submission</h2>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px;">
            <p><strong>Name:</strong> ${contact.name}</p>
            <p><strong>Email:</strong> ${contact.email}</p>
            <p><strong>Phone:</strong> ${contact.phone || "N/A"}</p>
            <p><strong>Subject:</strong> ${contact.subject}</p>
            <p><strong>Message:</strong> ${contact.message}</p>
            <p><strong>Submitted:</strong> ${new Date(contact.createdAt).toLocaleString()}</p>
          </div>
        </div>
      `,
    }

    return this.sendEmail(mailOptions)
  }

  async sendNewsletterWelcome(subscriber) {
    const mailOptions = {
      from: process.env.EMAIL_FROM || "noreply@example.com",
      to: subscriber.email,
      subject: "Welcome to our newsletter!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome!</h2>
          <p>Hi ${subscriber.name || "there"},</p>
          <p>Thank you for subscribing to our newsletter. You'll be the first to know about our latest updates and offers.</p>
          <p>Best regards,<br>The Team</p>
        </div>
      `,
    }

    return this.sendEmail(mailOptions)
  }

  async sendEmail(mailOptions) {
    if (!this.transporter) {
      logger.warn("Email transporter not configured")
      return { messageId: "test-id", success: false }
    }

    try {
      const info = await this.transporter.sendMail(mailOptions)
      logger.info("Email sent successfully:", info.messageId)
      return info
    } catch (error) {
      logger.error("Failed to send email:", error.message)
      throw new Error(`Email sending failed: ${error.message}`)
    }
  }

  async verifyConnection() {
    if (!this.transporter) return false

    try {
      await this.transporter.verify()
      logger.info("Email service verified")
      return true
    } catch (error) {
      logger.error("Email verification failed:", error.message)
      return false
    }
  }
}

module.exports = new EmailService()
