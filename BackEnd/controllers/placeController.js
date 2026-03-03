const Place = require("../models/Place");

const getPlaces = async (req, res) => {
  res.json(await Place.find());
};

module.exports = { getPlaces };