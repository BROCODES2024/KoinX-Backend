const cron = require("node-cron");
const fetchCryptoData = require("../utils/coingeckoapi");
const CryptoData = require("../models/coininfo");

const coinIds = ["bitcoin", "matic-network", "ethereum"];

const startJob = () => {
  // Change the schedule back to every 2 hours
  cron.schedule("0 */2 * * *", async () => {
    // This will run every 2 hours
    console.log("Fetching cryptocurrency data...");
    for (const coinId of coinIds) {
      const data = await fetchCryptoData(coinId);
      if (data) {
        const { price, marketCap, change24h } = data;
        await CryptoData.create({ coinId, price, marketCap, change24h });
        console.log(`Data saved for ${coinId}`);
      }
    }
  });

  // Optional: Run the job immediately for testing
  (async () => {
    console.log("Fetching cryptocurrency data for testing...");
    for (const coinId of coinIds) {
      const data = await fetchCryptoData(coinId);
      if (data) {
        const { price, marketCap, change24h } = data;
        await CryptoData.create({ coinId, price, marketCap, change24h });
        console.log(`Data saved for ${coinId}`);
      }
    }
  })();
};

module.exports = startJob;
