// server/models/Quote.js
const mongoose = require("mongoose");

const QuoteSchema = new mongoose.Schema(
  {
    qoute: { type: String, required: true },
    author: { type: String, default: "Unknown" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // who saved this quote
  },
  { timestamps: true }
);

module.exports = mongoose.model("Quote", QuoteSchema);
