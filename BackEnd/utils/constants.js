require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET || "agrovision_default_jwt_secret_key_2026";

const DISEASE_SCHEMA = {
  type: "object",
  properties: {
    disease_name:        { type: "string" },
    possible_causes:     { type: "string" },
    suggested_treatment: { type: "string" },
    fertilizer_guidance: { type: "string" },
    confidence_level:    { type: "number", description: "Confidence percentage from 0 to 100" },
  },
  required: ["disease_name", "possible_causes", "suggested_treatment", "confidence_level"],
};

module.exports = { JWT_SECRET, DISEASE_SCHEMA };