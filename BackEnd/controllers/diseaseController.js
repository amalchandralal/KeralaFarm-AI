const fs = require("fs");
const genAI = require("../config/gemini");
const { DISEASE_SCHEMA } = require("../utils/constants");

const detectDisease = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No image uploaded" });

    const imageBuffer = fs.readFileSync(req.file.path);
    const base64Image = imageBuffer.toString("base64");

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction:
        "You are an expert plant pathologist. Analyze crop images. If a disease is found, provide details. If the plant is healthy, indicate that. Always return response in JSON.",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: DISEASE_SCHEMA,
      },
    });

    const result = await model.generateContent([
      { inlineData: { mimeType: req.file.mimetype, data: base64Image } },
      "Identify the plant disease in this image and provide treatment and fertilizer guidance.",
    ]);

    const jsonResponse = JSON.parse(result.response.text());
    fs.unlinkSync(req.file.path);
    res.json(jsonResponse);
  } catch (err) {
    console.error("Gemini Error:", err.message);
    res.status(500).json({ error: "Failed to analyze image. Please try again." });
  }
};

module.exports = { detectDisease };