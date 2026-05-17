/* =========================================================
   PurePep — App Logic
   ========================================================= */

const PRODUCTS = [
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
    desc: "A synthetic peptide with notable research into soft tissue repair, gut health support, and recovery acceleration.",
    meta: ["5mg / vial", "≥99% Purity", "Lyophilized"],
  },
  {
    id: 2,
    name: "TB-500",
    fullName: "Thymosin Beta-4",
    category: "healing",
    categoryLabel: "Healing & Recovery",
    icon: "💊",
    price: 54.99,
    unit: "5mg vial",
    purity: "≥98%",
    desc: "Researched for its role in cell proliferation, migration, and differentiation — particularly relevant to tissue healing.",
    meta: ["5mg / vial", "≥98% Purity", "Lyophilized"],
  },
  {
    id: 3,
    name: "CJC-1295",
    fullName: "CJC-1295 DAC",
    category: "growth",
    categoryLabel: "Growth & Performance",
    icon: "⚡",
    price: 39.99,
    unit: "2mg vial",
    purity: "≥99%",
    desc: "A long-acting GHRH analogue studied for sustained growth hormone release, lean mass, and recovery.",
    meta: ["2mg / vial", "≥99% Purity", "Lyophilized"],
  },
  {
    id: 4,
    name: "Ipamorelin",
    fullName: "Ipamorelin Acetate",
    category: "growth",
    categoryLabel: "Growth & Performance",
    icon: "🔬",
    price: 34.99,
    unit: "5mg vial",
    purity: "≥99%",
    desc: "A selective GH secretagogue studied for growth hormone release with minimal cortisol and prolactin elevation.",
    meta: ["5mg / vial", "≥99% Purity", "Lyophilized"],
  },
  {
    id: 5,
    name: "Semaglutide",
    fullName: "Semaglutide (GLP-1)",
    category: "metabolic",
    categoryLabel: "Metabolic",
    icon: "🎯",
    price: 89.99,
    unit: "3mg vial",
    purity: "≥98.5%",
    desc: "A GLP-1 receptor agonist extensively studied for glucose metabolism regulation and satiety signaling.",
    meta: ["3mg / vial", "≥98.5% Purity", "Lyophilized"],
  },
  {
    id: 6,
    name: "Tirzepatide",
    fullName: "Tirzepatide (GLP-1/GIP)",
    category: "metabolic",
    categoryLabel: "Metabolic",
    icon: "🌿",
    price: 99.99,
    unit: "5mg vial",
    purity: "≥98%",
    desc: "A dual GIP/GLP-1 receptor agonist with promising research in metabolic function and energy regulation.",
    meta: ["5mg / vial", "≥98% Purity", "Lyophilized"],
  },
  {
    id: 7,
    name: "Selank",
    fullName: "Selank Peptide",
    category: "cognitive",
    categoryLabel: "Cognitive",
    icon: "🧠",
    price: 44.99,
    unit: "5mg vial",
    purity: "≥99%",
    desc: "A synthetic analogue of tuftsin studied for anxiolytic effects, mood stabilization, and cognitive function.",
    meta: ["5mg / vial", "≥99% Purity", "Lyophilized"],
  },
  {
    id: 8,
    name: "Semax",
    fullName: "Semax Peptide",
    category: "cognitive",
    categoryLabel: "Cognitive",
    icon: "✨",
    price: 47.99,
    unit: "5mg vial",
    purity: "≥99%",
    desc: "An ACTH-derived peptide researched for neuroprotection, BDNF upregulation, and attention enhancement.",
    meta: ["5mg / vial", "≥99% Purity", "Lyophilized"],
  },
  {
    id: 9,
    name: "PT-141",
    fullName: "Bremelanotide",
    category: "healing",
    categoryLabel: "Healing & Recovery",
    icon: "💫",
    price: 42.99,
    unit: "10mg vial",
    purity: "≥98%",
    desc: "A melanocortin receptor agonist studied for its role in various physiological pathways.",
    meta: ["10mg / vial", "≥98% Purity", "Lyophilized"],
  },
  {
    id: 10,
    name: "DSIP",
    fullName: "Delta Sleep-Inducing Peptide",
    category: "cognitive",
    categoryLabel: "Cognitive",
    icon: "🌙",
    price: 38.99,
    unit: "5mg vial",
    purity: "≥98%",
    desc: "A neuropeptide studied for its effects on sleep architecture, stress response, and circadian rhythm regulation.",
    meta: ["5mg / vial", "≥98% Purity", "Lyophilized"],
  },
  {
    id: 11,
    name: "GHK-Cu",
    fullName: "Copper Peptide GHK-Cu",
    category: "healing",
    categoryLabel: "Healing & Recovery",
    icon: "🔷",
    price: 36.99,
    unit: "50mg powder",
    purity: "≥99%",
    desc: "A naturally occurring copper complex studied for collagen synthesis, wound healing, and antioxidant activity.",
    meta: ["50mg / jar", "≥99% Purity", "Powder"],
  },
  {
    id: 12,
    name: "Hexarelin",
    fullName: "Hexarelin Acetate",
    category: "growth",
    categoryLabel: "Growth & Performance",
    icon: "💪",
    price: 41.99,
    unit: "2mg vial",
    purity: "≥99%",
    desc: "A potent GH secretagogue studied for growth hormone release, cardiovascular research, and muscle recovery.",
    meta: ["2mg / vial", "≥99% Purity", "Lyophilized"],
  },
];

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
const filterBtns  = document.querySelectorAll(".filter-btn");
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

/* ---- Render Products ---- */
function renderProducts() {
  const filtered = activeCategory === "all"
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === activeCategory);

  productGrid.innerHTML = "";
  filtered.forEach((p, i) => {
    const card = document.createElement("div");
    card.className = "product-card";
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
      <div class="product-card__footer">
        <div class="product-card__price">$${p.price.toFixed(2)}<span>/ ${p.unit}</span></div>
        <button class="add-to-cart" data-id="${p.id}">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add
        </button>
      </div>
    `;
    productGrid.appendChild(card);
  });

  document.querySelectorAll(".add-to-cart").forEach(btn => {
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
  const existing = cart.find(i => i.id === id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  updateCartUI();
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
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(id);
  else updateCartUI();
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

function buildOrderSummary() {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
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
      <span>${total >= 100 ? "FREE" : "$9.99"}</span>
    </div>
    <div class="order-line">
      <span>Total</span>
      <span>$${(total + (total >= 100 ? 0 : 9.99)).toFixed(2)}</span>
    </div>
  `;
}

/* ---- Card input formatting ---- */
document.getElementById("cardNumber").addEventListener("input", function () {
  let v = this.value.replace(/\D/g, "").slice(0, 16);
  this.value = v.replace(/(.{4})/g, "$1 ").trim();
});
document.getElementById("cardExpiry").addEventListener("input", function () {
  let v = this.value.replace(/\D/g, "").slice(0, 4);
  if (v.length >= 3) v = v.slice(0, 2) + " / " + v.slice(2);
  this.value = v;
});
document.getElementById("cardCVV").addEventListener("input", function () {
  this.value = this.value.replace(/\D/g, "").slice(0, 4);
});

/* ---- Checkout Submit ---- */
checkoutForm.addEventListener("submit", e => {
  e.preventDefault();
  checkoutForm.style.display = "none";
  orderSuccess.style.display = "flex";
  cart = [];
  updateCartUI();
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

/* ---- Init ---- */
renderProducts();
renderFAQ();
updateCartUI();
