const connectDB = require("../Server/config/db");
const app = require("../Server/app");

let connectionPromise;

module.exports = async (req, res) => {
  if (!connectionPromise) {
    connectionPromise = connectDB(process.env.MONGO_URI);
  }

  await connectionPromise;
  return app(req, res);
};
