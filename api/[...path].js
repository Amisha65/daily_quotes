import { createRequire } from "module";

const require = createRequire(import.meta.url);
const connectDB = require("../Server/config/db");
const app = require("../Server/app");

let connectionPromise;

export default async function handler(req, res) {
  if (!connectionPromise) {
    connectionPromise = connectDB(process.env.MONGO_URI);
  }

  await connectionPromise;
  return app(req, res);
}
