const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/constants");

/**
 * Resolves user data from JWT cookie.
 * Use as a utility in controllers rather than a route middleware,
 * to keep the same behaviour as the original code.
 */
const getUserFromToken = (req) => {
  return new Promise((resolve, reject) => {
    const { token } = req.cookies;
    if (!token) return reject(new Error("Not logged in"));
    jwt.verify(token, JWT_SECRET, {}, (err, userData) => {
      if (err) return reject(err);
      resolve(userData);
    });
  });
};

/**
 * Express middleware that attaches userData to req or returns 401.
 */
const requireAuth = async (req, res, next) => {
  try {
    req.userData = await getUserFromToken(req);
    next();
  } catch {
    res.status(401).json({ error: "Not authenticated" });
  }
};

module.exports = { getUserFromToken, requireAuth };