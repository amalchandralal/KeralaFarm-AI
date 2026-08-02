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

  const cleanEmail = email.toLowerCase().trim();

  // Explicit check for existing email
  const existingUser = await User.findOne({ email: cleanEmail });
  if (existingUser) {
    throw { status: 400, message: "An account with this email address already exists. Please login or use a different email." };
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword,
    });

    const userObj = user.toObject();
    delete userObj.password;
    return userObj;
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

  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user) {
    throw { status: 404, message: "User not found with this email" };
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw { status: 422, message: "Incorrect password" };
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
