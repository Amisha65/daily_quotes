// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// FRONTEND_ORIGIN should match your dev server (vite) origin, e.g. http://localhost:5173
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173";

app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    // credentials: true, // not needed for header-only JWT flow
  })
);

app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/quotes", require("./routes/quotes"));

app.get("/", (req, res) => res.send("API running"));

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () => console.log("Server running on " + PORT));
  } catch (err) {
    console.error("Failed to start server:", err.message || err);
    process.exit(1);
  }
}

startServer();
