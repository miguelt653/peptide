/* =========================================================
   Bella Vita Labs — App Logic
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
const CASHAPP_HANDLE    = "$BellaVitaLabs"; // change to actual cashtag
const ADMIN_PASSWORD    = "changeme123"; // change me in production
const VALID_REFERRAL_CODES = ["VAL"];    // accepted referral codes (case-insensitive)
const OWNER_WEBHOOK_URL = "";            // e.g. "https://hooks.zapier.com/hooks/catch/123456/abcdef/"
const USE_EMAILJS       = false;
const EMAILJS_CONFIG    = {
  publicKey:  "YOUR_PUBLIC_KEY",
  serviceId:  "YOUR_SERVICE_ID",
  templateId: "YOUR_TEMPLATE_ID",
};

// Initialize EmailJS once, if enabled and the SDK loaded
if (USE_EMAILJS && window.emailjs && EMAILJS_CONFIG.publicKey && EMAILJS_CONFIG.publicKey !== "YOUR_PUBLIC_KEY") {
  try { window.emailjs.init({ publicKey: EMAILJS_CONFIG.publicKey }); }
  catch (e) { console.warn("EmailJS init failed:", e); }
}

const DEFAULT_PRODUCTS = [
  {
    id: 2,
    name: "Retatrutide",
    fullName: "Retatrutide (GLP-1/GIP/Glucagon Triple Agonist)",
    category: "metabolic",
    categoryLabel: "Metabolic",
    icon: "🎯",
    coa: "assets/coa-retatrutide.jpg",
    price: 195,
    penPrice: 265,
    unit: "20mg vial",
    purity: "≥99%",
    desc: "A next-generation triple receptor agonist (GLP-1, GIP, and glucagon) being actively studied for metabolic regulation, body composition, and energy balance.",
    meta: ["20mg / vial", "≥99% Purity", "Lyophilized", "COA Included"],
    stock: 15,
    detail: {
      overview: "Retatrutide is a novel triple receptor agonist that simultaneously targets GLP-1, GIP, and glucagon receptors — making it the first of its kind in peptide research. Early clinical data has positioned it as one of the most potent metabolic peptides studied to date, with research showing significantly greater effects on body composition than single or dual agonists.",
      benefits: [
        "Targets three metabolic receptors simultaneously (GLP-1, GIP, glucagon)",
        "Studied for significant improvements in body composition",
        "Supports glucose metabolism and insulin sensitivity",
        "May enhance energy expenditure via glucagon receptor activation",
        "Research indicates superior metabolic outcomes vs. dual agonists",
        "Potential cardiovascular benefits under investigation",
      ],
      mechanism: "Retatrutide's triple agonism creates a synergistic metabolic effect: GLP-1 activation reduces appetite and slows gastric emptying; GIP activation enhances insulin response and fat metabolism; glucagon receptor activation increases energy expenditure and promotes fat oxidation. Together, these mechanisms produce compounding metabolic benefits.",
      specs: [
        { label: "Class", value: "Triple GLP-1/GIP/Glucagon receptor agonist" },
        { label: "Molecular Weight", value: "~4,900 Da" },
        { label: "Half-Life", value: "~6 days (subcutaneous)" },
        { label: "Form", value: "Lyophilized powder" },
        { label: "Purity", value: "≥99% (HPLC verified)" },
        { label: "Storage", value: "Refrigerate at 2–8°C. Do not freeze reconstituted solution." },
      ],
    },
  },
  {
    id: 4,
    name: "NAD+",
    fullName: "Nicotinamide Adenine Dinucleotide",
    category: "metabolic",
    categoryLabel: "Metabolic",
    icon: "✨",
    coa: "assets/coa-nad.jpg",
    price: 115,
    penPrice: 150,
    unit: "500mg vial",
    purity: "≥99%",
    desc: "A critical coenzyme present in every living cell, studied extensively for cellular energy production, mitochondrial function, DNA repair, and longevity pathways.",
    meta: ["500mg / vial", "≥99% Purity", "Lyophilized", "COA Included"],
    stock: 22,
    detail: {
      overview: "NAD+ (Nicotinamide Adenine Dinucleotide) is a coenzyme found in every cell of the body, essential for converting nutrients into ATP — the body's energy currency. NAD+ levels decline significantly with age, and a growing body of research connects NAD+ restoration to mitochondrial health, cellular repair, and longevity pathways. It's one of the most actively studied molecules in aging research today.",
      benefits: [
        "Supports cellular energy production via the mitochondrial electron transport chain",
        "Activates sirtuins — proteins involved in DNA repair and longevity",
        "Studied for improvements in mental clarity, focus, and cognitive function",
        "Supports healthy aging and may slow markers of cellular senescence",
        "Plays a key role in DNA damage repair via PARP enzymes",
        "Research suggests benefits for energy, metabolism, and recovery",
      ],
      mechanism: "NAD+ functions as an electron carrier in cellular metabolism, shuttling electrons during the conversion of nutrients to ATP. It's also a required substrate for sirtuins (longevity-associated proteins) and PARP enzymes (DNA repair). Supplementation replenishes the natural decline of NAD+ that occurs with age, restoring cellular energy capacity and supporting key repair mechanisms.",
      specs: [
        { label: "Class", value: "Coenzyme / Cellular cofactor" },
        { label: "Molecular Weight", value: "663.43 Da" },
        { label: "Form", value: "Lyophilized powder" },
        { label: "Purity", value: "≥99% (HPLC verified)" },
        { label: "Storage", value: "Refrigerate at 2–8°C. Protect from light." },
        { label: "Reconstitution", value: "Bacteriostatic water or sterile saline" },
      ],
    },
  },
  {
    id: 6,
    name: "GHK-Cu",
    fullName: "Copper Peptide GHK-Cu",
    category: "healing",
    categoryLabel: "Healing & Recovery",
    icon: "🔷",
    coa: "assets/coa-ghk-cu.jpg",
    price: 115,
    penPrice: 140,
    unit: "50mg powder",
    purity: "≥99%",
    desc: "A naturally occurring copper complex found in human plasma, studied for collagen synthesis stimulation, wound healing, antioxidant activity, and tissue remodeling.",
    meta: ["50mg / jar", "≥99% Purity", "Powder Form", "COA Included"],
    stock: 30,
    detail: {
      overview: "GHK-Cu (Glycyl-L-histidyl-L-lysine copper complex) is a naturally occurring tripeptide found in human plasma, saliva, and urine. Its levels decline significantly with age. Research has shown it plays a wide-ranging role in tissue repair, anti-aging, and antioxidant defense — making it one of the most studied peptides in regenerative and aesthetic research.",
      benefits: [
        "Stimulates collagen and elastin synthesis in connective tissue",
        "Accelerates wound and burn healing in multiple research models",
        "Potent antioxidant — reduces free radical damage to cells",
        "Studied extensively for skin regeneration and anti-aging effects",
        "Promotes nerve regeneration and neuroprotection",
        "Activates over 30 genes related to tissue repair and remodeling",
      ],
      mechanism: "GHK-Cu works by acting as a biological signal that the body interprets as a cue for repair. The copper ion acts as a cofactor for enzymes involved in collagen cross-linking. GHK itself activates the proteasome system (clearing damaged proteins), upregulates antioxidant enzymes, and promotes stem cell recruitment to damaged tissue sites.",
      specs: [
        { label: "Sequence", value: "Gly-His-Lys · Cu²⁺" },
        { label: "Molecular Weight", value: "340.4 Da (peptide), 403.9 Da (Cu complex)" },
        { label: "Form", value: "Lyophilized powder" },
        { label: "Purity", value: "≥99% (HPLC verified)" },
        { label: "Storage", value: "Store at room temperature or refrigerate. Avoid prolonged light exposure." },
        { label: "Solubility", value: "Highly water soluble" },
      ],
    },
  },
  {
    id: 7,
    name: "Wolverine Stack",
    fullName: "BPC-157 + TB-500 Recovery Stack",
    category: "healing",
    categoryLabel: "Healing & Recovery",
    icon: "🛡️",
    coa: "assets/coa-wolverine.jpg",
    price: 115,
    penPrice: 140,
    unit: "10mg blend vial",
    purity: "≥99%",
    desc: "A complete recovery blend pairing BPC-157 (5mg) with TB-500 (5mg) — two of the most studied healing peptides — for comprehensive soft-tissue, tendon, and ligament recovery research.",
    meta: ["BPC-157 5mg", "TB-500 5mg", "≥99% Purity", "COA Included"],
    stock: 15,
    detail: {
      overview: "The Wolverine Stack combines BPC-157 and TB-500 into a single recovery protocol. BPC-157 acts locally and site-specifically to accelerate healing, while TB-500 works systemically throughout the body. Together they are studied as complementary peptides that address tissue repair from two distinct angles — making this one of the most popular combinations in regenerative research.",
      benefits: [
        "Pairs site-specific (BPC-157) and systemic (TB-500) healing pathways",
        "Studied for accelerated tendon, ligament, and muscle recovery",
        "Supports soft-tissue repair and reduced inflammation at injury sites",
        "Promotes angiogenesis and new blood vessel formation in research models",
        "Investigated for improved flexibility and range of motion",
        "Complementary mechanisms — broader coverage than either peptide alone",
      ],
      mechanism: "BPC-157 upregulates growth hormone receptors and the FAK-paxillin pathway while promoting VEGF-driven angiogenesis at the injury site. TB-500 upregulates actin to accelerate cell migration and tissue repair systemically. Used together, they target both localized and body-wide repair processes simultaneously, which is why they are commonly researched as a stack.",
      specs: [
        { label: "Contents", value: "5mg BPC-157 + 5mg TB-500 (blend vial)" },
        { label: "Form", value: "Lyophilized powder" },
        { label: "Purity", value: "≥99% blend (HPLC verified)" },
        { label: "Storage", value: "Refrigerate at 2–8°C. Stable up to 24 months lyophilized." },
        { label: "Reconstitution", value: "Bacteriostatic water" },
      ],
    },
  },
  {
    id: 8,
    name: "Melanotan II",
    fullName: "Melanotan II (MT-2)",
    category: "aesthetic",
    categoryLabel: "Aesthetic",
    icon: "☀️",
    price: 100,
    penPrice: 125,
    unit: "10mg vial",
    purity: "≥99%",
    desc: "A synthetic analogue of alpha-melanocyte-stimulating hormone (α-MSH), studied for its effect on melanogenesis (skin pigmentation) and the tanning response with reduced UV exposure.",
    meta: ["10mg / vial", "≥99% Purity", "Lyophilized", "COA Included"],
    stock: 20,
    detail: {
      overview: "Melanotan II (MT-2) is a synthetic peptide analogue of the naturally occurring hormone α-MSH. It is studied primarily for its ability to stimulate melanin production in the skin, producing a tanning response with less ultraviolet exposure than would otherwise be required. It has also been investigated in research for other α-MSH-related pathways.",
      benefits: [
        "Stimulates melanogenesis (melanin production) for increased skin pigmentation",
        "Studied for achieving a tanning response with reduced UV exposure",
        "Activates melanocortin receptors involved in pigmentation",
        "Investigated for appetite and libido pathways in research models",
        "Effects studied across a range of skin types",
      ],
      mechanism: "Melanotan II binds to melanocortin receptors (primarily MC1R) on melanocytes, stimulating the production and release of eumelanin — the pigment responsible for skin darkening. By activating this pathway directly, it triggers a tanning response with less reliance on UV-induced melanogenesis.",
      specs: [
        { label: "Class", value: "Synthetic α-MSH analogue" },
        { label: "Molecular Weight", value: "1,024.2 Da" },
        { label: "Form", value: "Lyophilized powder" },
        { label: "Purity", value: "≥99% (HPLC verified)" },
        { label: "Storage", value: "Refrigerate at 2–8°C. Protect from light." },
        { label: "Reconstitution", value: "Bacteriostatic water" },
      ],
    },
  },
];

/* ---- Load products w/ stock from localStorage ---- */
function loadProducts() {
  const saved = localStorage.getItem("bellavita_products") || localStorage.getItem("leanova_products");
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
  localStorage.setItem("bellavita_products", JSON.stringify(PRODUCTS.map(p => ({ id: p.id, stock: p.stock }))));
}
const PRODUCTS = loadProducts();

