// server.js
require("dotenv").config({ path: require("path").join(__dirname, ".env") });
const connectDB = require("./config/db");
const app = require("./app");

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
