// server/middleware/auth.js  (header-only, simple JWT { id } payload)
const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token, authorization denied" });
    }

    const token = header.split(" ")[1];
    const secret = process.env.JWT_SECRET || "devsecret";
    const decoded = jwt.verify(token, secret);

    // Expect payload { id: ... }
    const userId = decoded && decoded.id;
    if (!userId) {
      return res.status(401).json({ error: "Invalid token payload" });
    }

    req.user = { id: userId };
    next();
  } catch (err) {
    console.error("Auth middleware error:", err.message || err);
    return res.status(401).json({ error: "Token is not valid" });
  }
};
