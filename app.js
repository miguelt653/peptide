/* =========================================================
   Leanovo — App Logic
   =========================================================
   OWNER NOTIFICATION SETUP (so you get a text when someone orders):
   ----------------------------------------------------------
   Pick ONE option and fill in the URL/ID below.

   OPTION A — Zapier / Make webhook (recommended, sends real SMS):
     1. Sign up at zapier.com (free) or make.com (free).
     2. Create a Zap:  Trigger = "Webhook by Zapier → Catch Hook"
                       Action  = "SMS by Zapier" (or "Twilio → Send SMS")
     3. Copy the webhook URL Zapier gives you and paste it as
        OWNER_WEBHOOK_URL below.
     4. Publish the Zap. Every order will text you the details.

   OPTION B — EmailJS (sends an email, free 200/mo):
     1. Sign up at emailjs.com.
     2. Create an Email Service + Template. Note your IDs/Key.
     3. Set USE_EMAILJS = true and paste your IDs below.
     4. To turn that email into a TEXT, use your carrier's
        email-to-SMS gateway as the "To Email" in your EmailJS
        template (e.g. 5551234567@vtext.com for Verizon,
        @txt.att.net for AT&T, @tmomail.net for T-Mobile).

   If both are left blank, orders are still saved in the Admin panel
   — you just won't get a real-time notification.
   ---------------------------------------------------------- */

/* ---- Config ---- */
const VENMO_HANDLE      = "@Frankie-DiLorenzo";
const ADMIN_PASSWORD    = "changeme123"; // change me in production
const OWNER_WEBHOOK_URL = "";            // e.g. "https://hooks.zapier.com/hooks/catch/123456/abcdef/"
const USE_EMAILJS       = false;
const EMAILJS_CONFIG    = {
  publicKey:  "YOUR_PUBLIC_KEY",
  serviceId:  "YOUR_SERVICE_ID",
  templateId: "YOUR_TEMPLATE_ID",
};

const DEFAULT_PRODUCTS = [
  {
    id: 1,
    name: "BPC-157",
    fullName: "Body Protection Compound 157",
    category: "healing",
    categoryLabel: "Healing & Recovery",
    icon: "🧬",
    price: 49.99,
    unit: "5mg vial",
    purity: "≥99%",
    desc: "A synthetic pentadecapeptide studied for soft tissue repair, gut lining support, and recovery acceleration. One of the most researched healing peptides available.",
    meta: ["5mg / vial", "≥99% Purity", "Lyophilized", "COA Included"],
    stock: 25,
  },
  {
    id: 2,
    name: "Retatrutide",
    fullName: "Retatrutide (GLP-1/GIP/Glucagon Triple Agonist)",
    category: "metabolic",
    categoryLabel: "Metabolic",
    icon: "🎯",
    price: 129.99,
    unit: "10mg vial",
    purity: "≥99%",
    desc: "A next-generation triple receptor agonist (GLP-1, GIP, and glucagon) being actively studied for metabolic regulation, body composition, and energy balance.",
    meta: ["10mg / vial", "≥99% Purity", "Lyophilized", "COA Included"],
    stock: 15,
  },
  {
    id: 3,
    name: "TB-500",
    fullName: "Thymosin Beta-4 (TB-500)",
    category: "healing",
    categoryLabel: "Healing & Recovery",
    icon: "💊",
    price: 54.99,
    unit: "5mg vial",
    purity: "≥98.5%",
    desc: "A naturally occurring peptide studied for its role in cell migration, proliferation, and differentiation — particularly relevant to muscle, tendon, and wound healing research.",
    meta: ["5mg / vial", "≥98.5% Purity", "Lyophilized", "COA Included"],
    stock: 20,
  },
  {
    id: 4,
    name: "Semaglutide",
    fullName: "Semaglutide (GLP-1 Agonist)",
    category: "metabolic",
    categoryLabel: "Metabolic",
    icon: "🌿",
    price: 89.99,
    unit: "5mg vial",
    purity: "≥98.5%",
    desc: "A long-acting GLP-1 receptor agonist extensively studied for glucose metabolism regulation, satiety signaling, and cardiovascular outcomes.",
    meta: ["5mg / vial", "≥98.5% Purity", "Lyophilized", "COA Included"],
    stock: 18,
  },
  {
    id: 5,
    name: "CJC-1295 / Ipamorelin",
    fullName: "CJC-1295 DAC + Ipamorelin Blend",
    category: "growth",
    categoryLabel: "Growth & Performance",
    icon: "⚡",
    price: 64.99,
    unit: "10mg blend vial",
    purity: "≥99%",
    desc: "A synergistic blend of a long-acting GHRH analogue (CJC-1295) and a selective GH secretagogue (Ipamorelin), studied for sustained GH release with minimal side-effect profile.",
    meta: ["5mg CJC + 5mg Ipa", "≥99% Purity", "Lyophilized", "COA Included"],
    stock: 12,
  },
  {
    id: 6,
    name: "GHK-Cu",
    fullName: "Copper Peptide GHK-Cu",
    category: "healing",
    categoryLabel: "Healing & Recovery",
    icon: "🔷",
    price: 39.99,
    unit: "50mg powder",
    purity: "≥99%",
    desc: "A naturally occurring copper complex found in human plasma, studied for collagen synthesis stimulation, wound healing, antioxidant activity, and tissue remodeling.",
    meta: ["50mg / jar", "≥99% Purity", "Powder Form", "COA Included"],
    stock: 30,
  },
];

