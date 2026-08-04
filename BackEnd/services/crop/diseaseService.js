const fs = require("fs");
const genAI = require("../../config/gemini");
const { DISEASE_SCHEMA } = require("../../utils/constants");
const logger = require("../../utils/logger");

async function analyzeCropDisease(file) {
  if (!file) {
    throw { status: 400, message: "No image uploaded" };
  }

  try {
    const imageBuffer = fs.readFileSync(file.path);
    const base64Image = imageBuffer.toString("base64");

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction:
        'You are an expert plant pathologist. Analyze crop images. Identify the plant disease, possible causes, suggested treatment, fertilizer guidance, and a confidence level integer between 0 and 100. Return strictly a JSON object with keys: "disease_name", "possible_causes", "suggested_treatment", "fertilizer_guidance", "confidence_level". Do not include markdown code block formatting.',
      generationConfig: {
        responseMimeType: "application/json",
        maxOutputTokens: 500,
      },
    });

    const result = await model.generateContent([
      { inlineData: { mimeType: file.mimetype || "image/jpeg", data: base64Image } },
      "Identify the plant disease in this image and provide treatment and fertilizer guidance.",
    ]);

    let text = result.response.text().trim();
    if (text.startsWith("```")) {
      text = text.replace(/^```json/i, "").replace(/^```/, "").replace(/```$/, "").trim();
    }

    const jsonResponse = JSON.parse(text);
    return jsonResponse;
  } catch (err) {
    logger.error(`Disease Analysis Error: ${err.message}`);
    throw { status: 500, message: `Failed to analyze image: ${err.message}` };
  } finally {
    if (file && file.path && fs.existsSync(file.path)) {
      try {
        fs.unlinkSync(file.path);
      } catch (e) {
        logger.error(`Failed to cleanup uploaded file: ${e.message}`);
      }
    }
  }
}

module.exports = { analyzeCropDisease };
