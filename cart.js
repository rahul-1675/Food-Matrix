/* ============================================================
   cart.js  –  Food Munch shared cart logic
   Uses localStorage key: food_munch_cart
   Each item: { id, name, price, qty, img }
   ============================================================ */

const CART_KEY = 'food_munch_cart';

/* ── helpers ─────────────────────────────────────────────── */
function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch (e) { return []; }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function cartCount() {
  return getCart().reduce((sum, i) => sum + i.qty, 0);
}

/* ── badge update ────────────────────────────────────────── */
function updateCartBadge() {
  const count = cartCount();
  document.querySelectorAll('.cart-badge').forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? 'inline-flex' : 'none';
  });
}

/* ── toast notification ──────────────────────────────────── */
function showToast(name) {
  let toast = document.getElementById('fm-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'fm-toast';
    toast.style.cssText = `
      position:fixed; bottom:28px; left:50%; transform:translateX(-50%) translateY(80px);
      background:linear-gradient(135deg,#d0b200,#f5d020);
      color:#1a1100; font-family:'Roboto',sans-serif; font-weight:600;
      padding:14px 28px; border-radius:50px; font-size:15px;
      box-shadow:0 8px 32px rgba(208,178,0,.45);
      transition:transform .35s cubic-bezier(.34,1.56,.64,1),opacity .3s;
      opacity:0; z-index:9999; white-space:nowrap;
      display:flex; align-items:center; gap:10px;
    `;
    document.body.appendChild(toast);
  }
  toast.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
      <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
    </svg>
    <b>${name}</b> added to cart!`;
  toast.style.transform = 'translateX(-50%) translateY(0)';
  toast.style.opacity = '1';
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.style.transform = 'translateX(-50%) translateY(80px)';
    toast.style.opacity = '0';
  }, 2400);
}

/* ── add to cart ─────────────────────────────────────────── */
function addToCart(name, price, img) {
  const cart = getCart();
  const existing = cart.find(i => i.name === name);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id: Date.now(), name, price: parseInt(price), qty: 1, img });
  }
  saveCart(cart);
  updateCartBadge();
  showToast(name);
}

/* ── wire up Order buttons on category pages ─────────────── */
function wireOrderButtons() {
  document.querySelectorAll('.food-card').forEach(card => {
    const btn = card.querySelector('.nb');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const name  = card.querySelector('.headi')?.textContent?.trim() || 'Item';
      const priceText = card.querySelector('.nsp')?.textContent?.match(/\d+/) || [0];
      const price = parseInt(priceText[0]);
      const img   = card.querySelector('img')?.src || '';
      addToCart(name, price, img);
    });
  });
}

/* ── init ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  wireOrderButtons();
});