/* ---- Load products w/ stock from localStorage ---- */
function loadProducts() {
  const saved = localStorage.getItem("leanovo_products");
  if (saved) {
    try {
      const savedProducts = JSON.parse(saved);
      // Merge: use saved stock counts but fresh product details
      return DEFAULT_PRODUCTS.map(p => {
        const s = savedProducts.find(sp => sp.id === p.id);
        return { ...p, stock: s ? s.stock : p.stock };
      });
    } catch (e) { return [...DEFAULT_PRODUCTS]; }
  }
  return [...DEFAULT_PRODUCTS];
}
function saveProducts() {
  localStorage.setItem("leanovo_products", JSON.stringify(PRODUCTS.map(p => ({ id: p.id, stock: p.stock }))));
}
const PRODUCTS = loadProducts();

const FAQS = [
  {
    q: "What does 'research purposes only' mean?",
    a: "Our peptides are sold strictly for in vitro (laboratory) research. They are not intended for human or veterinary use, consumption, or injection. Always consult a licensed healthcare professional before any personal use.",
  },
  {
    q: "How do you verify purity?",
    a: "Every batch undergoes HPLC (High-Performance Liquid Chromatography) and Mass Spectrometry testing at an independent third-party laboratory. A Certificate of Analysis (COA) is available for every product.",
  },
  {
    q: "How are peptides shipped?",
    a: "Peptides are shipped with cold-pack insulation to maintain stability during transit. All orders are dispatched within 24–48 hours in discreet, unmarked packaging.",
  },
  {
    q: "What's your return / refund policy?",
    a: "We offer a full refund or replacement within 30 days if the product does not match the COA specifications. Contact our support team with your order number and batch ID.",
  },
  {
    q: "Do you ship internationally?",
    a: "Yes — we ship to most countries. Please note that import regulations vary. It is the customer's responsibility to confirm that ordering is permitted in their jurisdiction.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit/debit cards (Visa, Mastercard, Amex), as well as cryptocurrency (Bitcoin, Ethereum) for privacy-conscious customers.",
  },
];

/* ---- State ---- */
let cart = [];
let activeCategory = "all";

