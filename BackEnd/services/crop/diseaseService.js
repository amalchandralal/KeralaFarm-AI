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
      model: "gemini-2.5-flash",
      systemInstruction:
        "You are an expert plant pathologist. Analyze crop images. If a disease is found, provide details. If the plant is healthy, indicate that. Always return response in JSON.",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: DISEASE_SCHEMA,
      },
    });

    const result = await model.generateContent([
      { inlineData: { mimeType: file.mimetype, data: base64Image } },
      "Identify the plant disease in this image and provide treatment and fertilizer guidance.",
    ]);

    const jsonResponse = JSON.parse(result.response.text());
    return jsonResponse;
  } catch (err) {
    logger.error(`Disease Analysis Error: ${err.message}`);
    throw { status: 500, message: "Failed to analyze image. Please try again." };
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
