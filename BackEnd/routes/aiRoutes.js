const express = require("express");
const router = express.Router();
const photosMiddleware = require("../middleware/upload");
const { detectDisease } = require("../controllers/diseaseController");
const { voiceAssistant, translate } = require("../controllers/aiController");

router.post("/detect-disease", photosMiddleware.single("image"), detectDisease);
router.post("/voice-assistant", voiceAssistant);
router.post("/translate", translate);

module.exports = router;