/* ---- DOM Refs ---- */
const productGrid = document.getElementById("productGrid");
const filterBtns  = document.querySelectorAll(".filter-btn"); // may be empty
const cartBtn     = document.getElementById("cartBtn");
const cartCount   = document.getElementById("cartCount");
const cartOverlay = document.getElementById("cartOverlay");
const cartDrawer  = document.getElementById("cartDrawer");
const cartClose   = document.getElementById("cartClose");
const cartBody    = document.getElementById("cartBody");
const cartItems   = document.getElementById("cartItems");
const cartEmpty   = document.getElementById("cartEmpty");
const cartFooter  = document.getElementById("cartFooter");
const cartTotal   = document.getElementById("cartTotal");
const checkoutBtn = document.getElementById("checkoutBtn");
const modalOverlay  = document.getElementById("modalOverlay");
const checkoutModal = document.getElementById("checkoutModal");
const modalClose    = document.getElementById("modalClose");
const checkoutForm  = document.getElementById("checkoutForm");
const orderSummary  = document.getElementById("orderSummary");
const orderSuccess  = document.getElementById("orderSuccess");
const successClose  = document.getElementById("successClose");
const faqList       = document.getElementById("faqList");
const contactForm   = document.getElementById("contactForm");
const formSuccess   = document.getElementById("formSuccess");

/* ---- Stock helpers ---- */
function inCart(id) {
  const item = cart.find(i => i.id === id);
  return item ? item.qty : 0;
}
function availableStock(p) {
  return Math.max(0, p.stock - inCart(p.id));
}

/* ---- Render Products ---- */
function renderProducts() {
  const filtered = activeCategory === "all"
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === activeCategory);

  productGrid.innerHTML = "";
  filtered.forEach((p, i) => {
    const available = availableStock(p);
    const soldOut = p.stock === 0;
    const lowStock = !soldOut && p.stock <= 5;
    const card = document.createElement("div");
    card.className = "product-card" + (soldOut ? " product-card--soldout" : "");
    card.style.animationDelay = `${i * 0.05}s`;
    card.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between">
        <div class="product-card__icon">${p.icon}</div>
        <span class="product-card__tag">${p.categoryLabel}</span>
      </div>
      <div>
        <div class="product-card__name">${p.name}</div>
        <div style="font-size:0.78rem;color:var(--text-muted);margin-top:2px">${p.fullName}</div>
      </div>
      <p class="product-card__desc">${p.desc}</p>
      <div class="product-card__meta">
        ${p.meta.map(m => `<span>${m}</span>`).join("")}
      </div>
      <div class="stock-indicator ${soldOut ? 'stock-indicator--out' : lowStock ? 'stock-indicator--low' : 'stock-indicator--in'}">
        <span class="stock-dot"></span>
        ${soldOut ? "Sold Out" : lowStock ? `Only ${p.stock} left` : `${p.stock} in stock`}
      </div>
      <div class="product-card__footer">
        <div class="product-card__price">$${p.price.toFixed(2)}<span>/ ${p.unit}</span></div>
        <button class="add-to-cart" data-id="${p.id}" ${available === 0 ? "disabled" : ""}>
          ${available === 0
            ? "Sold Out"
            : `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Add`}
        </button>
      </div>
    `;
    productGrid.appendChild(card);
  });

  document.querySelectorAll(".add-to-cart:not([disabled])").forEach(btn => {
    btn.addEventListener("click", () => addToCart(parseInt(btn.dataset.id), btn));
  });
}

/* ---- Filter ---- */
filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    filterBtns.forEach(b => b.classList.remove("filter-btn--active"));
    btn.classList.add("filter-btn--active");
    activeCategory = btn.dataset.category;
    renderProducts();
  });
});

/* ---- Cart Logic ---- */
function addToCart(id, btn) {
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) return;
  if (availableStock(product) <= 0) return;
  const existing = cart.find(i => i.id === id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  updateCartUI();
  renderProducts();
  btn.classList.add("added");
  btn.textContent = "Added ✓";
  setTimeout(() => {
    btn.classList.remove("added");
    btn.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Add`;
  }, 1500);
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  updateCartUI();
  renderProducts();
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  const product = PRODUCTS.find(p => p.id === id);
  if (delta > 0 && product && item.qty >= product.stock) return; // can't exceed stock
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(id);
  else { updateCartUI(); renderProducts(); }
}

