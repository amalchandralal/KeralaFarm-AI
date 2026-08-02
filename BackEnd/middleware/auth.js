const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/constants");
const { isTokenBlacklisted } = require("../lib/redis");

/**
 * Synchronously verifies a JWT token and returns the decoded payload.
 * Returns null if the token is missing or invalid.
 */
function getUserFromToken(token) {
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

/**
 * Express middleware that extracts the JWT from cookies or Authorization header,
 * checks Redis blacklist, verifies it, and attaches the decoded payload to req.userData.
 * Returns 401 if the token is missing, blacklisted, or invalid.
 */
async function requireAuth(req, res, next) {
  const token =
    req.cookies?.token || req.headers.authorization?.split(" ")[1];

  if (token && (await isTokenBlacklisted(token))) {
    return res.status(401).json({ error: "Session expired or logged out. Please login again." });
  }

  const userData = getUserFromToken(token);
  if (!userData) {
    return res.status(401).json({ error: "Authentication required" });
  }
  req.userData = userData;
  next();
}

module.exports = { getUserFromToken, requireAuth };