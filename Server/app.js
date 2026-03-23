require("dotenv").config({ path: require("path").join(__dirname, ".env") });
const express = require("express");
const cors = require("cors");

const app = express();

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173";

app.use(
  cors({
    origin: FRONTEND_ORIGIN,
  })
);

app.use(express.json());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/quotes", require("./routes/quotes"));

app.get("/", (req, res) => res.send("API running"));

module.exports = app;
