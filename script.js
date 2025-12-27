const API_KEY = "U8KNRWKNBH4ZDVNGFHJVDFVJBWG3WP8D7A";
const CONTRACT = "0x73612914c81a9c072333ea9ea71a9b26a5b9a707";

async function loadData() {
  const res = await fetch("/api/cancelBids");
  const cancelTxs = await res.json();

  const wallets = new Set(cancelTxs.map(tx => tx.from));

  document.getElementById("stats").innerText =
    `Cancelled bids: ${cancelTxs.length} | Unique wallets: ${wallets.size}`;

  const rows = document.getElementById("rows");
  rows.innerHTML = "";

  cancelTxs.slice(0, 20).forEach(tx => {
    rows.innerHTML += `
      <tr>
        <td>${tx.from}</td>
        <td>${new Date(tx.timeStamp * 1000).toLocaleString()}</td>
        <td>
          <a href="https://etherscan.io/tx/${tx.hash}" target="_blank">view</a>
        </td>
      </tr>
    `;
  });
}

loadData();
