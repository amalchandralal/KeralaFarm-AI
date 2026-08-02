const Redis = require("ioredis");
const logger = require("../utils/logger");

let redisClient = null;
let isRedisConnected = false;

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

try {
  redisClient = new Redis(redisUrl, {
    maxRetriesPerRequest: 1,
    enableOfflineQueue: false,
    retryStrategy(times) {
      if (times > 3) {
        return null; // Stop retrying after 3 attempts if Redis is not running locally
      }
      return Math.min(times * 100, 1000);
    },
  });

  redisClient.on("connect", () => {
    isRedisConnected = true;
    logger.info("Connected to Redis server successfully");
  });

  redisClient.on("error", (err) => {
    isRedisConnected = false;
    logger.warn(`Redis connection warning: ${err.message}. Operating in fallback mode.`);
  });
} catch (err) {
  logger.warn(`Failed to initialize Redis client: ${err.message}`);
}

/**
 * Blacklist a token in Redis until its expiration time.
 */
async function blacklistToken(token, ttlSeconds = 604800) {
  if (!isRedisConnected || !redisClient) return false;
  try {
    await redisClient.set(`bl_${token}`, "true", "EX", ttlSeconds);
    return true;
  } catch (err) {
    logger.error(`Redis blacklist error: ${err.message}`);
    return false;
  }
}

/**
 * Check if a token is blacklisted in Redis.
 */
async function isTokenBlacklisted(token) {
  if (!isRedisConnected || !redisClient) return false;
  try {
    const res = await redisClient.get(`bl_${token}`);
    return res === "true";
  } catch (err) {
    logger.error(`Redis check blacklist error: ${err.message}`);
    return false;
  }
}

module.exports = {
  redisClient,
  isRedisConnected: () => isRedisConnected,
  blacklistToken,
  isTokenBlacklisted,
};