const FAQS = [
  {
    q: "What does 'research purposes only' mean?",
    a: "All Bella Vita Labs peptides are sold strictly for in vitro (laboratory) research. They are not intended for human or veterinary use, consumption, or injection. Always consult a licensed healthcare professional before any personal use.",
  },
  {
    q: "How do you verify purity?",
    a: "Every batch undergoes HPLC (High-Performance Liquid Chromatography) and Mass Spectrometry testing at an independent third-party laboratory. A Certificate of Analysis (COA) ships with every order.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We currently accept Cash App only. At checkout you'll see our cashtag and the exact amount to send. We ship as soon as the payment clears — typically within a few hours of receipt.",
  },
  {
    q: "How long until my order ships?",
    a: "Once your Cash App payment is confirmed, orders ship within 1–2 business days. You'll receive a confirmation email with tracking once your package is on its way.",
  },
  {
    q: "How are orders packaged and shipped?",
    a: "All peptides ship with cold-pack insulation in plain, unmarked packaging to preserve product stability and your privacy. We use USPS Priority or UPS Ground depending on your location.",
  },
  {
    q: "What if my Cash App payment doesn't match an order?",
    a: "That's why we ask you to include your name and email in the Cash App note. If we can't match a payment to an order, we'll reach out directly using the contact info you submitted at checkout.",
  },
  {
    q: "Do I need an account to order?",
    a: "No. There are no accounts, no passwords, no logins. Just add what you want to the cart, enter your shipping info and email, and send the Cash App payment.",
  },
  {
    q: "Do you accept returns or refunds?",
    a: "All sales are final. We do not accept returns or issue refunds. Because peptides are sensitive to temperature and handling, we cannot resell returned product. If your order arrives damaged or doesn't match the COA, contact us right away and we'll make it right.",
  },
  {
    q: "Where do you ship to?",
    a: "We currently ship within the United States only. International orders are not supported at this time due to varying customs regulations.",
  },
];

