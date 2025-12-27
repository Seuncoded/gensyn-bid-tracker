async function loadData() {
  const res = await fetch("/api/cancelBids");
  const data = await res.json();

  // ===== STATS =====
  document.getElementById("totalBids").innerText = data.length;

  document.getElementById("uniqueWallets").innerText =
    new Set(data.map(d => d.wallet)).size;

  const totalAmount = data.reduce((sum, d) => {
    return sum + (Number(d.amount) || 0);
  }, 0);

  document.getElementById("totalAmount").innerText =
    `$${totalAmount.toLocaleString()}`;

  // ===== TABLE / MOBILE RENDER =====
  const rows = document.getElementById("rows");
  rows.innerHTML = "";

  const isMobile = window.innerWidth <= 700;

  data.forEach(d => {
    const time = new Date(d.time * 1000).toLocaleString();

    // 📱 MOBILE CARD VIEW
    if (isMobile) {
      rows.innerHTML += `
        <tr class="mobile-row">
          <td colspan="5">
            <div class="mobile-card">
              <div class="mobile-wallet">${d.wallet}</div>

              <div class="mobile-meta">
                <span class="amount">
                  ${Number(d.amount).toLocaleString()} ${d.token}
                </span>
                <span class="time">${time}</span>
              </div>

              <a href="https://etherscan.io/tx/${d.hash}" target="_blank">
                View transaction →
              </a>
            </div>
          </td>
        </tr>
      `;
    }

    // 🖥 DESKTOP TABLE VIEW
    else {
      rows.innerHTML += `
        <tr>
          <td class="wallet">${d.wallet}</td>
          <td class="amount">${Number(d.amount).toLocaleString()}</td>
          <td>${d.token}</td>
          <td>${time}</td>
          <td>
            <a href="https://etherscan.io/tx/${d.hash}" target="_blank">
              view
            </a>
          </td>
        </tr>
      `;
    }
  });
}

loadData();

// Re-render when screen resizes
window.addEventListener("resize", loadData);
