export default async function handler(req, res) {
  const API_KEY = process.env.ETHERSCAN_KEY;
  const CONTRACT = "0x73612914c81a9c072333ea9ea71a9b26a5b9a707";

  const url = `https://api.etherscan.io/api?module=account&action=txlist&address=${CONTRACT}&sort=desc&apikey=${API_KEY}`;

  const response = await fetch(url);
  const data = await response.json();

  const txs = data.result || [];

  // TEMP: log first tx input
  const cancelTxs = txs.filter(tx =>
    tx.input && tx.input !== "0x"
  );

  res.status(200).json(cancelTxs.slice(0, 20));
}
