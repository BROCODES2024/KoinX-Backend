const express = require("express");
const CryptoData = require("../models/coininfo");
const router = express.Router();

// /stats route to fetch cryptocurrency data
router.get("/stats", async (req, res) => {
  const { coin } = req.query;

  // Validate if the requested coin is supported
  const supportedCoins = ["bitcoin", "matic-network", "ethereum"];
  if (!supportedCoins.includes(coin)) {
    return res.status(400).json({
      error:
        "Invalid coin. Supported coins are: bitcoin, matic-network, ethereum",
    });
  }

  try {
    // Fetch the latest data from the database for the requested coin
    const latestData = await CryptoData.findOne({ coinId: coin }).sort({
      createdAt: -1,
    });

    if (!latestData) {
      return res
        .status(404)
        .json({ error: "Data not found for the requested coin." });
    }

    res.json({
      price: latestData.price,
      marketCap: latestData.marketCap,
      change24h: latestData.change24h,
    });
  } catch (error) {
    console.error(`Error fetching data for ${coin}:`, error.message);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/deviation", async (req, res) => {
  const { coin } = req.query;

  // Validate if the requested coin is supported
  const supportedCoins = ["bitcoin", "matic-network", "ethereum"];
  if (!supportedCoins.includes(coin)) {
    return res.status(400).json({
      error:
        "Invalid coin. Supported coins are: bitcoin, matic-network, ethereum",
    });
  }

  try {
    // Fetch the last 100 records for the requested coin from the database
    const data = await CryptoData.find({ coinId: coin })
      .sort({ createdAt: -1 })
      .limit(100);

    if (data.length === 0) {
      return res
        .status(404)
        .json({ error: "No records found for the requested coin." });
    }

    // Extract the prices from the records
    const prices = data.map((record) => record.price);

    // Calculate the standard deviation of the prices
    const deviation = calculateStandardDeviation(prices);

    // Return the result
    res.json({ deviation });
  } catch (error) {
    console.error(`Error calculating deviation for ${coin}:`, error.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Utility function to calculate standard deviation
function calculateStandardDeviation(values) {
  const n = values.length;
  if (n === 0) return 0;

  // Calculate mean
  const mean = values.reduce((sum, value) => sum + value, 0) / n;

  // Calculate variance
  const variance =
    values.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / n;

  // Standard deviation is the square root of the variance
  return Math.sqrt(variance);
}

module.exports = router;
