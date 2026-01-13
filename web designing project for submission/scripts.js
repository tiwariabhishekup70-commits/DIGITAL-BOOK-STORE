// ---- Cart storage helpers ----
const CART_KEY = 'bookstoreCart';

// Format currency in Indian style with Rupee symbol
const currency = n => `₹${Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
}
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addToCart(title, dept, price) {
  const cart = getCart();
  const existing = cart.find(i => i.title === title);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ title, dept, price, qty: 1 });
  }
  saveCart(cart);
  alert(`Added "${title}" to cart.`);
}

// ---- Render cart table ----
function renderCart() {
  const cart = getCart();
  const table = document.getElementById('cartTable');
  if (!table) return;

  table.innerHTML = `<tr><th>Dept</th><th>Title</th><th>Price</th><th>Qty</th><th>Total</th><th>Action</th></tr>`;
  let grandTotal = 0;

  cart.forEach((item, idx) => {
    const lineTotal = item.price * item.qty;
    grandTotal += lineTotal;
    table.innerHTML += `
      <tr>
        <td>${item.dept}</td>
        <td>${item.title}</td>
        <td>${currency(item.price)}</td>
        <td><input type="number" min="1" value="${item.qty}" onchange="updateQty(${idx}, this.value)"></td>
        <td>${currency(lineTotal)}</td>
        <td><button onclick="removeItem(${idx})">Remove</button></td>
      </tr>`;
  });

  const totalEl = document.getElementById('grandTotal');
  if (totalEl) totalEl.textContent = currency(grandTotal);
}

function updateQty(index, newQty) {
  const cart = getCart();
  cart[index].qty = Math.max(1, parseInt(newQty));
  saveCart(cart);
  renderCart();
}
function removeItem(index) {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  renderCart();
}
function clearCart() {
  localStorage.removeItem(CART_KEY);
  renderCart();
}

// ---- Registration validation ----
function validateRegistration() {
  const name = document.getElementById("name").value.trim();
  const password = document.getElementById("password").value;
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const sex = document.querySelector('input[name="sex"]:checked');
  const day = document.getElementById("dob-day").value;
  const month = document.getElementById("dob-month").value;
  const year = document.getElementById("dob-year").value;
  const langs = document.querySelectorAll('input[name="lang"]:checked');
  const address = document.getElementById("address").value.trim();

  if (!/^[A-Za-z]{6,}$/.test(name)) {
    alert("Name must be at least 6 alphabetic characters.");
    return false;
  }
  if (password.length < 6) {
    alert("Password must be at least 6 characters.");
    return false;
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    alert("Invalid email format.");
    return false;
  }
  if (!/^\d{10}$/.test(phone)) {
    alert("Phone number must be 10 digits.");
    return false;
  }
  if (!sex) {
    alert("Please select sex.");
    return false;
  }
  if (!day || !month || !year) {
    alert("Please select complete date of birth.");
    return false;
  }
  if (langs.length === 0) {
    alert("Select at least one language.");
    return false;
  }
  if (address.length < 10) {
    alert("Address must be at least 10 characters.");
    return false;
  }

  alert("Registration successful!");
  return false; // prevent actual submission in demo
}

// ---- Populate DOB selects ----
document.addEventListener("DOMContentLoaded", () => {
  const day = document.getElementById("dob-day");
  const month = document.getElementById("dob-month");
  const year = document.getElementById("dob-year");

  if (day && month && year) {
    for (let d = 1; d <= 31; d++) {
      day.innerHTML += `<option>${d}</option>`;
    }
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    months.forEach((m,i) => month.innerHTML += `<option value="${i+1}">${m}</option>`);
    const now = new Date().getFullYear();
    for (let y = now; y >= now-80; y--) {
      year.innerHTML += `<option>${y}</option>`;
    }
  }

  // Render cart if on cart page
  if (document.getElementById("cartTable")) {
    renderCart();
  }
});