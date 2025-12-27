const axios = require("axios");

module.exports = async function handler(req, res) {
  try {
    const API_KEY = process.env.ETHERSCAN_KEY;
    const CONTRACT = "0x73612914c81a9c072333ea9ea71a9b26a5b9a707";

    if (!API_KEY) {
      return res.status(500).json({ error: "Missing ETHERSCAN_KEY" });
    }

    const url =
      "https://api.etherscan.io/api" +
      "?module=account" +
      "&action=txlist" +
      `&address=${CONTRACT}` +
      "&sort=desc" +
      `&apikey=${API_KEY}`;

    const response = await axios.get(url);

    // 🔐 Handle non-JSON (rate limit / auth error)
    if (typeof response.data !== "object") {
      return res.status(429).json({
        error: "Etherscan error",
        message: response.data
      });
    }

    // 🔐 Handle API-level error
    if (response.data.status !== "1") {
      return res.status(400).json({
        error: "Etherscan API error",
        message: response.data.message,
        result: response.data.result
      });
    }

    res.status(200).json(response.data.result.slice(0, 10));
  } catch (err) {
    res.status(500).json({
      error: "Server error",
      message: err.message
    });
  }
};
