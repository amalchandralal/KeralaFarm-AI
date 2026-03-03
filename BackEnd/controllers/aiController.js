const genAI = require("../config/gemini");

const voiceAssistant = async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) return res.status(400).json({ error: "No question provided" });

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction:
        "You are an AI farming assistant for Kerala farmers. Answer in simple Malayalam if possible. Give short and clear farming advice.",
    });

    const result = await model.generateContent(`Farmer Question: ${question}`);
    res.json({ question, answer: result.response.text() });
  } catch (err) {
    console.error("Voice Assistant Error:", err.message);
    res.status(500).json({ error: "Failed to process voice query" });
  }
};

const translate = async (req, res) => {
  try {
    const { text } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(
      `Translate this to Malayalam. Return only the translated text, nothing else:\n\n${text}`
    );
    res.json({ translated: result.response.text().trim() });
  } catch (err) {
    res.status(500).json({ error: "Translation failed" });
  }
};

module.exports = { voiceAssistant, translate };