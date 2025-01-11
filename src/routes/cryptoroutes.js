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

module.exports = router;
