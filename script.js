const API_KEY = "U8KNRWKNBH4ZDVNGFHJVDFVJBWG3WP8D7A";
const CONTRACT = "0x73612914c81a9c072333ea9ea71a9b26a5b9a707";

async function loadData() {
  const res = await fetch("/api/cancelBids");
  const data = await res.json();

  // ✅ UPDATE STATS (THIS IS WHAT YOU ASKED ABOUT)
  document.getElementById("totalBids").innerText = data.length;

  document.getElementById("uniqueWallets").innerText =
    new Set(data.map(d => d.wallet)).size;

  // ✅ POPULATE TABLE
  const rows = document.getElementById("rows");
  rows.innerHTML = "";

  data.forEach(d => {
    rows.innerHTML += `
      <tr>
        <td>${d.wallet}</td>
        <td>${d.amount.toLocaleString()}</td>
        <td>${d.token}</td>
        <td>${new Date(d.time * 1000).toLocaleString()}</td>
        <td>
          <a href="https://etherscan.io/tx/${d.hash}" target="_blank">view</a>
        </td>
      </tr>
    `;
  });
}

loadData();