function updateCartUI() {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const count = cart.reduce((s, i) => s + i.qty, 0);

  cartCount.textContent = count;
  cartCount.classList.toggle("visible", count > 0);

  cartItems.innerHTML = "";
  cartEmpty.style.display = cart.length ? "none" : "flex";
  cartFooter.style.display = cart.length ? "flex" : "none";

  cart.forEach(item => {
    const el = document.createElement("div");
    el.className = "cart-item";
    el.innerHTML = `
      <div>
        <div class="cart-item__name">${item.icon} ${item.name}</div>
        <div class="cart-item__price">$${item.price.toFixed(2)} / ${item.unit}</div>
        <div class="cart-item__controls">
          <button class="qty-btn" data-id="${item.id}" data-delta="-1">−</button>
          <span class="qty-display">${item.qty}</span>
          <button class="qty-btn" data-id="${item.id}" data-delta="1">+</button>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px">
        <button class="cart-item__remove" data-id="${item.id}" title="Remove">×</button>
        <span class="cart-item__total">$${(item.price * item.qty).toFixed(2)}</span>
      </div>
    `;
    cartItems.appendChild(el);
  });

  cartItems.querySelectorAll(".qty-btn").forEach(btn => {
    btn.addEventListener("click", () => changeQty(parseInt(btn.dataset.id), parseInt(btn.dataset.delta)));
  });
  cartItems.querySelectorAll(".cart-item__remove").forEach(btn => {
    btn.addEventListener("click", () => removeFromCart(parseInt(btn.dataset.id)));
  });

  cartTotal.textContent = `$${total.toFixed(2)}`;
  const shippingNote = document.getElementById("shippingNote");
  if (shippingNote) {
    shippingNote.textContent = total >= 150
      ? "✓ Free shipping applied"
      : `Add $${(150 - total).toFixed(2)} more for free shipping`;
  }
}

/* ---- Cart Drawer ---- */
function openCart() {
  cartDrawer.classList.add("open");
  cartOverlay.classList.add("active");
  document.body.style.overflow = "hidden";
}
function closeCart() {
  cartDrawer.classList.remove("open");
  cartOverlay.classList.remove("active");
  document.body.style.overflow = "";
}
cartBtn.addEventListener("click", openCart);
cartClose.addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

/* ---- Checkout Modal ---- */
function openCheckout() {
  closeCart();
  buildOrderSummary();
  checkoutModal.classList.add("open");
  modalOverlay.classList.add("active");
  document.body.style.overflow = "hidden";
}
function closeCheckout() {
  checkoutModal.classList.remove("open");
  modalOverlay.classList.remove("active");
  document.body.style.overflow = "";
}
checkoutBtn.addEventListener("click", openCheckout);
modalClose.addEventListener("click", closeCheckout);
modalOverlay.addEventListener("click", closeCheckout);

function getOrderTotal() {
  const sub = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const ship = sub >= 100 ? 0 : 9.99;
  return { sub, ship, total: sub + ship };
}

function buildOrderSummary() {
  const { sub, ship, total } = getOrderTotal();
  orderSummary.innerHTML = `
    <h4>Order Summary</h4>
    ${cart.map(i => `
      <div class="order-line">
        <span>${i.icon} ${i.name} × ${i.qty}</span>
        <span>$${(i.price * i.qty).toFixed(2)}</span>
      </div>
    `).join("")}
    <div class="order-line">
      <span>Shipping</span>
      <span>${ship === 0 ? "FREE" : "$" + ship.toFixed(2)}</span>
    </div>
    <div class="order-line">
      <span>Total</span>
      <span>$${total.toFixed(2)}</span>
    </div>
  `;
  document.getElementById("venmoHandle").textContent = VENMO_HANDLE;
  document.getElementById("venmoAmount").textContent = `$${total.toFixed(2)}`;
}

