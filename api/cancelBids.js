import axios from "axios";

export default async function handler(req, res) {
  try {
    const API_KEY = process.env.ETHERSCAN_KEY;
    const CONTRACT = "0x73612914c81a9c072333ea9ea71a9b26a5b9a707";

    if (!API_KEY) {
      return res.status(500).json({ error: "Missing ETHERSCAN_KEY" });
    }

    const url = `https://api.etherscan.io/api?module=account&action=txlist&address=${CONTRACT}&sort=desc&apikey=${API_KEY}`;

    const response = await axios.get(url);

    res.status(200).json(response.data.result.slice(0, 5));
  } catch (err) {
    res.status(500).json({
      error: "Server error",
      message: err.message
    });
  }
}
