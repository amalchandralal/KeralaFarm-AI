const axios = require("axios");
const logger = require("../../utils/logger");

async function fetchMarketPrices(state = "Keralam") {
  try {
    const url = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${process.env.DATA_GOV_KEY}&format=json&filters[state.keyword]=${encodeURIComponent(state)}&limit=50`;

    const response = await axios.get(url);
    const records = response.data.records || [];

    return records.map((r) => ({
      crop: r.commodity,
      market: r.market,
      min: r.min_price,
      max: r.max_price,
      modal: r.modal_price,
      unit: "/quintal",
      date: r.arrival_date,
    }));
  } catch (err) {
    logger.error(`Market prices fetch error: ${err.message}`);
    throw { status: 500, message: "Failed to fetch market prices" };
  }
}

module.exports = { fetchMarketPrices };
