const genAI = require("../../config/gemini");
const logger = require("../../utils/logger");

async function askVoiceAssistant(question) {
  if (!question) {
    throw { status: 400, message: "No question provided" };
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: { maxOutputTokens: 300 },
      systemInstruction:
        "You are an expert agricultural AI. Provide highly specific, direct, and actionable answers strictly addressing the user's question. Avoid conversational filler, generic greetings, and broad advice. Focus entirely on precise measurements (e.g. 2.5ml/L), specific names of pesticides/fertilizers, exact timelines, and concrete steps. Keep responses under 4 sentences. Never use markdown formatting (no stars, hashes, or bullet points) — write in plain text designed to be read aloud smoothly.",
    });

    const result = await model.generateContent(`Farmer Question: ${question}`);
    const rawAnswer = result.response.text();
    const cleanAnswer = rawAnswer.replace(/\*/g, "");

    return { question, answer: cleanAnswer };
  } catch (err) {
    logger.error(`Voice Assistant Error: ${err.message}`);
    throw { status: 500, message: "Failed to process voice query", details: err.message };
  }
}

async function translateText(text, targetLang = "Malayalam") {
  if (!text) {
    throw { status: 400, message: "No text provided for translation" };
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(
      `Translate this to ${targetLang}. Return only the translated text, nothing else:\n\n${text}`
    );
    return { translated: result.response.text().trim() };
  } catch (err) {
    logger.error(`Translation Error: ${err.message}`);
    throw { status: 500, message: "Translation failed" };
  }
}

async function generateTTSAudio(text, lang = "ml") {
  if (!text) {
    throw { status: 400, message: "No text provided" };
  }

  try {
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${lang}&client=tw-ob`;
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    if (!response.ok) {
      logger.error(`TTS upstream error: ${response.status} ${response.statusText}`);
      throw { status: 502, message: "TTS service unavailable" };
    }

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (err) {
    if (err.status) throw err;
    logger.error(`TTS Error: ${err.message}`);
    throw { status: 500, message: "TTS failed" };
  }
}

module.exports = {
  askVoiceAssistant,
  translateText,
  generateTTSAudio,
};
