const request = require("supertest")
const app = require("../server")
const Contact = require("../src/models/Contact")
const { connectDB, disconnectDB } = require("../src/config/database")

describe("Contact API", () => {
  beforeAll(async () => {
    await connectDB()
  })

  afterAll(async () => {
    await disconnectDB()
  })

  beforeEach(async () => {
    await Contact.deleteMany({})
  })

  describe("POST /api/contact", () => {
    test("Should create a new contact with valid data", async () => {
      const contactData = {
        name: "John Doe",
        email: "john@example.com",
        phone: "+1234567890",
        subject: "Test Subject",
        message: "This is a test message with sufficient length",
      }

      const response = await request(app).post("/api/contact").send(contactData)

      expect(response.status).toBe(201)
      expect(response.body.success).toBe(true)
      expect(response.body.data.email).toBe(contactData.email)

      const savedContact = await Contact.findOne({ email: contactData.email })
      expect(savedContact).toBeTruthy()
      expect(savedContact.name).toBe(contactData.name)
    })

    test("Should reject invalid email", async () => {
      const contactData = {
        name: "John Doe",
        email: "invalid-email",
        subject: "Test",
        message: "This is a valid message with proper length requirements",
      }

      const response = await request(app).post("/api/contact").send(contactData)

      expect(response.status).toBe(400)
      expect(response.body.success).toBe(false)
    })

    test("Should reject short message", async () => {
      const contactData = {
        name: "John Doe",
        email: "john@example.com",
        subject: "Test",
        message: "Too short",
      }

      const response = await request(app).post("/api/contact").send(contactData)

      expect(response.status).toBe(400)
      expect(response.body.success).toBe(false)
    })

    test("Should reject missing required fields", async () => {
      const contactData = {
        name: "John Doe",
      }

      const response = await request(app).post("/api/contact").send(contactData)

      expect(response.status).toBe(400)
      expect(response.body.success).toBe(false)
    })
  })

  describe("GET /api/contact", () => {
    test("Should return all contacts", async () => {
      await Contact.create({
        name: "Test User",
        email: "test@example.com",
        subject: "Test",
        message: "This is a test message with sufficient length",
      })

      const response = await request(app).get("/api/contact")

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data.length).toBe(1)
    })

    test("Should filter by status", async () => {
      await Contact.create({
        name: "Test User",
        email: "test@example.com",
        subject: "Test",
        message: "This is a test message with sufficient length",
        status: "new",
      })

      const response = await request(app).get("/api/contact").query({ status: "new" })

      expect(response.status).toBe(200)
      expect(response.body.data.length).toBe(1)
    })

    test("Should paginate results", async () => {
      for (let i = 0; i < 15; i++) {
        await Contact.create({
          name: `User ${i}`,
          email: `user${i}@example.com`,
          subject: `Subject ${i}`,
          message: `This is test message number ${i} with sufficient length`,
        })
      }

      const response = await request(app).get("/api/contact").query({ page: 1, limit: 10 })

      expect(response.status).toBe(200)
      expect(response.body.data.length).toBe(10)
      expect(response.body.pagination.total).toBe(15)
      expect(response.body.pagination.pages).toBe(2)
    })
  })

  describe("PATCH /api/contact/:id/status", () => {
    test("Should update contact status", async () => {
      const contact = await Contact.create({
        name: "Test User",
        email: "test@example.com",
        subject: "Test",
        message: "This is a test message with sufficient length",
      })

      const response = await request(app).patch(`/api/contact/${contact._id}/status`).send({ status: "in-progress" })

      expect(response.status).toBe(200)
      expect(response.body.data.status).toBe("in-progress")
    })

    test("Should reject invalid status", async () => {
      const contact = await Contact.create({
        name: "Test User",
        email: "test@example.com",
        subject: "Test",
        message: "This is a test message with sufficient length",
      })

      const response = await request(app).patch(`/api/contact/${contact._id}/status`).send({ status: "invalid" })

      expect(response.status).toBe(400)
      expect(response.body.success).toBe(false)
    })
  })

  describe("DELETE /api/contact/:id", () => {
    test("Should delete a contact", async () => {
      const contact = await Contact.create({
        name: "Test User",
        email: "test@example.com",
        subject: "Test",
        message: "This is a test message with sufficient length",
      })

      const response = await request(app).delete(`/api/contact/${contact._id}`)

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)

      const deleted = await Contact.findById(contact._id)
      expect(deleted).toBeNull()
    })
  })
})
