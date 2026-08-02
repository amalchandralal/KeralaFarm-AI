const express = require("express");
const router = express.Router();
const { register, login, profile, logout } = require("../controllers/authController");
const { requireAuth } = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/profile", requireAuth, profile);
router.post("/logout", requireAuth, logout);

module.exports = router;