const getTTS = async (req, res) => {
  try {
    const { text, lang = "ml" } = req.query;
    if (!text) return res.status(400).json({ error: "No text" });

    const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${lang}&client=tw-ob`;
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    const buffer = await response.arrayBuffer();
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.send(Buffer.from(buffer));
  } catch (err) {
    console.error("TTS Error:", err.message);
    res.status(500).json({ error: "TTS failed" });
  }
};

module.exports = { getTTS };