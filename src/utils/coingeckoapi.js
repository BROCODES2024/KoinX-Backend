const axios = require("axios");

const fetchCryptoData = async (coinId) => {
  try {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        "x-cg-demo-api-key": "CG-XkKxafajGNVHpXgMJGMHpxVj", // Your API key
      },
    };

    const response = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd&include_market_cap=true&include_24hr_change=true&include_last_updated_at=true`,
      options
    );
    const { bitcoin, ethereum, "matic-network": matic } = response.data;

    // Select the relevant coin data based on coinId
    const coinData = { price: 0, marketCap: 0, change24h: 0 };

    switch (coinId) {
      case "bitcoin":
        coinData.price = bitcoin.usd;
        coinData.marketCap = bitcoin.usd_market_cap;
        coinData.change24h = bitcoin.usd_24h_change;
        break;
      case "ethereum":
        coinData.price = ethereum.usd;
        coinData.marketCap = ethereum.usd_market_cap;
        coinData.change24h = ethereum.usd_24h_change;
        break;
      case "matic-network":
        coinData.price = matic.usd;
        coinData.marketCap = matic.usd_market_cap;
        coinData.change24h = matic.usd_24h_change;
        break;
      default:
        break;
    }

    return coinData;
  } catch (error) {
    console.error(`Failed to fetch data for ${coinId}:`, error.message);
    return null;
  }
};

module.exports = fetchCryptoData;
