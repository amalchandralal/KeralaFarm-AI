const { askVoiceAssistant, translateText } = require("../services/ai-orchestration/aiOrchestrationService");

const voiceAssistant = async (req, res) => {
  try {
    const result = await askVoiceAssistant(req.body.question);
    res.json(result);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message, details: err.details });
  }
};

const translate = async (req, res) => {
  try {
    const result = await translateText(req.body.text, req.body.targetLang);
    res.json(result);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
};

module.exports = { voiceAssistant, translate };