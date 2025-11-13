// 🌸 Creamberry Coquett — Carrito con localStorage + UI Animations (versión final y limpia)
const CART_KEY = 'creamberry_coquett_cart_v_final';
let cart = [];

// -----------------------------
// Helpers ✨
// -----------------------------
const qs = s => document.querySelector(s);
const qsa = s => Array.from(document.querySelectorAll(s));

// -----------------------------
// Carga y guardado del carrito 🛍
// -----------------------------
function loadCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    cart = raw ? JSON.parse(raw) : [];
  } catch (e) {
    cart = [];
  }
  updateCartCount();
}

function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
}

// -----------------------------
// Contador del carrito 🧁
// -----------------------------
function updateCartCount() {
  const total = cart.reduce((s, i) => s + (i.qty || 0), 0);
  qsa('.cart-count').forEach(el => el.textContent = total);
}

// -----------------------------
// Agregar ítem 🍓
// -----------------------------
function addItem(name, price) {
  const existing = cart.find(i => i.name === name);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ name, price, qty: 1 });
  }
  saveCart();
  animateAdd(name);
}

// -----------------------------
// Animación de "añadido ♥"
// -----------------------------
function animateAdd(name) {
  const bubble = document.createElement('div');
  bubble.className = 'add-bubble';
  bubble.textContent = `${name} añadido ♥`;
  Object.assign(bubble.style, {
    position: 'fixed',
    left: '50%',
    transform: 'translateX(-50%) translateY(20px)',
    background: 'linear-gradient(90deg,#ff7aa3,#00c985)',
    color: 'white',
    padding: '8px 14px',
    borderRadius: '20px',
    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
    opacity: '0',
    zIndex: '1400',
    fontWeight: '700'
  });
  document.body.appendChild(bubble);
  requestAnimationFrame(()=> bubble.style.opacity = '1');
  setTimeout(()=> bubble.style.opacity = '0', 1400);
  setTimeout(()=> bubble.remove(), 1800);
}

// -----------------------------
// Modal del carrito
// -----------------------------
function openCart(){
  renderCart();
  const modal = qs('#cartModal');
  if(modal){ modal.classList.add('open'); modal.setAttribute('aria-hidden','false'); }
}
function closeCart(){
  const modal = qs('#cartModal');
  if(modal){ modal.classList.remove('open'); modal.setAttribute('aria-hidden','true'); }
}

function renderCart(){
  const container = qs('#cartItems');
  if(!container) return;
  container.innerHTML = '';
  let total = 0;
  if(cart.length === 0){
    container.innerHTML = '<p style="text-align:center;color:#7a3b4a">Tu carrito está vacío</p>';
  } else {
    cart.forEach((item, idx)=>{
      const row = document.createElement('div');
      const subtotal = item.price * item.qty;
      total += subtotal;
      row.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px dashed #ffd6e0">
          <div><strong>${item.name}</strong><div style="font-size:0.9rem;color:#7a3b4a">$${item.price} c/u</div></div>
          <div style="display:flex;align-items:center;gap:8px">
            <input type="number" value="${item.qty}" min="1" onchange="changeQty(${idx}, this.value)" style="width:66px;padding:6px;border-radius:6px;border:1px solid #ffd6e0;text-align:center">
            <button onclick="removeItem(${idx})" style="background:none;border:none;color:#d63384;cursor:pointer;font-size:1.1rem">🗑️</button>
          </div>
        </div>
      `;
      container.appendChild(row);
    });
  }
  const totalEl = qs('#cartTotal');
  if(totalEl) totalEl.textContent = '$' + total.toFixed(2);
}

// -----------------------------
// Modificar cantidades / remover
// -----------------------------
function changeQty(index, value){
  const v = parseInt(value);
  if(isNaN(v) || v < 1){ removeItem(index); return; }
  cart[index].qty = v;
  saveCart();
  renderCart();
}
function removeItem(index){
  cart.splice(index,1);
  saveCart();
  renderCart();
}
function clearCart(){
  if(confirm('¿Vaciar el carrito?')){ cart = []; saveCart(); renderCart(); closeCart(); }
}

// -----------------------------
// UI toggles y eventos
// -----------------------------
function setupUI(){
  qsa('.hamburger').forEach(btn=>btn.addEventListener('click', ()=>{
    const nav = qs('.main-nav');
    if(!nav) return;
    nav.style.display = nav.style.display === 'flex' ? 'none':'flex';
  }));

  qsa('#openCartBtn, .cart-btn').forEach(b=> b.addEventListener('click', (e)=>{ e.preventDefault(); openCart(); }));
  qs('#closeCartBtn')?.addEventListener('click', ()=> closeCart());
  qs('#clearCart')?.addEventListener('click', ()=> clearCart());

  // tipo-envio show/hide direccion (on contacto page)
  const tipo = qs('#tipo-envio');
  const direccionContainer = qs('#direccion-container');
  if(tipo && direccionContainer){
    tipo.addEventListener('change', ()=>{
      direccionContainer.style.display = tipo.value === 'delivery' ? 'block' : 'none';
    });
  }

  // form submit -> inject cart JSON
  document.addEventListener('submit', e=>{
    if(e.target && e.target.id === 'pedidoForm'){
      const input = qs('#cartInput');
      if(input) input.value = JSON.stringify(cart);
    }
  });
}

// -----------------------------
// Inicialización
// -----------------------------
document.addEventListener('DOMContentLoaded', ()=>{
  loadCart();
  setupUI();
  // Inject bubble styles if not present
  if(!qs('.add-bubble')){
    const css = `
    .add-bubble{position:fixed;left:50%;transform:translateX(-50%) translateY(20px);background:linear-gradient(90deg,#ff7aa3,#00c985);color:white;padding:8px 12px;border-radius:20px;box-shadow:0 8px 30px rgba(0,0,0,0.12);opacity:0;transition:all .35s;z-index:1400;font-weight:700}`;
    const s = document.createElement('style'); s.textContent = css; document.head.appendChild(s);
  }
});