/* ---- State ---- */
let cart = [];
let activeCategory = "all";
let selectedVariant = {}; // { [productId]: "vial" | "pen" }
let shippingMethod = "standard"; // "standard" ($25) | "local" ($15, Tampa/St. Pete/Clearwater)

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
  // total quantity across all variants of this product
  return cart.filter(i => i.id === id).reduce((s, i) => s + i.qty, 0);
}
function availableStock(p) {
  return Math.max(0, p.stock - inCart(p.id));
}

/* ---- Variant ("with Pen") helpers ---- */
function hasPen(p) {
  return typeof p.penPrice === "number";
}
function variantOf(id) {
  return selectedVariant[id] || "vial";
}
function priceFor(p, variant) {
  return variant === "pen" && hasPen(p) ? p.penPrice : p.price;
}

/* ---- Render Products ---- */
function renderProducts() {
  const filtered = activeCategory === "all"
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === activeCategory);

  productGrid.innerHTML = "";
  filtered.forEach((p, i) => {
    const variant = variantOf(p.id);
    const curPrice = priceFor(p, variant);
    const card = document.createElement("div");
    card.className = "product-card";
    card.style.animationDelay = `${i * 0.05}s`;
    card.innerHTML = `
      <div class="product-card__img">
        <span class="product-card__img-badge">${p.categoryLabel}</span>
      </div>
      <div class="product-card__body">
        <div class="product-card__name">${p.name}</div>
        <p class="product-card__desc">${p.desc}</p>
        <div class="product-card__specs">
          ${p.meta.map(m => `<span class="spec-tag">${m}</span>`).join("")}
        </div>
        ${p.coa ? `
        <button class="view-coa" data-coa="${p.coa}" data-name="${p.name}">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          View Certificate of Analysis
        </button>` : ''}
        ${hasPen(p) ? `
        <div class="variant-select">
          <button class="variant-opt ${variant === 'vial' ? 'variant-opt--active' : ''}" data-id="${p.id}" data-variant="vial">
            Vial Only<span>$${p.price.toFixed(2)}</span>
          </button>
          <button class="variant-opt ${variant === 'pen' ? 'variant-opt--active' : ''}" data-id="${p.id}" data-variant="pen">
            With Pen<span>$${p.penPrice.toFixed(2)}</span>
          </button>
        </div>` : ''}
      </div>
      <div class="product-card__footer">
        <div>
          <div class="product-card__price">$${curPrice.toFixed(2)}</div>
          <div class="product-card__price-sub">${variant === 'pen' ? 'vial + injection pen' : `per ${p.unit}`}</div>
        </div>
        <div class="product-card__actions">
          <button class="view-details-btn" data-id="${p.id}">Details</button>
          <button class="add-to-cart" data-id="${p.id}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Add
          </button>
        </div>
      </div>
    `;
    productGrid.appendChild(card);
  });

  document.querySelectorAll(".variant-opt").forEach(btn => {
    btn.addEventListener("click", () => {
      selectedVariant[parseInt(btn.dataset.id)] = btn.dataset.variant;
      renderProducts();
    });
  });
  document.querySelectorAll(".add-to-cart:not([disabled])").forEach(btn => {
    btn.addEventListener("click", () => addToCart(parseInt(btn.dataset.id), variantOf(parseInt(btn.dataset.id)), btn));
  });
  document.querySelectorAll(".view-details-btn").forEach(btn => {
    btn.addEventListener("click", () => openDetail(parseInt(btn.dataset.id)));
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
function addToCart(id, variant, btn) {
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) return;
  variant = variant === "pen" && hasPen(product) ? "pen" : "vial";
  const existing = cart.find(i => i.id === id && i.variant === variant);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({
      id: product.id,
      variant,
      name: product.name,
      icon: product.icon,
      unit: product.unit,
      price: priceFor(product, variant),
      qty: 1,
    });
  }
  updateCartUI();
  renderProducts();
  if (btn) {
    btn.classList.add("added");
    btn.textContent = "Added ✓";
    setTimeout(() => {
      btn.classList.remove("added");
      btn.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Add`;
    }, 1500);
  }
}

function removeFromCart(id, variant) {
  cart = cart.filter(i => !(i.id === id && i.variant === variant));
  updateCartUI();
  renderProducts();
}

function changeQty(id, variant, delta) {
  const item = cart.find(i => i.id === id && i.variant === variant);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(id, variant);
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
        <div class="cart-item__name">${item.icon} ${item.name}${item.variant === 'pen' ? ' <span class="cart-item__variant">+ Pen</span>' : ''}</div>
        <div class="cart-item__price">$${item.price.toFixed(2)} / ${item.variant === 'pen' ? 'vial + pen' : item.unit}</div>
        <div class="cart-item__controls">
          <button class="qty-btn" data-id="${item.id}" data-variant="${item.variant}" data-delta="-1">−</button>
          <span class="qty-display">${item.qty}</span>
          <button class="qty-btn" data-id="${item.id}" data-variant="${item.variant}" data-delta="1">+</button>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px">
        <button class="cart-item__remove" data-id="${item.id}" data-variant="${item.variant}" title="Remove">×</button>
        <span class="cart-item__total">$${(item.price * item.qty).toFixed(2)}</span>
      </div>
    `;
    cartItems.appendChild(el);
  });

  cartItems.querySelectorAll(".qty-btn").forEach(btn => {
    btn.addEventListener("click", () => changeQty(parseInt(btn.dataset.id), btn.dataset.variant, parseInt(btn.dataset.delta)));
  });
  cartItems.querySelectorAll(".cart-item__remove").forEach(btn => {
    btn.addEventListener("click", () => removeFromCart(parseInt(btn.dataset.id), btn.dataset.variant));
  });

  cartTotal.textContent = `$${total.toFixed(2)}`;
  const shippingNote = document.getElementById("shippingNote");
  if (shippingNote) {
    shippingNote.textContent = "Shipping $25 flat · Local delivery $15 (Tampa · St. Pete · Clearwater)";
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
  shippingMethod = "standard";
  const stdRadio = document.querySelector('input[name="shipMethod"][value="standard"]');
  if (stdRadio) stdRadio.checked = true;
  buildOrderSummary();
  checkoutModal.classList.add("open");
  modalOverlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

// Shipping method selection updates totals live
document.querySelectorAll('input[name="shipMethod"]').forEach(radio => {
  radio.addEventListener("change", () => {
    shippingMethod = radio.value;
    buildOrderSummary();
  });
});
function closeCheckout() {
  checkoutModal.classList.remove("open");
  modalOverlay.classList.remove("active");
  document.body.style.overflow = "";
}
checkoutBtn.addEventListener("click", openCheckout);
modalClose.addEventListener("click", closeCheckout);
modalOverlay.addEventListener("click", closeCheckout);

const SHIPPING_RATES = { standard: 25, local: 15 };
function shippingLabel(method) {
  return method === "local" ? "Local Delivery (Tampa · St. Pete · Clearwater)" : "Standard Shipping";
}
function getOrderTotal() {
  const sub = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const ship = SHIPPING_RATES[shippingMethod] ?? SHIPPING_RATES.standard;
  return { sub, ship, total: sub + ship };
}

function buildOrderSummary() {
  const { sub, ship, total } = getOrderTotal();
  orderSummary.innerHTML = `
    <h4>Order Summary</h4>
    ${cart.map(i => `
      <div class="order-line">
        <span>${i.icon} ${i.name}${i.variant === 'pen' ? ' (+ Pen)' : ''} × ${i.qty}</span>
        <span>$${(i.price * i.qty).toFixed(2)}</span>
      </div>
    `).join("")}
    <div class="order-line">
      <span>${shippingMethod === "local" ? "Local Delivery" : "Shipping"}</span>
      <span>$${ship.toFixed(2)}</span>
    </div>
    <div class="order-line">
      <span>Total</span>
      <span>$${total.toFixed(2)}</span>
    </div>
  `;
  document.getElementById("venmoHandle").textContent = CASHAPP_HANDLE;
  document.getElementById("venmoAmount").textContent = `$${total.toFixed(2)}`;
}

/* ---- Copy Cash App handle ---- */
document.getElementById("copyVenmo").addEventListener("click", () => {
  navigator.clipboard.writeText(CASHAPP_HANDLE).then(() => {
    const btn = document.getElementById("copyVenmo");
    const original = btn.textContent;
    btn.textContent = "Copied ✓";
    setTimeout(() => { btn.textContent = original; }, 1500);
  });
});

/* ---- Referral Code ---- */
function normalizeReferral(code) {
  return (code || "").trim().toUpperCase();
}
function isValidReferral(code) {
  return VALID_REFERRAL_CODES.includes(normalizeReferral(code));
}

const referralInput    = document.getElementById("referralInput");
const referralFeedback = document.getElementById("referralFeedback");

function updateReferralFeedback() {
  if (!referralInput || !referralFeedback) return;
  const code = normalizeReferral(referralInput.value);
  if (!code) {
    referralFeedback.textContent = "";
    referralFeedback.className = "referral-feedback";
  } else if (isValidReferral(code)) {
    referralFeedback.textContent = `✓ Code ${code} applied`;
    referralFeedback.className = "referral-feedback referral-feedback--ok";
  } else {
    referralFeedback.textContent = "Code not recognized";
    referralFeedback.className = "referral-feedback referral-feedback--err";
  }
}
if (referralInput) referralInput.addEventListener("input", updateReferralFeedback);

/* ---- Orders persistence ---- */
function loadOrders() {
  try { return JSON.parse(localStorage.getItem("bellavita_orders") || localStorage.getItem("leanova_orders") || "[]"); }
  catch { return []; }
}
function saveOrders(orders) {
  localStorage.setItem("bellavita_orders", JSON.stringify(orders));
}

/* ---- Owner SMS / Email Notification ---- */
function buildOrderMessage(order) {
  const itemsLine = order.items.map(i => `${i.name}${i.variant === 'pen' ? ' (+Pen)' : ''} x${i.qty}`).join(", ");
  return [
    `🛒 New Bella Vita Labs Order ${order.id}`,
    `${order.customer.firstName} ${order.customer.lastName}`,
    `${order.customer.email} · ${order.customer.phone || "no phone"}`,
    `${order.customer.address}, ${order.customer.city}, ${order.customer.state} ${order.customer.zip}`,
    `Items: ${itemsLine}`,
    `Shipping: ${shippingLabel(order.shippingMethod)} — $${(order.shipping ?? 0).toFixed(2)}`,
    `Total: $${order.total.toFixed(2)} via Cash App (${CASHAPP_HANDLE})`,
    order.referral ? `Referral: ${order.referral}${order.referralValid ? " ✓" : " (unrecognized)"}` : "Referral: none",
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
          shipping: `${shippingLabel(order.shippingMethod)} — $${(order.shipping ?? 0).toFixed(2)}`,
          total: `$${order.total.toFixed(2)}`,
          referral: order.referral
            ? `${order.referral}${order.referralValid ? " (valid)" : " (unrecognized)"}`
            : "none",
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
  const { ship, total } = getOrderTotal();
  const order = {
    id: "BV-" + Date.now().toString(36).toUpperCase(),
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
    items: cart.map(i => ({ id: i.id, name: i.name, variant: i.variant, qty: i.qty, price: i.price })),
    shippingMethod,
    shipping: ship,
    total,
    referral: normalizeReferral(formData.get("referral")) || null,
    referralValid: isValidReferral(formData.get("referral")),
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
  updateReferralFeedback();
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

/* =========================================================
   Product Detail Modal
   ========================================================= */
const detailOverlay = document.getElementById("detailOverlay");
const detailModal   = document.getElementById("detailModal");
const detailClose   = document.getElementById("detailClose");
const detailBody    = document.getElementById("detailBody");
const detailAddBtn  = document.getElementById("detailAddBtn");

let detailProduct = null;

function refreshDetailPrice(p) {
  const variant = variantOf(p.id);
  document.getElementById("detailPrice").textContent = `$${priceFor(p, variant).toFixed(2)}`;
  document.getElementById("detailUnit").textContent  = variant === "pen" ? "vial + injection pen" : `per ${p.unit}`;
  detailBody.querySelectorAll(".variant-opt").forEach(b => {
    b.classList.toggle("variant-opt--active", b.dataset.variant === variant);
  });
}

function openDetail(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;
  detailProduct = p;

  document.getElementById("detailIcon").textContent     = p.icon;
  document.getElementById("detailName").textContent     = p.name;
  document.getElementById("detailFullName").textContent = p.fullName;

  detailAddBtn.disabled = false;
  detailAddBtn.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Add to Cart`;

  const d = p.detail;
  detailBody.innerHTML = `
    ${hasPen(p) ? `
    <div class="variant-select variant-select--modal">
      <button class="variant-opt" data-variant="vial">Vial Only<span>$${p.price.toFixed(2)}</span></button>
      <button class="variant-opt" data-variant="pen">With Pen<span>$${p.penPrice.toFixed(2)}</span></button>
    </div>` : ''}
    <div class="detail-section">
      <span class="detail-category-badge detail-category-badge--${p.category}">${p.categoryLabel}</span>
      <p class="detail-overview">${d.overview}</p>
    </div>

    <div class="detail-section">
      <h4 class="detail-section-title">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
        Key Benefits
      </h4>
      <ul class="detail-benefits">
        ${d.benefits.map(b => `<li>${b}</li>`).join("")}
      </ul>
    </div>

    <div class="detail-section">
      <h4 class="detail-section-title">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        How It Works
      </h4>
      <p class="detail-mechanism">${d.mechanism}</p>
    </div>

    <div class="detail-section">
      <h4 class="detail-section-title">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"/></svg>
        Specifications
      </h4>
      <div class="detail-specs">
        ${d.specs.map(s => `
          <div class="detail-spec-row">
            <span class="detail-spec-label">${s.label}</span>
            <span class="detail-spec-value">${s.value}</span>
          </div>
        `).join("")}
      </div>
    </div>

    ${p.coa ? `
    <div class="detail-section">
      <button class="btn btn--ghost btn--full view-coa" data-coa="${p.coa}" data-name="${p.name}">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        View Certificate of Analysis
      </button>
    </div>` : ''}

    <div class="detail-disclaimer">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
      For research purposes only. Not intended for human consumption. Always consult a licensed healthcare professional.
    </div>
  `;

  detailBody.querySelectorAll(".variant-opt").forEach(btn => {
    btn.addEventListener("click", () => {
      selectedVariant[p.id] = btn.dataset.variant;
      refreshDetailPrice(p);
    });
  });
  refreshDetailPrice(p);

  detailModal.classList.add("open");
  detailOverlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeDetail() {
  detailModal.classList.remove("open");
  detailOverlay.classList.remove("active");
  document.body.style.overflow = "";
  detailProduct = null;
}

detailClose.addEventListener("click", closeDetail);
detailOverlay.addEventListener("click", closeDetail);
detailAddBtn.addEventListener("click", () => {
  if (!detailProduct) return;
  addToCart(detailProduct.id, variantOf(detailProduct.id), detailAddBtn);
  closeDetail();
});

/* ---- Hamburger menu ---- */
const hamburger   = document.getElementById("hamburger");
const mobileMenu  = document.getElementById("mobileMenu");

hamburger.addEventListener("click", () => {
  const open = mobileMenu.classList.toggle("open");
  hamburger.classList.toggle("open", open);
  hamburger.setAttribute("aria-expanded", open);
  document.body.style.overflow = open ? "hidden" : "";
});

// Close mobile menu when a link is tapped
document.querySelectorAll(".mobile-link").forEach(link => {
  link.addEventListener("click", () => {
    mobileMenu.classList.remove("open");
    hamburger.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  });
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
    row.className = "inv-row" + (p.stock === 0 ? " inv-row--out" : "");
    row.innerHTML = `
      <div class="inv-row__info">
        <div class="inv-row__icon">${p.icon}</div>
        <div>
          <div class="inv-row__name">
            ${p.name}
            ${p.stock === 0 ? '<span class="inv-out-tag">Out of Stock</span>' : ''}
          </div>
          <div class="inv-row__sub">$${p.price.toFixed(2)} · ${p.unit}</div>
        </div>
      </div>
      <div class="inv-row__controls">
        <button class="qty-btn" data-id="${p.id}" data-delta="-1" ${p.stock === 0 ? 'disabled' : ''}>−</button>
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
      renderInventory();
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
          ${o.items.map(i => `<span>${i.name}${i.variant === 'pen' ? ' (+Pen)' : ''} × ${i.qty}</span>`).join(" · ")}
        </div>
        ${o.shipping != null ? `<div class="order-card__ship">Shipping: ${shippingLabel(o.shippingMethod)} — $${o.shipping.toFixed(2)}</div>` : ""}
        <div class="order-card__total">Total: <strong>$${o.total.toFixed(2)}</strong></div>
        ${o.referral
          ? `<div class="order-card__referral">Referral: <strong>${o.referral}</strong> ${o.referralValid ? '<span class="ref-badge ref-badge--ok">valid</span>' : '<span class="ref-badge ref-badge--bad">unrecognized</span>'}</div>`
          : ""}
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

/* =========================================================
   COA Lightbox
   ========================================================= */
const coaOverlay  = document.getElementById("coaOverlay");
const coaLightbox = document.getElementById("coaLightbox");
const coaImg      = document.getElementById("coaImg");
const coaFallback = document.getElementById("coaFallback");
const coaTitle    = document.getElementById("coaTitle");
const coaOpen     = document.getElementById("coaOpen");
const coaClose    = document.getElementById("coaClose");

function openCoa(src, name) {
  coaTitle.textContent = `Certificate of Analysis${name ? " — " + name : ""}`;
  coaFallback.style.display = "none";
  coaImg.style.display = "block";
  coaImg.src = src;
  coaOpen.href = src;
  coaLightbox.classList.add("open");
  coaOverlay.classList.add("active");
  document.body.style.overflow = "hidden";
}
function closeCoa() {
  coaLightbox.classList.remove("open");
  coaOverlay.classList.remove("active");
  // keep scroll locked if a product detail modal is still open behind it
  document.body.style.overflow = detailModal.classList.contains("open") ? "hidden" : "";
}
if (coaImg) {
  coaImg.addEventListener("error", () => {
    coaImg.style.display = "none";
    coaFallback.style.display = "block";
  });
}
if (coaClose)   coaClose.addEventListener("click", closeCoa);
if (coaOverlay) coaOverlay.addEventListener("click", closeCoa);

// Delegated: any "View COA" button (cards + detail modal)
document.addEventListener("click", e => {
  const btn = e.target.closest(".view-coa");
  if (!btn) return;
  e.preventDefault();
  openCoa(btn.dataset.coa, btn.dataset.name);
});

/* =========================================================
   Legal Modal (Terms / Privacy / Research Disclaimer)
   ========================================================= */
const LEGAL_DOCS = {
  terms: {
    title: "Terms &amp; Conditions",
    html: `
      <p class="legal-updated">Last updated: July 2026</p>
      <p>These Terms &amp; Conditions ("Terms") govern your access to and use of the Bella Vita Labs LLC website and your purchase of products offered on it. By accessing this site or placing an order, you agree to be bound by these Terms. If you do not agree, do not use this site.</p>

      <h4>1. Research Use Only</h4>
      <p>All products sold by Bella Vita Labs LLC are intended <strong>strictly for in-vitro laboratory and research purposes only</strong>. They are <strong>not</strong> intended for human or veterinary use, consumption, ingestion, injection, or any form of clinical, diagnostic, therapeutic, or cosmetic application. Products are not drugs, foods, dietary supplements, or medical devices, and no statements on this site have been evaluated by the U.S. Food and Drug Administration (FDA).</p>

      <h4>2. Eligibility</h4>
      <p>You must be at least 18 years of age (or the age of majority in your jurisdiction, whichever is greater) to use this site or place an order. By ordering, you represent that you are of legal age and are a qualified professional or researcher acquiring products for lawful research use.</p>

      <h4>3. Products &amp; Availability</h4>
      <p>We make reasonable efforts to describe products accurately, including purity, quantity, and specifications shown in each product's Certificate of Analysis (COA). Product descriptions are provided for informational purposes and may be updated at any time. All products are subject to availability, and we reserve the right to limit quantities or discontinue any product without notice.</p>

      <h4>4. Pricing &amp; Payment</h4>
      <p>All prices are listed in U.S. dollars. We currently accept payment via Cash App only. At checkout you will be shown a cashtag and the exact amount to send. Your order is not confirmed until we receive and verify your payment. Please include your name and order email in the Cash App payment note so we can match your payment to your order. We reserve the right to correct pricing errors and to refuse or cancel any order.</p>

      <h4>5. Shipping</h4>
      <p>We currently ship within the United States only. Orders ship within 1–2 business days after payment is confirmed. Products are shipped with cold-pack insulation in plain, unmarked packaging. Title and risk of loss pass to you upon our delivery of the package to the carrier. We are not responsible for carrier delays.</p>

      <h4>6. All Sales Final</h4>
      <p>Because our products are sensitive to temperature and handling, <strong>all sales are final. We do not accept returns or issue refunds.</strong> If your order arrives damaged or does not match its accompanying COA, contact us promptly and we will work with you to make it right.</p>

      <h4>7. Assumption of Risk &amp; Buyer Responsibility</h4>
      <p>You assume all responsibility and risk for the proper, safe, and lawful handling, storage, use, and disposal of any product purchased. You agree that you have the training and facilities to handle research materials and that you will comply with all applicable federal, state, and local laws and regulations. You agree that you will not use, resell, or represent any product for human or animal consumption.</p>

      <h4>8. Limitation of Liability</h4>
      <p>To the fullest extent permitted by law, Bella Vita Labs LLC and its owners, employees, and affiliates shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising out of your access to, use of, or inability to use the products or this site. Products are provided "as is" without warranties of any kind, express or implied, except as to the purity and specifications stated in the applicable COA. Our total liability for any claim shall not exceed the amount you paid for the product giving rise to the claim.</p>

      <h4>9. Indemnification</h4>
      <p>You agree to indemnify and hold harmless Bella Vita Labs LLC from any claims, damages, losses, or expenses (including reasonable attorneys' fees) arising from your misuse of any product, your violation of these Terms, or your violation of any law or the rights of any third party.</p>

      <h4>10. Intellectual Property</h4>
      <p>All content on this site — including text, graphics, logos, and the Bella Vita Labs name and branding — is the property of Bella Vita Labs LLC and is protected by applicable intellectual property laws. You may not reproduce or use it without our prior written permission.</p>

      <h4>11. Governing Law</h4>
      <p>These Terms are governed by the laws of the State of Florida, without regard to its conflict-of-laws principles. Any dispute shall be resolved in the state or federal courts located in Florida.</p>

      <h4>12. Changes to These Terms</h4>
      <p>We may update these Terms at any time. Changes are effective when posted to this page. Your continued use of the site after changes are posted constitutes acceptance of the revised Terms.</p>

      <h4>13. Contact</h4>
      <p>Questions about these Terms? Contact us at <strong>frankied1974@gmail.com</strong> or through the contact form on this site.</p>
    `,
  },
  privacy: {
    title: "Privacy Policy",
    html: `
      <p class="legal-updated">Last updated: July 2026</p>
      <p>This Privacy Policy explains how Bella Vita Labs LLC collects, uses, and protects information when you use our website and place an order.</p>

      <h4>1. Information We Collect</h4>
      <p>When you place an order or contact us, we collect the information you provide, which may include your name, email address, phone number, shipping address, and order details. We do not collect or store credit-card or bank information.</p>

      <h4>2. How We Use Your Information</h4>
      <p>We use your information solely to process and ship your order, verify your Cash App payment, communicate with you about your order, respond to inquiries, and comply with legal obligations.</p>

      <h4>3. Payment Information</h4>
      <p>Payments are made through Cash App. Your payment is handled by Cash App under its own terms and privacy policy. We only see the information necessary to match your payment to your order (such as the name and note you include).</p>

      <h4>4. Information Stored in Your Browser</h4>
      <p>To make the site work, we store certain information locally in your own browser (for example, your shopping cart, inventory data, and your age-verification acknowledgment). This information stays on your device and is not transmitted to us except when you submit an order.</p>

      <h4>5. How We Share Information</h4>
      <p>We do <strong>not</strong> sell, rent, or trade your personal information. We share it only as necessary with shipping carriers to deliver your order, or when required by law.</p>

      <h4>6. Data Retention</h4>
      <p>We retain order information only as long as necessary to fulfill orders, provide support, and meet legal or recordkeeping requirements.</p>

      <h4>7. Security</h4>
      <p>We take reasonable measures to protect the information you provide. However, no method of transmission or storage is completely secure, and we cannot guarantee absolute security.</p>

      <h4>8. Children's Privacy</h4>
      <p>This site is not directed to anyone under 18, and we do not knowingly collect information from minors.</p>

      <h4>9. Your Choices</h4>
      <p>You may request that we correct or delete the personal information associated with your order by contacting us. You can also clear locally stored data by clearing your browser storage.</p>

      <h4>10. Changes to This Policy</h4>
      <p>We may update this Privacy Policy from time to time. Changes are effective when posted to this page.</p>

      <h4>11. Contact</h4>
      <p>Questions about your privacy? Contact us at <strong>frankied1974@gmail.com</strong> or through the contact form on this site.</p>
    `,
  },
  disclaimer: {
    title: "Research Disclaimer",
    html: `
      <p class="legal-updated">Last updated: July 2026</p>
      <p>Please read this disclaimer carefully before purchasing or using any product from Bella Vita Labs LLC.</p>

      <h4>For Laboratory &amp; Research Use Only</h4>
      <p>All products offered by Bella Vita Labs LLC are sold <strong>strictly for in-vitro laboratory and research purposes only</strong>. They are intended for use by qualified professionals and researchers.</p>

      <h4>Not for Human or Animal Use</h4>
      <p>Our products are <strong>not for human or veterinary use</strong> and are <strong>not intended for consumption, ingestion, injection, inhalation, or any in-vivo application</strong> in humans or animals. They are not to be used as a drug, food, dietary supplement, cosmetic, or medical device.</p>

      <h4>No FDA Evaluation; No Medical Claims</h4>
      <p>None of the statements on this site have been evaluated by the U.S. Food and Drug Administration. No product is intended to diagnose, treat, cure, or prevent any disease or condition. Nothing on this site constitutes medical advice.</p>

      <h4>Buyer Responsibility</h4>
      <p>By purchasing, you confirm that you are at least 18 years of age, that you are acquiring products for lawful research use only, and that you have the knowledge, training, and facilities to handle, store, and dispose of research materials safely. You assume all responsibility and liability for the proper and lawful use of any product purchased, and you agree to comply with all applicable laws and regulations.</p>

      <h4>Consult a Professional</h4>
      <p>Always consult a licensed healthcare professional before making any decisions related to health. Bella Vita Labs LLC accepts no liability for any misuse of its products.</p>
    `,
  },
};

const legalOverlay = document.getElementById("legalOverlay");
const legalModal   = document.getElementById("legalModal");
const legalTitle   = document.getElementById("legalTitle");
const legalBody    = document.getElementById("legalBody");
const legalClose   = document.getElementById("legalClose");

function openLegal(key) {
  const doc = LEGAL_DOCS[key];
  if (!doc) return;
  legalTitle.innerHTML = doc.title;
  legalBody.innerHTML = doc.html;
  legalBody.scrollTop = 0;
  legalModal.classList.add("open");
  legalOverlay.classList.add("active");
  document.body.style.overflow = "hidden";
}
function closeLegal() {
  legalModal.classList.remove("open");
  legalOverlay.classList.remove("active");
  document.body.style.overflow = "";
}
if (legalClose)   legalClose.addEventListener("click", closeLegal);
if (legalOverlay) legalOverlay.addEventListener("click", closeLegal);

document.querySelectorAll(".legal-link").forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    openLegal(link.dataset.legal);
  });
});

/* =========================================================
   Age Gate (18+)
   ========================================================= */
const ageGate = document.getElementById("ageGate");
if (ageGate) {
  if (localStorage.getItem("bellavita_age_ok") === "yes") {
    ageGate.classList.add("age-gate--hidden");
  } else {
    document.body.style.overflow = "hidden";
  }
  document.getElementById("ageYes").addEventListener("click", () => {
    localStorage.setItem("bellavita_age_ok", "yes");
    ageGate.classList.add("age-gate--hidden");
    document.body.style.overflow = "";
  });
  document.getElementById("ageNo").addEventListener("click", () => {
    window.location.href = "https://www.google.com";
  });
}

/* ---- Init ---- */
renderProducts();
renderFAQ();
updateCartUI();
