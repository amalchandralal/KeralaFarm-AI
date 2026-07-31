
const genAI = require("../config/gemini");

const voiceAssistant = async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) return res.status(400).json({ error: "No question provided" });

    // FIX 1: Use a valid model name (gemini-1.5-flash)
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash", 
      systemInstruction:
        "You are an expert agricultural AI. Provide highly specific, direct, and actionable answers strictly addressing the user's question. Avoid conversational filler, generic greetings, and broad advice. Focus entirely on precise measurements (e.g. 2.5ml/L), specific names of pesticides/fertilizers, exact timelines, and concrete steps. Keep responses under 4 sentences. Never use markdown formatting (no stars, hashes, or bullet points) — write in plain text designed to be read aloud smoothly.",
    });

    const result = await model.generateContent(`Farmer Question: ${question}`);
    const rawAnswer = result.response.text();

    // Clean up stars/markdown so the text-to-speech doesn't read "star star"
    const cleanAnswer = rawAnswer.replace(/\*/g, '');

    res.json({ question, answer: cleanAnswer });
  } catch (err) {
    // Check your terminal! This log will show the specific API error.
    console.error("Voice Assistant Error:", err.message);
    res.status(500).json({ error: "Failed to process voice query", details: err.message });
  }
};

const translate = async (req, res) => {
  try {
    const { text } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(
      `Translate this to Malayalam. Return only the translated text, nothing else:\n\n${text}`
    );
    res.json({ translated: result.response.text().trim() });
  } catch (err) {
    res.status(500).json({ error: "Translation failed" });
  }
};

module.exports = { voiceAssistant, translate };