/* ---- Copy Venmo handle ---- */
document.getElementById("copyVenmo").addEventListener("click", () => {
  navigator.clipboard.writeText(VENMO_HANDLE).then(() => {
    const btn = document.getElementById("copyVenmo");
    const original = btn.textContent;
    btn.textContent = "Copied ✓";
    setTimeout(() => { btn.textContent = original; }, 1500);
  });
});

/* ---- Orders persistence ---- */
function loadOrders() {
  try { return JSON.parse(localStorage.getItem("leanovo_orders") || "[]"); }
  catch { return []; }
}
function saveOrders(orders) {
  localStorage.setItem("leanovo_orders", JSON.stringify(orders));
}

/* ---- Owner SMS / Email Notification ---- */
function buildOrderMessage(order) {
  const itemsLine = order.items.map(i => `${i.name} x${i.qty}`).join(", ");
  return [
    `🛒 New Leanovo Order ${order.id}`,
    `${order.customer.firstName} ${order.customer.lastName}`,
    `${order.customer.email} · ${order.customer.phone || "no phone"}`,
    `${order.customer.address}, ${order.customer.city}, ${order.customer.state} ${order.customer.zip}`,
    `Items: ${itemsLine}`,
    `Total: $${order.total.toFixed(2)} via Venmo (${VENMO_HANDLE})`,
  ].join("\n");
}

async function notifyOwner(order) {
  const message = buildOrderMessage(order);

  // Option A: Webhook (Zapier / Make → SMS)
  if (OWNER_WEBHOOK_URL) {
    try {
      await fetch(OWNER_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.id,
          message,
          order,
        }),
        mode: "no-cors", // works around CORS for Zapier hooks
      });
    } catch (err) {
      console.warn("Webhook notification failed:", err);
    }
  }

  // Option B: EmailJS (email or email-to-SMS gateway)
  if (USE_EMAILJS && window.emailjs) {
    try {
      await window.emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        {
          order_id: order.id,
          message,
          customer_name: `${order.customer.firstName} ${order.customer.lastName}`,
          customer_email: order.customer.email,
          customer_phone: order.customer.phone || "",
          total: `$${order.total.toFixed(2)}`,
        }
      );
    } catch (err) {
      console.warn("EmailJS notification failed:", err);
    }
  }
}

/* ---- Checkout Submit ---- */
checkoutForm.addEventListener("submit", e => {
  e.preventDefault();
  const formData = new FormData(checkoutForm);
  const { total } = getOrderTotal();
  const order = {
    id: "PP-" + Date.now().toString(36).toUpperCase(),
    date: new Date().toISOString(),
    status: "awaiting_payment",
    customer: {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("checkoutEmail"),
      phone: formData.get("phone"),
      address: formData.get("address"),
      city: formData.get("city"),
      state: formData.get("state"),
      zip: formData.get("zip"),
    },
    items: cart.map(i => ({ id: i.id, name: i.name, qty: i.qty, price: i.price })),
    total,
  };
  // Decrement stock
  cart.forEach(item => {
    const p = PRODUCTS.find(x => x.id === item.id);
    if (p) p.stock = Math.max(0, p.stock - item.qty);
  });
  saveProducts();
  // Save order
  const orders = loadOrders();
  orders.unshift(order);
  saveOrders(orders);

  // Fire SMS / Email notification to owner (best-effort, non-blocking)
  notifyOwner(order);

  checkoutForm.style.display = "none";
  orderSuccess.style.display = "flex";
  cart = [];
  updateCartUI();
  renderProducts();
});
successClose.addEventListener("click", () => {
  closeCheckout();
  checkoutForm.style.display = "flex";
  orderSuccess.style.display = "none";
  checkoutForm.reset();
});

