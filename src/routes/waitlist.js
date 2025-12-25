const express = require("express");
const Waitlist = require("../models/Waitlist");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const existing = await Waitlist.findOne({ email });

    if (existing) {
      return res.status(200).json({
        message: "You're already on the waitlist",
        email: existing.email,
      });
    }

    const entry = await Waitlist.create({ email });

    return res.status(201).json({
      message: "Successfully joined the waitlist",
      email: entry.email,
    });
  } catch (err) {
    console.error(err);

    if (err.code === 11000) {
      return res.status(200).json({ message: "Email already registered" });
    }

    return res.status(500).json({ message: "Something went wrong" });
  }
});

module.exports = router;
