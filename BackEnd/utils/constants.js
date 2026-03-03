const JWT_SECRET = process.env.JWT_SECRET || "Navi";

const DISEASE_SCHEMA = {
  type: "object",
  properties: {
    disease_name:        { type: "string" },
    possible_causes:     { type: "string" },
    suggested_treatment: { type: "string" },
    fertilizer_guidance: { type: "string" },
    confidence_level:    { type: "string" },
  },
  required: ["disease_name", "possible_causes", "suggested_treatment"],
};

module.exports = { JWT_SECRET, DISEASE_SCHEMA };