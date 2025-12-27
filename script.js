async function loadData() {
  try {
    const res = await fetch("/api/cancelBids");
    const data = await res.json();

    // ✅ HARD GUARD: ensure we have an array
    if (!Array.isArray(data)) {
      console.error("Invalid API response:", data);
      return;
    }

    // ===== STATS =====
    const totalBids = data.length;
    document.getElementById("totalBids").innerText = totalBids;

    const uniqueWallets = new Set(data.map(d => d.wallet)).size;
    document.getElementById("uniqueWallets").innerText = uniqueWallets;

    // Total cancelled amount
    const totalAmount = data.reduce((sum, d) => {
      return sum + (Number(d.amount) || 0);
    }, 0);

    document.getElementById("totalAmount").innerText =
      `$${totalAmount.toLocaleString(undefined, { maximumFractionDigits: 3 })}`;

    // ===== TABLE / MOBILE CARDS =====
    const rows = document.getElementById("rows");
    rows.innerHTML = "";

    const isMobile = window.innerWidth <= 700;

    data.forEach(d => {
      if (isMobile) {
        rows.innerHTML += `
          <tr class="mobile-row">
            <td colspan="5">
              <div class="mobile-card">
                <div class="mobile-wallet">${d.wallet}</div>

                <div class="mobile-meta">
                  <div class="amount">
  ${Number(d.amount).toLocaleString()}
  <span class="token">${d.token}</span>
</div>

                  <div class="time">
                    ${new Date(d.time * 1000).toLocaleString()}
                  </div>
                </div>

                <a href="https://etherscan.io/tx/${d.hash}" target="_blank">
                  View transaction →
                </a>
              </div>
            </td>
          </tr>
        `;
      } else {
        rows.innerHTML += `
          <tr>
            <td class="wallet">${d.wallet}</td>
            <td class="amount">${Number(d.amount).toLocaleString()}</td>
            <td>${d.token}</td>
            <td>${new Date(d.time * 1000).toLocaleString()}</td>
            <td>
              <a href="https://etherscan.io/tx/${d.hash}" target="_blank">view</a>
            </td>
          </tr>
        `;
      }
    });

  } catch (err) {
    console.error("Failed to load data:", err);
  }
}

// Load once
loadData();
