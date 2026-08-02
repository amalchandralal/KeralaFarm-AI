const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../../models/User");
const { JWT_SECRET } = require("../../utils/constants");
const { blacklistToken } = require("../../lib/redis");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function registerUser({ name, email, password }) {
  if (!name || !email || !password) {
    throw { status: 400, message: "Name, email, and password are required" };
  }

  const cleanName = name.trim();
  const cleanEmail = email.toLowerCase().trim();

  if (!EMAIL_REGEX.test(cleanEmail)) {
    throw { status: 400, message: "Please provide a valid email address" };
  }

  if (password.length < 6) {
    throw { status: 400, message: "Password must be at least 6 characters long" };
  }

  // Fast existence check using MongoDB index
  const existingUser = await User.exists({ email: cleanEmail });
  if (existingUser) {
    throw { status: 400, message: "An account with this email address already exists. Please login or use a different email." };
  }

  try {
    // 10 salt rounds provides optimal industry standard security and 5x faster hashing (~50ms)
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: cleanName,
      email: cleanEmail,
      password: hashedPassword,
    });

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
    };
  } catch (err) {
    // Handle MongoDB duplicate key error (E11000) for email
    if (err.code === 11000) {
      throw { status: 400, message: "An account with this email address already exists. Please login or use a different email." };
    }
    throw { status: 400, message: err.message || "Registration failed" };
  }
}

async function loginUser({ email, password }) {
  if (!email || !password) {
    throw { status: 400, message: "Email and password are required" };
  }

  const cleanEmail = email.toLowerCase().trim();

  // Fast lean query selecting only necessary fields
  const user = await User.findOne({ email: cleanEmail }).select("_id name email password").lean();
  if (!user) {
    throw { status: 404, message: "No account found with this email address" };
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw { status: 422, message: "Incorrect password. Please try again." };
  }

  const token = jwt.sign(
    { email: user.email, id: user._id, name: user.name },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  return {
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
    },
    token,
  };
}

async function getUserProfile(userId) {
  const user = await User.findById(userId).select("-password").lean();
  if (!user) {
    throw { status: 404, message: "User profile not found" };
  }
  return user;
}

async function logoutUser(token) {
  if (token) {
    await blacklistToken(token, 604800);
  }
  return true;
}

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  logoutUser,
};
