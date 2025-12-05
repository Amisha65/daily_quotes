// server/routes/quotes.js
const express = require("express");
const Quote = require("../models/Quote");
const auth = require("../middleware/auth"); // header-only JWT { id } middleware
const router = express.Router();
const mongoose = require("mongoose");

// GET /api/quotes -> get current user's saved quotes
router.get("/", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const quotes = await Quote.find({ user: userId }).sort({ createdAt: -1 });
    res.json(quotes);
  } catch (err) {
    console.error("Get saved quotes error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/quotes -> save a new quote for current user
router.post("/", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { qoute, author } = req.body || {};
    if (!qoute) return res.status(400).json({ error: "qoute required" });

    // Prevent duplicate saves for same user+quote
    const exists = await Quote.findOne({ user: userId, qoute });
    if (exists) return res.status(409).json({ error: "Already saved" });

    const newQuote = new Quote({ qoute, author, user: userId });
    await newQuote.save();
    res.status(201).json(newQuote);
  } catch (err) {
    console.error("Save quote error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE /api/quotes/:id -> delete quote owned by current user
router.delete("/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;

    // Validate id format first to avoid CastError
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid id" });
    }

    const userId = req.user.id;
    const quote = await Quote.findById(id);
    if (!quote) return res.status(404).json({ error: "Not found" });

    // ensure ownership
    if (quote.user.toString() !== userId) {
      return res.status(403).json({ error: "Not authorized" });
    }

    await Quote.findByIdAndDelete(id);
    res.json({ message: "Deleted", id });
  } catch (err) {
    console.error("Delete quote error:", err);
    res.status(500).json({ error: "Server error" });
  }
});
module.exports = router;
