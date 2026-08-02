const { findNearbyPlaces } = require("../services/place/placeService");

const getPlaces = async (req, res) => {
  try {
    const result = await findNearbyPlaces(req.query);
    res.json(result);
  } catch (err) {
    res.status(err.status || 500).json({
      error: err.message || "Backend failed to process request",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

module.exports = { getPlaces };
