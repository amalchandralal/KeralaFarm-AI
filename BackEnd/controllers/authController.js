const authService = require("../services/auth/authService");

const isProduction = process.env.NODE_ENV === "production";

const register = async (req, res) => {
  try {
    const user = await authService.registerUser(req.body);
    res.json(user);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { user, token } = await authService.loginUser(req.body);
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
      })
      .json({ user, token });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
};

const profile = async (req, res) => {
  try {
    if (!req.userData?.id) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    const user = await authService.getUserProfile(req.userData.id);
    res.json(user);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
};

const logout = async (req, res) => {
  try {
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
    await authService.logoutUser(token);
    res
      .cookie("token", "", {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
      })
      .json(true);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { register, login, profile, logout };
