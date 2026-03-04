const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { JWT_SECRET } = require("../utils/constants");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });
    const user = await User.create({ name, email, password });
    console.log("User Saved");
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json("User not found");
    if (user.password !== password)
      return res.status(422).json("Password incorrect");
    jwt.sign(
      { email: user.email, id: user._id },
      JWT_SECRET,
      {},
      (err, token) => {
        if (err)
          return res.status(500).json({ error: "Token generation failed" }); // ← fixed
        res
          .cookie("token", token, {
            httpOnly: true,
            secure: true, // ← required for HTTPS (Vercel/Render)
            sameSite: "none", // ← required for cross-domain cookies
          })
          .json(user);
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
    const user = await User.findById(userData.id);
    res.json(user);
  });
};

const logout = (req, res) => {
  res.cookie("token", "", {
  httpOnly: true,
  secure: true,
  sameSite: "none",
}).json(true)
};

module.exports = { register, login, profile, logout };
