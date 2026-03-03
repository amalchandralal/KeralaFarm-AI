const axios = require("axios");

const getMarketPrices = async (req, res) => {
  try {
    const state = "Kerala";
    const url = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${process.env.DATA_GOV_KEY}&format=json&filters[state]=${state}&limit=50`;

    const response = await axios.get(url);
    const records = response.data.records || [];

    const prices = records.map((r) => ({
      crop:   r.commodity,
      market: r.market,
      min:    r.min_price,
      max:    r.max_price,
      modal:  r.modal_price,
      unit:   "/quintal",
      date:   r.arrival_date,
    }));

    res.json(prices);
  } catch (err) {
    console.error("Market prices error:", err.message);
    res.status(500).json({ error: "Failed to fetch market prices" });
  }
};

module.exports = { getMarketPrices };