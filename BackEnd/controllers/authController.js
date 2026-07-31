const isProduction = process.env.NODE_ENV === "production";
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { JWT_SECRET } = require("../utils/constants");
const bcrypt = require("bcryptjs");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters long" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: hashedPassword });
    const userResponse = user.toObject();
    delete userResponse.password;
    res.json(userResponse);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json("User not found");
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(422).json("Password incorrect");
    jwt.sign(
      { email: user.email, id: user._id },
      JWT_SECRET,
      { expiresIn: '7d' },
      (err, token) => {
        if (err)
          return res.status(500).json({ error: "Token generation failed" }); // ← fixed
        const userObj = user.toObject();
        delete userObj.password;
        res
          .cookie("token", token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
          })
          .json(userObj);
      },
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const profile = (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.json("Not logged in");
  jwt.verify(token, JWT_SECRET, {}, async (err, userData) => {
    if (err)
      return res
        .status(401)
        .json({ error: "Invalid token, please login again" }); // ← fixed
    const user = await User.findById(userData.id).select('-password');
    res.json(user);
  });
};

const logout = (req, res) => {
  res
    .cookie("token", "", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    })
    .json(true);
};

module.exports = { register, login, profile, logout };
