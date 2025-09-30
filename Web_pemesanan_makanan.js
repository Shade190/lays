let orderList = [];

function addToOrder(menu, harga, jumlah = 1) {
  jumlah = parseInt(jumlah) || 1;
  // Jika menu sudah ada, tambahkan jumlah dan total harga
  const existing = orderList.find((item) => item.menu === menu);
  if (existing) {
    existing.jumlah += jumlah;
    existing.harga += harga * jumlah;
  } else {
    orderList.push({ menu, harga: harga * jumlah, jumlah });
  }
  updateSummary();
  showToast(`${menu} (${jumlah}) berhasil ditambahkan!`);
}

// Update ringkasan pesanan
function updateSummary() {
  const summary = document.getElementById("orderSummary");
  if (orderList.length === 0) {
    summary.innerHTML = "<em>Belum ada pesanan.</em>";
    return;
  }
  let html = '<ul style="padding-left:18px;">';
  let total = 0;
  orderList.forEach((item) => {
    html += `<li>${item.menu} x ${
      item.jumlah
    } - Rp ${item.harga.toLocaleString()}</li>`;
    total += item.harga;
  });
  html += `</ul><strong>Total: Rp ${total.toLocaleString()}</strong>`;
  summary.innerHTML = html;
}

// Submit pesanan
function submitOrder(e) {
  e.preventDefault();
  if (orderList.length === 0) {
    alert("Silakan pilih menu terlebih dahulu!");
    return;
  }
  const nama = document.getElementById("namaPemesan").value;
  const alamat = document.getElementById("alamatPemesan").value;
  // Tampilkan loader
  const loader = document.getElementById("orderLoader");
  loader.style.display = "block";
  // Simulasi proses submit selama 1.5 detik
  setTimeout(() => {
    loader.style.display = "none";
    showToast(`Terima kasih ${nama}! Pesanan Anda akan dikirim ke ${alamat}.`);
    setTimeout(() => {
      showToast("Pesanan siap diantarkan!");
    }, 1600);
    orderList = [];
    updateSummary();
    document.getElementById("namaPemesan").value = "";
    document.getElementById("alamatPemesan").value = "";
  }, 1500);
}

window.addEventListener("DOMContentLoaded", function () {
  // Welcome overlay
  const welcomeOverlay = document.getElementById("welcomeOverlay");
  const welcomeBtn = document.getElementById("welcomeBtn");
  if (welcomeOverlay && welcomeBtn) {
    welcomeBtn.onclick = function () {
      welcomeOverlay.classList.remove("show");
      setTimeout(() => {
        welcomeOverlay.style.display = "none";
      }, 400);
    };
  }

  // Popup menu detail
  function showMenuDetail(menu, harga, imgSrc) {
    document.getElementById("overlay").classList.add("active");
    const popup = document.getElementById("menuDetailPopup");
    popup.classList.add("show");
    popup.style.display = "flex";
    document.getElementById("popupTitle").textContent = menu;
    document.getElementById("popupImg").src = imgSrc;
    document.getElementById("popupPrice").textContent =
      "Rp " + harga.toLocaleString();
    // Tambahkan input jumlah pada popup
    let jumlahInput = document.getElementById("popupJumlahInput");
    if (!jumlahInput) {
      jumlahInput = document.createElement("input");
      jumlahInput.type = "number";
      jumlahInput.min = "1";
      jumlahInput.value = "1";
      jumlahInput.id = "popupJumlahInput";
      jumlahInput.style = "width:48px;margin-bottom:12px;";
      jumlahInput.setAttribute("aria-label", "Jumlah " + menu);
      document.getElementById("popupPrice").after(jumlahInput);
    } else {
      jumlahInput.value = "1";
      jumlahInput.style.display = "inline-block";
    }
    document.getElementById("popupOrderBtn").onclick = function () {
      addToOrder(menu, harga, jumlahInput.value);
      closeMenuDetail();
      jumlahInput.style.display = "none";
    };
  }

  function closeMenuDetail() {
    document.getElementById("overlay").classList.remove("active");
    const popup = document.getElementById("menuDetailPopup");
    popup.classList.remove("show");
    setTimeout(() => {
      popup.style.display = "none";
    }, 400);
  }

  document.getElementById("closePopup").onclick = closeMenuDetail;
  document.getElementById("overlay").onclick = closeMenuDetail;

  // Expose showMenuDetail globally
  window.showMenuDetail = showMenuDetail;
});

// Notifikasi

function showToast(message) {
  let toast = document.getElementById("toastNotif");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toastNotif";
    toast.style.position = "fixed";
    toast.style.bottom = "32px";
    toast.style.left = "50%";
    toast.style.transform = "translateX(-50%)";
    toast.style.background = "linear-gradient(90deg,#ffd166 60%,#fffbe6 100%)";
    toast.style.color = "#2d3e50";
    toast.style.padding = "14px 32px";
    toast.style.borderRadius = "24px";
    toast.style.fontWeight = "700";
    toast.style.fontSize = "1.12rem";
    toast.style.boxShadow = "0 4px 18px #ffd16688";
    toast.style.zIndex = "10002";
    toast.style.opacity = "0";
    toast.style.transition = "opacity 0.4s, transform 0.4s";
    toast.style.transform += " scale(0.98)";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.style.opacity = "1";
  toast.style.transform = "translateX(-50%) scale(1.04)";
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(-50%) scale(0.98)";
  }, 1800);
}

// Fitur pencarian dan filter menu
function filterMenu() {
  const search = document.getElementById("searchMenu").value.toLowerCase();
  const kategori = document.getElementById("filterKategori").value;
  document.querySelectorAll(".menu-card").forEach((card) => {
    const nama = card.querySelector("h3").textContent.toLowerCase();
    let show = true;
    if (search && !nama.includes(search)) show = false;
    if (kategori !== "all") {
      if (kategori === "makanan" && !card.closest(".menu-section"))
        show = false;
      if (kategori === "minuman" && !card.closest(".minuman-section"))
        show = false;
      // Favorit/promo: contoh, tampilkan semua dulu
    }
    card.style.display = show ? "" : "none";
  });
}
document.getElementById("searchMenu").addEventListener("input", filterMenu);
document
  .getElementById("filterKategori")
  .addEventListener("change", filterMenu);
// Tombol kembali ke atas

const backToTopBtn = document.getElementById("backToTopBtn");
const summarySection = document.querySelector(".summary-section");
if (summarySection) {
  summarySection.style.transition = "opacity 0.5s, transform 0.5s";
  summarySection.style.opacity = "0";
  summarySection.style.transform = "translateY(40px)";
}
let lastScrollY = window.scrollY;
window.addEventListener("scroll", function () {
  // Tombol ke atas
  if (window.scrollY > 200) {
    backToTopBtn.style.display = "flex";
    backToTopBtn.style.opacity = "1";
  } else {
    backToTopBtn.style.opacity = "0";
    setTimeout(() => {
      backToTopBtn.style.display = "none";
    }, 300);
  }
  // Ringkasan animasi
  if (!summarySection) return;
  if (window.scrollY > lastScrollY && window.scrollY > 300) {
    // Scroll ke bawah, tampilkan
    summarySection.style.opacity = "1";
    summarySection.style.transform = "translateY(0)";
  } else if (window.scrollY < lastScrollY) {
    // Scroll ke atas, sembunyikan
    summarySection.style.opacity = "0";
    summarySection.style.transform = "translateY(40px)";
  }
  lastScrollY = window.scrollY;
});
backToTopBtn.addEventListener("click", function () {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