/* ---- FAQ ---- */
function renderFAQ() {
  FAQS.forEach(item => {
    const el = document.createElement("div");
    el.className = "faq-item";
    el.innerHTML = `
      <button class="faq-question">
        ${item.q}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      </button>
      <div class="faq-answer"><p>${item.a}</p></div>
    `;
    el.querySelector(".faq-question").addEventListener("click", () => {
      const isOpen = el.classList.contains("open");
      document.querySelectorAll(".faq-item.open").forEach(i => i.classList.remove("open"));
      if (!isOpen) el.classList.add("open");
    });
    faqList.appendChild(el);
  });
}

/* ---- Contact Form ---- */
contactForm.addEventListener("submit", e => {
  e.preventDefault();
  formSuccess.style.display = "block";
  contactForm.reset();
  setTimeout(() => { formSuccess.style.display = "none"; }, 5000);
});

/* ---- Nav scroll effect ---- */
window.addEventListener("scroll", () => {
  const nav = document.getElementById("nav");
  nav.style.borderBottomColor = window.scrollY > 10
    ? "rgba(255,255,255,0.1)"
    : "rgba(255,255,255,0.05)";
});

/* =========================================================
   Admin Panel
   ========================================================= */
const adminOverlay   = document.getElementById("adminOverlay");
const adminModal     = document.getElementById("adminModal");
const adminClose     = document.getElementById("adminClose");
const adminLogin     = document.getElementById("adminLogin");
const adminDashboard = document.getElementById("adminDashboard");
const adminLoginForm = document.getElementById("adminLoginForm");
const adminPasswordInput = document.getElementById("adminPasswordInput");
const adminError     = document.getElementById("adminError");
const inventoryList  = document.getElementById("inventoryList");
const ordersList     = document.getElementById("ordersList");

let adminUnlocked = false;

function openAdmin() {
  adminModal.classList.add("open");
  adminOverlay.classList.add("active");
  document.body.style.overflow = "hidden";
  if (adminUnlocked) {
    adminLogin.style.display = "none";
    adminDashboard.style.display = "block";
    renderInventory();
    renderOrders();
  } else {
    adminLogin.style.display = "block";
    adminDashboard.style.display = "none";
    setTimeout(() => adminPasswordInput.focus(), 100);
  }
}
function closeAdmin() {
  adminModal.classList.remove("open");
  adminOverlay.classList.remove("active");
  document.body.style.overflow = "";
  adminError.style.display = "none";
  adminLoginForm.reset();
}
adminClose.addEventListener("click", closeAdmin);
adminOverlay.addEventListener("click", closeAdmin);

// Keyboard shortcut: Ctrl/Cmd + Shift + A
document.addEventListener("keydown", e => {
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "a") {
    e.preventDefault();
    openAdmin();
  }
});
// URL hash trigger
if (window.location.hash === "#admin") openAdmin();
window.addEventListener("hashchange", () => {
  if (window.location.hash === "#admin") openAdmin();
});

adminLoginForm.addEventListener("submit", e => {
  e.preventDefault();
  if (adminPasswordInput.value === ADMIN_PASSWORD) {
    adminUnlocked = true;
    adminLogin.style.display = "none";
    adminDashboard.style.display = "block";
    renderInventory();
    renderOrders();
  } else {
    adminError.style.display = "block";
    adminPasswordInput.value = "";
  }
});

/* Tabs */
document.querySelectorAll(".admin-tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".admin-tab").forEach(t => t.classList.remove("admin-tab--active"));
    tab.classList.add("admin-tab--active");
    const target = tab.dataset.tab;
    document.getElementById("tabInventory").style.display = target === "inventory" ? "block" : "none";
    document.getElementById("tabOrders").style.display    = target === "orders"    ? "block" : "none";
    if (target === "orders") renderOrders();
  });
});

