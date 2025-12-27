const axios = require("axios");

module.exports = async function handler(req, res) {
  try {
    const API_KEY = process.env.ETHERSCAN_KEY;
    const CONTRACT = "0x73612914c81a9c072333ea9ea71a9b26a5b9a707";

    const base = "https://api.etherscan.io/v2/api";

    // 1️⃣ Get cancelBid txs
    const txRes = await axios.get(base, {
      params: {
        chainid: 1,
        module: "account",
        action: "txlist",
        address: CONTRACT,
        sort: "desc",
        apikey: API_KEY
      }
    });

    const cancelTxs = txRes.data.result.filter(
      tx => tx.functionName === "cancelBid()"
    );

    // 2️⃣ Get token transfers involving the contract
    const tokenRes = await axios.get(base, {
      params: {
        chainid: 1,
        module: "account",
        action: "tokentx",
        address: CONTRACT,
        sort: "desc",
        apikey: API_KEY
      }
    });

    const tokenTxs = tokenRes.data.result;

    // 3️⃣ Match refunds by tx hash
    const enriched = cancelTxs.map(tx => {
      const refund = tokenTxs.find(t => t.hash === tx.hash);

      return {
        wallet: tx.from,
        time: tx.timeStamp,
        hash: tx.hash,
        token: refund?.tokenSymbol || "—",
        amount: refund
          ? Number(refund.value) / 10 ** refund.tokenDecimal
          : 0
      };
    });

    res.status(200).json(enriched);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
