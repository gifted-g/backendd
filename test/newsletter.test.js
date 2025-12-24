const request = require("supertest")
const app = require("../server")
const Newsletter = require("../src/models/Newsletter")
const { connectDB, disconnectDB } = require("../src/config/database")

describe("Newsletter API", () => {
  beforeAll(async () => {
    await connectDB()
  })

  afterAll(async () => {
    await disconnectDB()
  })

  beforeEach(async () => {
    await Newsletter.deleteMany({})
  })

  describe("POST /api/newsletter", () => {
    test("Should subscribe to newsletter with valid email", async () => {
      const response = await request(app).post("/api/newsletter").send({
        email: "subscriber@example.com",
        name: "John Subscriber",
      })

      expect(response.status).toBe(201)
      expect(response.body.success).toBe(true)
      expect(response.body.data.email).toBe("subscriber@example.com")

      const subscriber = await Newsletter.findOne({ email: "subscriber@example.com" })
      expect(subscriber).toBeTruthy()
      expect(subscriber.subscribed).toBe(true)
    })

    test("Should reject duplicate subscription", async () => {
      await Newsletter.create({
        email: "subscriber@example.com",
        name: "John",
        subscribed: true,
        verified: true,
      })

      const response = await request(app).post("/api/newsletter").send({
        email: "subscriber@example.com",
        name: "John",
      })

      expect(response.status).toBe(400)
      expect(response.body.success).toBe(false)
    })

    test("Should reject invalid email", async () => {
      const response = await request(app).post("/api/newsletter").send({
        email: "invalid-email",
        name: "John",
      })

      expect(response.status).toBe(400)
      expect(response.body.success).toBe(false)
    })

    test("Should resubscribe unsubscribed user", async () => {
      await Newsletter.create({
        email: "subscriber@example.com",
        subscribed: false,
      })

      const response = await request(app).post("/api/newsletter").send({
        email: "subscriber@example.com",
        name: "John",
      })

      expect(response.status).toBe(201)
      expect(response.body.success).toBe(true)

      const subscriber = await Newsletter.findOne({ email: "subscriber@example.com" })
      expect(subscriber.subscribed).toBe(true)
    })
  })

  describe("GET /api/newsletter", () => {
    test("Should return all active subscribers", async () => {
      await Newsletter.create([
        { email: "user1@example.com", subscribed: true },
        { email: "user2@example.com", subscribed: true },
        { email: "user3@example.com", subscribed: false },
      ])

      const response = await request(app).get("/api/newsletter")

      expect(response.status).toBe(200)
      expect(response.body.data.length).toBe(2)
    })
  })

  describe("DELETE /api/newsletter/:email", () => {
    test("Should unsubscribe from newsletter", async () => {
      await Newsletter.create({
        email: "subscriber@example.com",
        subscribed: true,
      })

      const response = await request(app).delete("/api/newsletter/subscriber@example.com")

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)

      const subscriber = await Newsletter.findOne({ email: "subscriber@example.com" })
      expect(subscriber.subscribed).toBe(false)
    })

    test("Should return 404 for non-existent subscriber", async () => {
      const response = await request(app).delete("/api/newsletter/nonexistent@example.com")

      expect(response.status).toBe(404)
      expect(response.body.success).toBe(false)
    })
  })
})