function renderInventory() {
  inventoryList.innerHTML = "";
  PRODUCTS.forEach(p => {
    const row = document.createElement("div");
    row.className = "inv-row";
    row.innerHTML = `
      <div class="inv-row__info">
        <div class="inv-row__icon">${p.icon}</div>
        <div>
          <div class="inv-row__name">${p.name}</div>
          <div class="inv-row__sub">$${p.price.toFixed(2)} · ${p.unit}</div>
        </div>
      </div>
      <div class="inv-row__controls">
        <button class="qty-btn" data-id="${p.id}" data-delta="-1">−</button>
        <input type="number" class="inv-input" data-id="${p.id}" value="${p.stock}" min="0" />
        <button class="qty-btn" data-id="${p.id}" data-delta="1">+</button>
      </div>
    `;
    inventoryList.appendChild(row);
  });
  inventoryList.querySelectorAll(".qty-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const p = PRODUCTS.find(x => x.id === parseInt(btn.dataset.id));
      if (!p) return;
      p.stock = Math.max(0, p.stock + parseInt(btn.dataset.delta));
      saveProducts();
      renderInventory();
      renderProducts();
    });
  });
  inventoryList.querySelectorAll(".inv-input").forEach(input => {
    input.addEventListener("change", () => {
      const p = PRODUCTS.find(x => x.id === parseInt(input.dataset.id));
      if (!p) return;
      p.stock = Math.max(0, parseInt(input.value) || 0);
      saveProducts();
      renderProducts();
    });
  });
}

function renderOrders() {
  const orders = loadOrders();
  if (orders.length === 0) {
    ordersList.innerHTML = `<div class="empty-state">No orders yet.</div>`;
    return;
  }
  ordersList.innerHTML = orders.map(o => `
    <div class="order-card">
      <div class="order-card__header">
        <div>
          <div class="order-card__id">${o.id}</div>
          <div class="order-card__date">${new Date(o.date).toLocaleString()}</div>
        </div>
        <span class="order-status order-status--${o.status}">${o.status === "shipped" ? "Shipped" : o.status === "paid" ? "Paid" : "Awaiting Payment"}</span>
      </div>
      <div class="order-card__body">
        <div><strong>${o.customer.firstName} ${o.customer.lastName}</strong></div>
        <div>${o.customer.email} · ${o.customer.phone || "—"}</div>
        <div>${o.customer.address}, ${o.customer.city}, ${o.customer.state} ${o.customer.zip}</div>
        <div class="order-card__items">
          ${o.items.map(i => `<span>${i.name} × ${i.qty}</span>`).join(" · ")}
        </div>
        <div class="order-card__total">Total: <strong>$${o.total.toFixed(2)}</strong></div>
      </div>
      <div class="order-card__actions">
        ${o.status === "awaiting_payment" ? `<button class="btn-mini btn-mini--success" data-action="paid" data-id="${o.id}">Mark Paid</button>` : ""}
        ${o.status !== "shipped" ? `<button class="btn-mini btn-mini--primary" data-action="shipped" data-id="${o.id}">Mark Shipped</button>` : ""}
        <button class="btn-mini btn-mini--danger" data-action="delete" data-id="${o.id}">Delete</button>
      </div>
    </div>
  `).join("");
  ordersList.querySelectorAll("[data-action]").forEach(btn => {
    btn.addEventListener("click", () => {
      let orders = loadOrders();
      const id = btn.dataset.id;
      const action = btn.dataset.action;
      if (action === "delete") {
        orders = orders.filter(o => o.id !== id);
      } else {
        const o = orders.find(x => x.id === id);
        if (o) o.status = action;
      }
      saveOrders(orders);
      renderOrders();
    });
  });
}

/* ---- Init ---- */
renderProducts();
renderFAQ();
updateCartUI();
