/**
 * Text-to-Speech controller.
 *
 * WARNING: This uses Google Translate's unofficial, undocumented TTS endpoint.
 * It may be rate-limited or blocked without notice. For production use,
 * consider switching to Google Cloud Text-to-Speech API or another
 * official TTS service.
 */
const logger = require("../utils/logger");

const getTTS = async (req, res) => {
  try {
    const { text, lang = "ml" } = req.query;
    if (!text) return res.status(400).json({ error: "No text provided" });

    const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${lang}&client=tw-ob`;
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    if (!response.ok) {
      logger.error(`TTS upstream error: ${response.status} ${response.statusText}`);
      return res.status(502).json({ error: "TTS service unavailable" });
    }

    const buffer = await response.arrayBuffer();
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.send(Buffer.from(buffer));
  } catch (err) {
    logger.error("TTS Error:", err.message);
    res.status(500).json({ error: "TTS failed" });
  }
};

module.exports = { getTTS };