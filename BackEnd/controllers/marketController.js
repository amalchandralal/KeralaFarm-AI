const { fetchMarketPrices } = require("../services/crop/marketService");

const getMarketPrices = async (req, res) => {
  try {
    const prices = await fetchMarketPrices(req.query.state);
    res.json(prices);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
};

module.exports = { getMarketPrices };