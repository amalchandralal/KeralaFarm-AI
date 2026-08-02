const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../../models/User");
const { JWT_SECRET } = require("../../utils/constants");
const { blacklistToken } = require("../../lib/redis");

async function registerUser({ name, email, password }) {
  if (!name || !email || !password) {
    throw { status: 400, message: "Name, email, and password are required" };
  }
  if (password.length < 6) {
    throw { status: 400, message: "Password must be at least 6 characters long" };
  }

  const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
  if (existingUser) {
    throw { status: 400, message: "User with this email already exists" };
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password: hashedPassword,
  });

  const userObj = user.toObject();
  delete userObj.password;
  return userObj;
}

async function loginUser({ email, password }) {
  if (!email || !password) {
    throw { status: 400, message: "Email and password are required" };
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user) {
    throw { status: 404, message: "User not found" };
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw { status: 422, message: "Password incorrect" };
  }

  const token = jwt.sign(
    { email: user.email, id: user._id, name: user.name },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  const userObj = user.toObject();
  delete userObj.password;
  return { user: userObj, token };
}

async function getUserProfile(userId) {
  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw { status: 404, message: "User profile not found" };
  }
  return user;
}

async function logoutUser(token) {
  if (token) {
    // Blacklist token in Redis for 7 days (matching JWT expiry)
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
