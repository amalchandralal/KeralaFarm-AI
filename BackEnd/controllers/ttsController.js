const { generateTTSAudio } = require("../services/ai-orchestration/aiOrchestrationService");

const getTTS = async (req, res) => {
  try {
    const { text, lang = "ml" } = req.query;
    const audioBuffer = await generateTTSAudio(text, lang);

    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.send(audioBuffer);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
};

module.exports = { getTTS };