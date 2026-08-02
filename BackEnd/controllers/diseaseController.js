const { analyzeCropDisease } = require("../services/crop/diseaseService");

const detectDisease = async (req, res) => {
  try {
    const result = await analyzeCropDisease(req.file);
    res.json(result);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
};

module.exports = { detectDisease };