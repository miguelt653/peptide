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
// Accepted referral/discount codes (case-insensitive). discountRate applies to
// the customer's subtotal; commissionRate (if any) is paid to the referrer on
// the pre-discount subtotal + shipping. Codes with commissionRate 0 are
// plain discount codes with no referrer payout.
const REFERRAL_CODES = {
  VAL:   { discountRate: 0.10, commissionRate: 0.30 },
  VINCE: { discountRate: 0.10, commissionRate: 0.20 },
  NEW:   { discountRate: 0.10, commissionRate: 0 },
  LOYAL: { discountRate: 0.10, commissionRate: 0 },
};
const OWNER_WEBHOOK_URL = "";            // e.g. "https://hooks.zapier.com/hooks/catch/123456/abcdef/"
const USE_EMAILJS       = true;
const EMAILJS_CONFIG    = {
  publicKey:  "xeF7Iw22TB4Gwhic2",
  serviceId:  "service_7ho1uxb",
  templateId: "template_peeq45r",   // owner "new order" notification
  shippedTemplateId: "template_9p4zomn", // customer "order shipped" email
};

// Initialize EmailJS once, if enabled and the SDK loaded
if (USE_EMAILJS && window.emailjs && EMAILJS_CONFIG.publicKey && EMAILJS_CONFIG.publicKey !== "YOUR_PUBLIC_KEY") {
  try { window.emailjs.init({ publicKey: EMAILJS_CONFIG.publicKey }); }
  catch (e) { console.warn("EmailJS init failed:", e); }
}

/* ---- Supabase (central order database + admin auth) ---- */
const SUPABASE_URL      = "https://uggxcupkjevlvbptbrmk.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVnZ3hjdXBramV2bHZicHRicm1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUyNDc0NzcsImV4cCI6MjEwMDgyMzQ3N30.eY0W4t1h_ks5W8o7AIqPWiq-JQNjVBCn6yWArskHjL0";
let sb = null;
if (window.supabase && SUPABASE_URL && SUPABASE_ANON_KEY) {
  try { sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY); }
  catch (e) { console.warn("Supabase init failed:", e); }
}
function orderToRow(order) {
  return {
    id: order.id,
    status: order.status,
    first_name: order.customer.firstName,
    last_name: order.customer.lastName,
    email: order.customer.email,
    phone: order.customer.phone,
    address: order.customer.address,
    city: order.customer.city,
    state: order.customer.state,
    zip: order.customer.zip,
    items: order.items,
    shipping_method: order.shippingMethod,
    shipping: order.shipping,
    total: order.total,
    referral: order.referral,
    referral_valid: order.referralValid,
    commission: order.commission,
  };
}
async function saveOrderToCloud(order) {
  if (!sb) return false;
  try {
    const { error } = await sb.from("orders").insert(orderToRow(order));
    if (error) { console.warn("Supabase order insert failed:", error.message); return false; }
    return true;
  } catch (e) { console.warn("Supabase order insert error:", e); return false; }
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
    price: 175,
    penPrice: 250,
    unit: "20mg vial",
    purity: "≥99%",
    desc: "A next-generation triple receptor agonist (GLP-1, GIP, and glucagon) being actively studied for metabolic regulation, body composition, and energy balance.",
    meta: ["20mg / vial", "≥99% Purity", "Lyophilized", "COA Included"],
    stock: 15,
    detail: {
      overview: "Retatrutide is a first-in-class triple receptor agonist targeting GIP, GLP-1, and glucagon receptors simultaneously. It has been the subject of research examining multi-pathway metabolic receptor activation, with studies investigating its broad metabolic signaling interactions.",
      benefits: [
        "Studied as a triple-receptor metabolic agonist",
        "Investigated for multi-pathway metabolic receptor activation",
        "Researched for energy expenditure pathway modulation",
        "Explored in glycemic signaling research models",
      ],
      mechanism: "Targets three distinct receptor pathways simultaneously: GLP-1 (glucagon-like peptide-1), GIP (glucose-dependent insulinotropic polypeptide), and glucagon. GLP-1 and GIP reduce appetite, slow gastric emptying, and stimulate glucose-dependent insulin secretion, while glucagon activation increases energy expenditure (calorie burning) and promotes the breakdown of stored fat.",
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
    price: 100,
    unit: "500mg vial",
    purity: "≥99%",
    desc: "A critical coenzyme present in every living cell, studied extensively for cellular energy production, mitochondrial function, DNA repair, and longevity pathways.",
    meta: ["500mg / vial", "≥99% Purity", "Lyophilized", "COA Included"],
    stock: 22,
    detail: {
      overview: "NAD+ delivers pharmaceutical-grade nicotinamide adenine dinucleotide at a 500mg research dose. NAD+ is a master coenzyme involved in every major metabolic pathway and is studied for its role in cellular signaling, declining in availability with age and metabolic stress.",
      benefits: [
        "Investigated in cellular energy signaling and NAD+ pathway research",
        "Studied for sirtuin and longevity pathway activation mechanisms",
        "Researched for cognitive signaling and neurological pathway interactions",
        "Explored for DNA repair signaling and neuroprotective pathways",
      ],
      mechanism: "Investigated for its role in directly replenishing intracellular NAD+ levels, studied for electron transport chain signaling, sirtuin longevity enzyme (SIRT1-7) activation pathways, and PARP-mediated DNA damage response research — explored for foundational cellular signaling restoration.",
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
    price: 100,
    penPrice: 125,
    unit: "50mg vial",
    purity: "≥99%",
    desc: "A naturally occurring copper complex found in human plasma, studied for collagen synthesis stimulation, wound healing, antioxidant activity, and tissue remodeling.",
    meta: ["50mg / vial", "≥99% Purity", "Lyophilized", "COA Included"],
    stock: 30,
    detail: {
      overview: "GHK-Cu (Copper peptide GHK) is a naturally occurring copper-binding peptide found in human plasma, studied for its role as a multi-functional signaling molecule. Research investigates its interactions with over 4,000 human genes involved in tissue remodeling and cellular signaling.",
      benefits: [
        "Investigated in broad tissue regeneration signaling research",
        "Studied for collagen and elastin synthesis pathway modulation",
        "Researched for anti-inflammatory and antioxidant signaling mechanisms",
        "Explored for follicular signaling and growth pathway interactions",
      ],
      mechanism: "Investigated for its role in attracting immune cells to tissue sites, studied for collagen, elastin, and glycosaminoglycan synthesis signaling, metalloproteinase activation for tissue remodeling research, and antioxidant and anti-inflammatory signaling through copper chelation pathways.",
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
    price: 100,
    penPrice: 125,
    unit: "10mg blend vial",
    purity: "≥99%",
    desc: "A complete recovery blend pairing BPC-157 (5mg) with TB-500 (5mg) — two of the most studied healing peptides — for comprehensive soft-tissue, tendon, and ligament recovery research.",
    meta: ["BPC-157 5mg", "TB-500 5mg", "≥99% Purity", "COA Included"],
    stock: 15,
    detail: {
      overview: "BPC-157 and TB-500 combined in one vial — two peptides studied for their complementary roles in tissue-response and repair signaling pathway research. One vial, two peptides, investigated together for their complementary roles in local and systemic tissue-response signaling pathway research — studied for their distinct but synergistic receptor mechanisms.",
      benefits: [
        "Angiogenesis and tissue-response signaling pathway research",
        "Connective tissue signaling and inflammatory pathway modulation research",
        "Multi-pathway tissue repair and cellular regeneration signaling research",
      ],
      mechanism: "Investigated together for the complementary roles of its two peptides. BPC-157 is researched for its role in tissue repair and wound healing through localized angiogenesis and tissue-response signaling, while TB-500 is researched for its role in inflammation and systemic tissue recovery — studied for distinct but synergistic receptor mechanisms.",
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
      overview: "Melanotan II is a cyclic synthetic analog of alpha-melanocyte-stimulating hormone (α-MSH). Research investigates its activation of melanocortin receptors throughout the body, with studies examining pigmentation pathway signaling, appetite-related signaling, and neuroendocrine receptor interactions.",
      benefits: [
        "Investigated in melanocortin receptor-mediated pigmentation signaling research",
        "Studied for MC3R and MC4R receptor activation mechanisms",
        "Researched for appetite-related pathway modulation",
        "Explored for metabolic signaling interactions",
      ],
      mechanism: "Investigated for its non-selective agonism of MC1R (melanin signaling), MC3R (metabolic/appetite signaling), and MC4R (neuroendocrine signaling) receptors — studied for concurrent effects across pigmentation, metabolic, and neuroendocrine signaling systems.",
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
const orderIssue       = document.getElementById("orderIssue");
const orderIssueId     = document.getElementById("orderIssueId");
const orderIssueRetry  = document.getElementById("orderIssueRetry");
const orderIssueClose  = document.getElementById("orderIssueClose");
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

  if (activeCategory === "all") {
    const inquiryCard = document.createElement("div");
    inquiryCard.className = "product-card product-card--inquiry";
    inquiryCard.style.animationDelay = `${filtered.length * 0.05}s`;
    inquiryCard.innerHTML = `
      <div class="product-card__inquiry-body">
        <div class="product-card__inquiry-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </div>
        <div class="product-card__name">Other Peptides Available</div>
        <p class="product-card__desc">Looking for something not listed here? Reach out and we'll do our best to source it upon request.</p>
        <a href="#contact" class="btn btn--outline btn--sm product-card__inquiry-cta">Contact Us</a>
      </div>
    `;
    productGrid.appendChild(inquiryCard);
  }

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
  updateLocalShipWarning();
  checkoutModal.classList.add("open");
  modalOverlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

// Shipping method selection updates totals live
document.querySelectorAll('input[name="shipMethod"]').forEach(radio => {
  radio.addEventListener("change", () => {
    shippingMethod = radio.value;
    buildOrderSummary();
    updateLocalShipWarning();
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

/* ---- Local delivery eligibility (Tampa / St. Petersburg / Clearwater only) ---- */
const LOCAL_DELIVERY_KEYWORDS = ["tampa", "clearwater", "st petersburg", "saint petersburg", "st pete"];
function isLocalDeliveryEligible(city) {
  const c = (city || "").trim().toLowerCase().replace(/\./g, "").replace(/\s+/g, " ");
  if (!c) return true; // don't warn before a city has been entered
  return LOCAL_DELIVERY_KEYWORDS.some(k => c.includes(k));
}
const cityInput = document.querySelector('input[name="city"]');
const localShipWarning = document.getElementById("localShipWarning");
function updateLocalShipWarning() {
  if (!localShipWarning || !cityInput) return;
  localShipWarning.style.display = (shippingMethod === "local" && !isLocalDeliveryEligible(cityInput.value)) ? "block" : "none";
}
if (cityInput) cityInput.addEventListener("input", updateLocalShipWarning);
function activeReferralValid() {
  return referralInput ? isValidReferral(referralInput.value) : false;
}
function getOrderTotal() {
  const sub = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const ship = SHIPPING_RATES[shippingMethod] ?? SHIPPING_RATES.standard;
  const referralCode = referralInput ? normalizeReferral(referralInput.value) : "";
  const referralConfig = getReferralConfig(referralCode);
  const discount = referralConfig ? +(sub * referralConfig.discountRate).toFixed(2) : 0;
  const total = sub - discount + ship;
  return { sub, ship, discount, total, referralCode, referralConfig };
}

function buildOrderSummary() {
  const { sub, ship, discount, total, referralCode, referralConfig } = getOrderTotal();
  orderSummary.innerHTML = `
    <h4>Order Summary</h4>
    ${cart.map(i => `
      <div class="order-line">
        <span>${i.icon} ${i.name}${i.variant === 'pen' ? ' (+ Pen)' : ''} × ${i.qty}</span>
        <span>$${(i.price * i.qty).toFixed(2)}</span>
      </div>
    `).join("")}
    ${discount > 0 ? `
    <div class="order-line"><span>Subtotal</span><span>$${sub.toFixed(2)}</span></div>
    <div class="order-line order-line--discount"><span>${referralCode} discount (${Math.round(referralConfig.discountRate * 100)}%)</span><span>−$${discount.toFixed(2)}</span></div>` : ""}
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
function getReferralConfig(code) {
  return REFERRAL_CODES[normalizeReferral(code)] || null;
}
function isValidReferral(code) {
  return !!getReferralConfig(code);
}

const referralInput    = document.getElementById("referralInput");
const referralFeedback = document.getElementById("referralFeedback");

function updateReferralFeedback() {
  if (!referralInput || !referralFeedback) return;
  const code = normalizeReferral(referralInput.value);
  const config = getReferralConfig(code);
  if (!code) {
    referralFeedback.textContent = "";
    referralFeedback.className = "referral-feedback";
  } else if (config) {
    referralFeedback.textContent = `✓ Code ${code} applied — ${Math.round(config.discountRate * 100)}% off`;
    referralFeedback.className = "referral-feedback referral-feedback--ok";
  } else {
    referralFeedback.textContent = "Code not recognized";
    referralFeedback.className = "referral-feedback referral-feedback--err";
  }
  // Recalculate totals live if the checkout is open (discount may have changed)
  if (checkoutModal.classList.contains("open")) buildOrderSummary();
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

/* ---- Customer "order shipped" email ---- */
async function sendShippedEmail(o) {
  if (!(USE_EMAILJS && window.emailjs && EMAILJS_CONFIG.shippedTemplateId && o && o.email)) return;
  const items = Array.isArray(o.items)
    ? o.items.map(i => `${i.name}${i.variant === 'pen' ? ' (+Pen)' : ''} x${i.qty}`).join(", ")
    : "";
  try {
    await window.emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.shippedTemplateId, {
      to_email: o.email,
      customer_name: `${o.first_name || ""} ${o.last_name || ""}`.trim(),
      order_id: o.id,
      items,
      total: `$${Number(o.total).toFixed(2)}`,
      tracking: o.tracking ? o.tracking : "Tracking info will follow shortly.",
    });
  } catch (e) { console.warn("Shipped email failed:", e); }
}

/* ---- Owner SMS / Email Notification ---- */
function buildOrderMessage(order) {
  const itemsLine = order.items.map(i => `${i.name}${i.variant === 'pen' ? ' (+Pen)' : ''} x${i.qty}`).join(", ");
  const lines = [
    `🛒 New Bella Vita Labs Order ${order.id}`,
    `${order.customer.firstName} ${order.customer.lastName}`,
    `${order.customer.email} · ${order.customer.phone || "no phone"}`,
    `${order.customer.address}, ${order.customer.city}, ${order.customer.state} ${order.customer.zip}`,
    `Items: ${itemsLine}`,
    ...(order.discount ? [`Discount: ${order.referral} ${Math.round((getReferralConfig(order.referral)?.discountRate || 0) * 100)}% — −$${order.discount.toFixed(2)}`] : []),
    `Shipping: ${shippingLabel(order.shippingMethod)} — $${(order.shipping ?? 0).toFixed(2)}`,
    `Total: $${order.total.toFixed(2)} via Cash App (${CASHAPP_HANDLE})`,
    order.referral ? `Referral: ${order.referral}${order.referralValid ? " ✓ VALID" : " (unrecognized)"}` : "Referral: none",
  ];
  if (order.referralValid && order.commission) {
    lines.push(`⭐ ${order.referral} COMMISSION OWED: $${order.commission.toFixed(2)} (${Math.round((getReferralConfig(order.referral)?.commissionRate || 0) * 100)}%)`);
  }
  return lines.join("\n");
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
          commission: order.referralValid && order.commission
            ? `$${order.commission.toFixed(2)} owed to ${order.referral} (${Math.round((getReferralConfig(order.referral)?.commissionRate || 0) * 100)}%)`
            : "none",
        }
      );
    } catch (err) {
      console.warn("EmailJS notification failed:", err);
    }
  }
}

/* ---- Checkout Submit ---- */
let pendingOrder = null;

// Attempts the cloud save. On success: notifies the owner and shows the
// success screen. On failure: shows the error panel with a Retry option
// instead of silently pretending the order went through.
async function attemptSaveOrder(order) {
  const saved = await saveOrderToCloud(order);
  if (saved) {
    notifyOwner(order);
    orderIssue.style.display = "none";
    checkoutForm.style.display = "none";
    orderSuccess.style.display = "flex";
    pendingOrder = null;
    cart = [];
    updateCartUI();
    renderProducts();
  } else {
    orderSuccess.style.display = "none";
    checkoutForm.style.display = "none";
    orderIssueId.textContent = order.id;
    orderIssue.style.display = "flex";
  }
  return saved;
}

checkoutForm.addEventListener("submit", async e => {
  e.preventDefault();
  const formData = new FormData(checkoutForm);
  if (shippingMethod === "local" && !isLocalDeliveryEligible(formData.get("city"))) {
    updateLocalShipWarning();
    if (localShipWarning) localShipWarning.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }
  const { sub, ship, discount, total, referralConfig } = getOrderTotal();
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
    discount,
    total,
    referral: normalizeReferral(formData.get("referral")) || null,
    referralValid: isValidReferral(formData.get("referral")),
  };
  // Referral commission (if the code has one): rate applies to the pre-discount subtotal + shipping
  order.commission = referralConfig ? +((sub + ship) * referralConfig.commissionRate).toFixed(2) : 0;
  // Decrement stock
  cart.forEach(item => {
    const p = PRODUCTS.find(x => x.id === item.id);
    if (p) p.stock = Math.max(0, p.stock - item.qty);
  });
  saveProducts();
  // Save order locally as a backup regardless of cloud outcome
  const orders = loadOrders();
  orders.unshift(order);
  saveOrders(orders);

  pendingOrder = order;
  const submitBtn = checkoutForm.querySelector('button[type="submit"]');
  if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = "Submitting…"; }
  await attemptSaveOrder(order);
  if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = "I've Sent the Payment →"; }
});

successClose.addEventListener("click", () => {
  closeCheckout();
  checkoutForm.style.display = "flex";
  orderSuccess.style.display = "none";
  checkoutForm.reset();
  updateReferralFeedback();
});

orderIssueRetry.addEventListener("click", async () => {
  if (!pendingOrder) return;
  orderIssueRetry.disabled = true;
  orderIssueRetry.textContent = "Retrying…";
  await attemptSaveOrder(pendingOrder);
  orderIssueRetry.disabled = false;
  orderIssueRetry.textContent = "Try Again";
});

orderIssueClose.addEventListener("click", () => {
  closeCheckout();
  orderIssue.style.display = "none";
  checkoutForm.style.display = "flex";
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
        Research Focus Areas
      </h4>
      <ul class="detail-benefits">
        ${d.benefits.map(b => `<li>${b}</li>`).join("")}
      </ul>
    </div>

    <div class="detail-section">
      <h4 class="detail-section-title">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        Mechanism of Action
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
const adminEmailInput    = document.getElementById("adminEmailInput");
const adminPasswordInput = document.getElementById("adminPasswordInput");
const adminLogout    = document.getElementById("adminLogout");
const adminError     = document.getElementById("adminError");
const ordersList     = document.getElementById("ordersList");
const orderSearchInput = document.getElementById("orderSearchInput");
const selectAllOrders  = document.getElementById("selectAllOrders");
const bulkBar          = document.getElementById("bulkBar");
const bulkCount        = document.getElementById("bulkCount");
const bulkMarkPaidBtn  = document.getElementById("bulkMarkPaid");
const bulkDeleteBtn    = document.getElementById("bulkDelete");
const bulkClearBtn     = document.getElementById("bulkClear");

let adminUnlocked = false;

let orderFilter = "all";
let ordersCache = [];
let orderSearch = "";
let selectedOrderIds = new Set();
let lastRenderedOrderIds = [];

function showAdminDashboard() {
  adminUnlocked = true;
  adminLogin.style.display = "none";
  adminDashboard.style.display = "block";
  orderFilter = "all";
  orderSearch = "";
  if (orderSearchInput) orderSearchInput.value = "";
  selectedOrderIds.clear();
  document.querySelectorAll(".admin-tab").forEach(t => t.classList.toggle("admin-tab--active", t.dataset.filter === "all"));
  renderOrders();
}
function showAdminLogin() {
  adminUnlocked = false;
  adminLogin.style.display = "block";
  adminDashboard.style.display = "none";
  setTimeout(() => adminEmailInput && adminEmailInput.focus(), 100);
}
async function openAdmin() {
  adminModal.classList.add("open");
  adminOverlay.classList.add("active");
  document.body.style.overflow = "hidden";
  // Show a logged-in session immediately if one exists
  if (sb) {
    try {
      const { data } = await sb.auth.getSession();
      if (data && data.session) { showAdminDashboard(); return; }
    } catch (e) { /* fall through to login */ }
  }
  showAdminLogin();
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

adminLoginForm.addEventListener("submit", async e => {
  e.preventDefault();
  adminError.style.display = "none";
  if (!sb) {
    adminError.textContent = "Cloud connection unavailable. Try again in a moment.";
    adminError.style.display = "block";
    return;
  }
  const submitBtn = adminLoginForm.querySelector("button[type=submit]");
  if (submitBtn) submitBtn.disabled = true;
  try {
    const { error } = await sb.auth.signInWithPassword({
      email: adminEmailInput.value.trim(),
      password: adminPasswordInput.value,
    });
    if (error) {
      adminError.textContent = "Incorrect email or password.";
      adminError.style.display = "block";
      adminPasswordInput.value = "";
    } else {
      adminPasswordInput.value = "";
      showAdminDashboard();
    }
  } catch (err) {
    adminError.textContent = "Sign-in failed. Check your connection.";
    adminError.style.display = "block";
  } finally {
    if (submitBtn) submitBtn.disabled = false;
  }
});

if (adminLogout) {
  adminLogout.addEventListener("click", async () => {
    if (sb) { try { await sb.auth.signOut(); } catch (e) {} }
    showAdminLogin();
  });
}

/* Tabs — filter the order list (no refetch, just re-render from cache) */
document.querySelectorAll(".admin-tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".admin-tab").forEach(t => t.classList.remove("admin-tab--active"));
    tab.classList.add("admin-tab--active");
    orderFilter = tab.dataset.filter;
    selectedOrderIds.clear();
    renderOrdersList();
  });
});

/* Search — filters the visible list client-side, no refetch */
if (orderSearchInput) {
  orderSearchInput.addEventListener("input", () => {
    orderSearch = orderSearchInput.value.trim();
    renderOrdersList();
  });
}

/* Select all currently-visible (tab + search filtered) orders */
if (selectAllOrders) {
  selectAllOrders.addEventListener("change", () => {
    if (selectAllOrders.checked) lastRenderedOrderIds.forEach(id => selectedOrderIds.add(id));
    else lastRenderedOrderIds.forEach(id => selectedOrderIds.delete(id));
    renderOrdersList();
  });
}

function toggleOrderSelection(id, checked) {
  if (checked) selectedOrderIds.add(id);
  else selectedOrderIds.delete(id);
  const card = ordersList.querySelector(`.order-card[data-order-id="${CSS.escape(id)}"]`);
  if (card) card.classList.toggle("order-card--selected", checked);
  syncBulkUI();
}

function syncBulkUI() {
  const count = selectedOrderIds.size;
  if (bulkBar) bulkBar.style.display = count > 0 ? "flex" : "none";
  if (bulkCount) bulkCount.textContent = `${count} selected`;
  if (bulkMarkPaidBtn) {
    const eligible = ordersCache.filter(o => selectedOrderIds.has(o.id) && o.status === "awaiting_payment").length;
    bulkMarkPaidBtn.textContent = eligible > 0 ? `Mark ${eligible} Paid` : "Mark Paid";
    bulkMarkPaidBtn.disabled = eligible === 0;
  }
  if (selectAllOrders) {
    const visible = lastRenderedOrderIds;
    const allSelected = visible.length > 0 && visible.every(id => selectedOrderIds.has(id));
    selectAllOrders.checked = allSelected;
    selectAllOrders.indeterminate = !allSelected && visible.some(id => selectedOrderIds.has(id));
  }
}

if (bulkClearBtn) {
  bulkClearBtn.addEventListener("click", () => {
    selectedOrderIds.clear();
    renderOrdersList();
  });
}

if (bulkMarkPaidBtn) {
  bulkMarkPaidBtn.addEventListener("click", async () => {
    const ids = ordersCache.filter(o => selectedOrderIds.has(o.id) && o.status === "awaiting_payment").map(o => o.id);
    if (!ids.length || !sb) return;
    bulkMarkPaidBtn.disabled = true;
    try {
      const { error } = await sb.from("orders").update({ status: "paid" }).in("id", ids);
      if (error) throw error;
      selectedOrderIds.clear();
      renderOrders();
    } catch (e) {
      alert("Bulk update failed: " + (e.message || "check your connection."));
      bulkMarkPaidBtn.disabled = false;
    }
  });
}

if (bulkDeleteBtn) {
  bulkDeleteBtn.addEventListener("click", async () => {
    const selected = Array.from(selectedOrderIds);
    // Shipped orders are the permanent sales record — never deletable, even in bulk.
    const ids = selected.filter(id => {
      const o = ordersCache.find(x => x.id === id);
      return o && o.status !== "shipped";
    });
    if (!ids.length || !sb) {
      if (selected.length) alert("Shipped orders can't be deleted — they're kept as your permanent sales record.");
      return;
    }
    const skipped = selected.length - ids.length;
    const skipNote = skipped ? ` (${skipped} shipped order${skipped > 1 ? "s" : ""} will be skipped)` : "";
    if (!confirm(`Delete ${ids.length} selected order${ids.length > 1 ? "s" : ""}?${skipNote} This cannot be undone.`)) return;
    bulkDeleteBtn.disabled = true;
    try {
      const { error } = await sb.from("orders").delete().in("id", ids);
      if (error) throw error;
      selectedOrderIds.clear();
      renderOrders();
    } catch (e) {
      alert("Bulk delete failed: " + (e.message || "check your connection."));
      bulkDeleteBtn.disabled = false;
    }
  });
}

function orderCardHTML(o, selected) {
  const items = Array.isArray(o.items) ? o.items : [];
  const shipped = o.status === "shipped";
  const paid = o.status === "paid" || shipped;
  const statusLabel = shipped ? "Shipped" : (o.status === "paid" ? "Payment Received" : "Awaiting Payment");
  return `
    <div class="order-card order-card--${o.status}${selected ? ' order-card--selected' : ''}" data-order-id="${o.id}">
      <div class="order-card__header">
        <div class="order-card__header-left">
          <input type="checkbox" class="order-select-check" data-id="${o.id}" aria-label="Select order ${o.id}" ${selected ? 'checked' : ''} />
          <div>
            <div class="order-card__id">${o.id}</div>
            <div class="order-card__date">${o.created_at ? new Date(o.created_at).toLocaleString() : ""}</div>
          </div>
        </div>
        <span class="order-status order-status--${o.status}">${statusLabel}</span>
      </div>
      <div class="order-card__body">
        <div><strong>${o.first_name || ""} ${o.last_name || ""}</strong></div>
        <div>${o.email || ""} · ${o.phone || "—"}</div>
        <div>${o.address || ""}, ${o.city || ""}, ${o.state || ""} ${o.zip || ""}</div>
        <div class="order-card__items">
          ${items.map(i => `<span>${i.name}${i.variant === 'pen' ? ' (+Pen)' : ''} × ${i.qty}</span>`).join(" · ")}
        </div>
        ${o.shipping != null ? `<div class="order-card__ship">Shipping: ${shippingLabel(o.shipping_method)} — $${Number(o.shipping).toFixed(2)}</div>` : ""}
        <div class="order-card__total">Total: <strong>$${Number(o.total).toFixed(2)}</strong></div>
        ${o.referral
          ? `<div class="order-card__referral">Referral: <strong>${o.referral}</strong> ${o.referral_valid ? '<span class="ref-badge ref-badge--ok">valid</span>' : '<span class="ref-badge ref-badge--bad">unrecognized</span>'}</div>`
          : ""}
        ${o.referral_valid && o.commission
          ? `<div class="order-card__commission">⭐ ${o.referral} commission: <strong>$${Number(o.commission).toFixed(2)}</strong></div>`
          : ""}
        ${shipped && o.tracking
          ? `<div class="order-card__tracking">📦 Tracking: ${/^https?:\/\//i.test(o.tracking) ? `<a href="${o.tracking}" target="_blank" rel="noopener">${o.tracking}</a>` : o.tracking}</div>`
          : ""}
      </div>
      <div class="order-card__actions">
        <label class="pay-check ${paid ? 'pay-check--done' : ''}">
          <input type="checkbox" data-action="togglepaid" data-id="${o.id}" ${paid ? 'checked' : ''} ${shipped ? 'disabled' : ''} />
          <span>Payment received</span>
        </label>
        ${o.status === "paid" ? `
        <div class="ship-row">
          <input type="text" class="tracking-input" id="track-${o.id}" placeholder="Tracking # or link (optional)" value="${o.tracking || ''}" />
          <button class="btn-mini btn-mini--primary" data-action="shipped" data-id="${o.id}">Mark Shipped</button>
        </div>` : ""}
        ${shipped ? `<span class="shipped-tag">✓ Shipped</span>` : ""}
        ${o.referral_valid && o.commission ? `
        <label class="pay-check payout-check ${o.commission_paid ? 'pay-check--done' : ''}">
          <input type="checkbox" data-action="togglecommission" data-id="${o.id}" ${o.commission_paid ? 'checked' : ''} />
          <span>Paid ${o.referral} $${Number(o.commission).toFixed(2)}</span>
        </label>` : ""}
        ${shipped ? "" : `<button class="btn-mini btn-mini--danger" data-action="delete" data-id="${o.id}">Delete</button>`}
      </div>
    </div>`;
}

/* Fetches orders from the cloud DB, then hands off to the pure renderer below.
   Called on dashboard open and after any action that mutates order data. */
async function renderOrders() {
  if (!sb) {
    ordersList.innerHTML = `<div class="empty-state">Cloud database not connected. Refresh and try again.</div>`;
    return;
  }
  ordersList.innerHTML = `<div class="empty-state">Loading orders…</div>`;
  const { data, error } = await sb
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    ordersList.innerHTML = `<div class="empty-state">Couldn't load orders: ${error.message}</div>`;
    return;
  }
  ordersCache = data || [];
  selectedOrderIds.clear();
  renderOrdersList();
}

function orderMatchesSearch(o, q) {
  if (!q) return true;
  const haystack = [o.id, o.first_name, o.last_name, o.email, o.phone].filter(Boolean).join(" ").toLowerCase();
  return haystack.includes(q.toLowerCase());
}

// Tallies units/revenue per product+variant across confirmed (paid or shipped)
// orders only — awaiting-payment orders may never actually clear, so they'd
// skew "what's actually selling" if counted.
function computeProductSales(orders) {
  const tally = {};
  orders.forEach(o => {
    const items = Array.isArray(o.items) ? o.items : [];
    items.forEach(i => {
      const key = `${i.id}|${i.variant}`;
      if (!tally[key]) {
        const product = PRODUCTS.find(p => p.id === i.id);
        tally[key] = { name: i.name, variant: i.variant, icon: product ? product.icon : "📦", qty: 0, revenue: 0 };
      }
      tally[key].qty += i.qty;
      tally[key].revenue += i.price * i.qty;
    });
  });
  return Object.values(tally).sort((a, b) => b.qty - a.qty);
}

// Groups confirmed orders by customer email so repeat buyers are visible —
// order count, lifetime spend, and every product they've bought (with qty).
// Sorted by order count first (who buys most often), then by spend.
function computeCustomerHistory(orders) {
  const tally = {};
  orders.forEach(o => {
    const email = (o.email || "").trim().toLowerCase();
    if (!email) return;
    if (!tally[email]) {
      tally[email] = {
        email: o.email,
        name: `${o.first_name || ""} ${o.last_name || ""}`.trim() || "(no name)",
        orderCount: 0,
        totalSpent: 0,
        items: {},
        lastOrderAt: o.created_at,
      };
    }
    const c = tally[email];
    c.orderCount += 1;
    c.totalSpent += Number(o.total) || 0;
    if (!c.lastOrderAt || new Date(o.created_at) > new Date(c.lastOrderAt)) {
      c.lastOrderAt = o.created_at;
      c.name = `${o.first_name || ""} ${o.last_name || ""}`.trim() || c.name;
      c.email = o.email || c.email;
    }
    (Array.isArray(o.items) ? o.items : []).forEach(i => {
      const key = `${i.name}${i.variant === "pen" ? " (+Pen)" : ""}`;
      c.items[key] = (c.items[key] || 0) + i.qty;
    });
  });
  return Object.values(tally).sort((a, b) => b.orderCount - a.orderCount || b.totalSpent - a.totalSpent);
}

/* Pure re-render from ordersCache — no network call. Used for tab switches,
   search-as-you-type, and selection changes so those stay instant. */
function renderOrdersList() {
  const all = ordersCache;

  // Stat tiles always reflect the full dataset, unaffected by search
  const pendingAll  = all.filter(o => o.status === "awaiting_payment");
  const receivedAll = all.filter(o => o.status === "paid");
  const shippedAll  = all.filter(o => o.status === "shipped");
  const commissionOrdersAll = all.filter(o => o.referral_valid && Number(o.commission) > 0);
  const custPaidAll = commissionOrdersAll.filter(o => o.status === "paid" || o.status === "shipped");
  const commissionOwedAll = custPaidAll.filter(o => !o.commission_paid).reduce((s, o) => s + (Number(o.commission) || 0), 0);

  const summary = `
    <div class="orders-summary">
      <div class="orders-stat"><span class="orders-stat__num">${all.length}</span><span class="orders-stat__label">All Orders</span></div>
      <div class="orders-stat"><span class="orders-stat__num">${pendingAll.length}</span><span class="orders-stat__label">Pending Payment</span></div>
      <div class="orders-stat"><span class="orders-stat__num">${receivedAll.length}</span><span class="orders-stat__label">To Ship</span></div>
      <div class="orders-stat"><span class="orders-stat__num">${shippedAll.length}</span><span class="orders-stat__label">Shipped</span></div>
      <div class="orders-stat orders-stat--commission"><span class="orders-stat__num">$${commissionOwedAll.toFixed(2)}</span><span class="orders-stat__label">Referral Owed</span></div>
    </div>`;

  // Tab + search filter for the visible card list
  const searched = orderSearch ? all.filter(o => orderMatchesSearch(o, orderSearch)) : all;
  const pending  = searched.filter(o => o.status === "awaiting_payment");
  const received = searched.filter(o => o.status === "paid");
  const shipped  = searched.filter(o => o.status === "shipped");
  // Commission tab only shows codes that actually pay a referrer (commission > 0) —
  // plain discount-only codes (0% commission) don't belong here.
  const commissionOrders = searched.filter(o => o.referral_valid && Number(o.commission) > 0);

  const list = orderFilter === "commission" ? commissionOrders
    : (orderFilter === "products" || orderFilter === "customers") ? []
    : ({ all: searched, awaiting_payment: pending, paid: received, shipped: shipped }[orderFilter] || searched);
  const emptyMsg = orderSearch ? `No orders match "${orderSearch}".` : "No orders in this view.";

  let body;
  if (orderFilter === "customers") {
    // Confirmed orders only — same reasoning as Product Sales, an unpaid
    // order isn't a real purchase to attribute to a customer yet.
    const confirmedSearched = searched.filter(o => o.status === "paid" || o.status === "shipped");
    const customers = computeCustomerHistory(confirmedSearched);
    body = customers.length ? `
      <div class="product-sales-summary">${customers.length} customer${customers.length === 1 ? "" : "s"}${orderSearch ? ` matching "${orderSearch}"` : ""}</div>
      <div class="customer-list">
        ${customers.map(c => `
          <div class="customer-card">
            <div class="customer-card__header">
              <div>
                <div class="customer-card__name">${c.name}</div>
                <div class="customer-card__email">${c.email}</div>
              </div>
              <div class="customer-card__stats">
                <span class="customer-card__count">${c.orderCount} order${c.orderCount === 1 ? "" : "s"}</span>
                <span class="customer-card__spent">$${c.totalSpent.toFixed(2)}</span>
              </div>
            </div>
            <div class="customer-card__items">
              ${Object.entries(c.items).map(([name, qty]) => `<span class="spec-tag">${name} × ${qty}</span>`).join("")}
            </div>
            <div class="customer-card__last">Last order: ${c.lastOrderAt ? new Date(c.lastOrderAt).toLocaleDateString() : "—"}</div>
          </div>
        `).join("")}
      </div>`
      : `<div class="empty-state">No confirmed customers${orderSearch ? ` match "${orderSearch}"` : " yet"}.</div>`;
  } else if (orderFilter === "products") {
    // Confirmed sales only (paid or shipped) — awaiting-payment orders aren't real sales yet.
    // Respects the search box: searching a name/email shows just what that person bought.
    const confirmed = searched.filter(o => o.status === "paid" || o.status === "shipped");
    const sales = computeProductSales(confirmed);
    const totalUnits = sales.reduce((s, x) => s + x.qty, 0);
    const searchNote = orderSearch ? ` matching "${orderSearch}"` : "";
    body = sales.length ? `
      <div class="product-sales-summary">${totalUnits} unit${totalUnits === 1 ? "" : "s"} sold across ${confirmed.length} confirmed order${confirmed.length === 1 ? "" : "s"}${searchNote}</div>
      <div class="product-sales-list">
        ${sales.map((s, i) => `
          <div class="product-sales-row">
            <span class="product-sales-rank">#${i + 1}</span>
            <span class="product-sales-icon">${s.icon}</span>
            <span class="product-sales-name">${s.name}${s.variant === "pen" ? ' <span class="product-sales-variant">+ Pen</span>' : ""}</span>
            <span class="product-sales-qty">${s.qty} sold</span>
            <span class="product-sales-revenue">$${s.revenue.toFixed(2)}</span>
          </div>
        `).join("")}
      </div>`
      : `<div class="empty-state">No confirmed sales${orderSearch ? ` matching "${orderSearch}"` : " yet"}.</div>`;
  } else if (orderFilter === "commission") {
    // A separate tracker per commission-earning referral code (VAL, VINCE, ...) —
    // each is paid out independently, so their totals and order lists never mix.
    const referrerCodes = Object.keys(REFERRAL_CODES).filter(code => REFERRAL_CODES[code].commissionRate > 0);
    body = referrerCodes.map(code => {
      const codeOrders  = commissionOrders.filter(o => o.referral === code);
      const codePaid    = codeOrders.filter(o => o.status === "paid" || o.status === "shipped");
      const codeTotal   = codeOrders.reduce((s, o) => s + (Number(o.commission) || 0), 0);
      const codePaidOut = codePaid.filter(o => o.commission_paid).reduce((s, o) => s + (Number(o.commission) || 0), 0);
      const codeOwed    = codePaid.filter(o => !o.commission_paid).reduce((s, o) => s + (Number(o.commission) || 0), 0);
      const codePending = codeOrders.filter(o => o.status === "awaiting_payment").reduce((s, o) => s + (Number(o.commission) || 0), 0);
      // Orders are collapsed behind a toggle so a referrer with dozens of
      // orders doesn't force scrolling past all of them to reach the next
      // referrer's tracker — the summary panel above is always visible.
      const codeCards = codeOrders.length
        ? `<details class="commission-orders">
            <summary>${codeOrders.length} order${codeOrders.length === 1 ? "" : "s"} <span class="commission-orders__hint">click to view</span></summary>
            <div class="commission-orders__list">${codeOrders.map(o => orderCardHTML(o, selectedOrderIds.has(o.id))).join("")}</div>
          </details>`
        : `<div class="empty-state">No ${code} orders${orderSearch ? ` match "${orderSearch}"` : " yet"}.</div>`;
      return `
        <div class="commission-group">
          <div class="commission-group__title">${code}</div>
          <div class="commission-panel">
            <div class="commission-panel__row commission-panel__row--owed"><span>Owed now — payment received, not yet paid out</span><strong>$${codeOwed.toFixed(2)}</strong></div>
            <div class="commission-panel__row"><span>Already paid out</span><strong>$${codePaidOut.toFixed(2)}</strong></div>
            <div class="commission-panel__row"><span>Pending — awaiting customer payment</span><strong>$${codePending.toFixed(2)}</strong></div>
            <div class="commission-panel__row"><span>Total commission</span><strong>$${codeTotal.toFixed(2)}</strong></div>
          </div>
          ${codeCards}
        </div>`;
    }).join("");
  } else {
    body = list.length
      ? list.map(o => orderCardHTML(o, selectedOrderIds.has(o.id))).join("")
      : `<div class="empty-state">${emptyMsg}</div>`;
  }

  ordersList.innerHTML = summary + body;
  lastRenderedOrderIds = list.map(o => o.id);
  syncBulkUI();

  ordersList.querySelectorAll(".order-select-check").forEach(cb => {
    cb.addEventListener("change", () => toggleOrderSelection(cb.dataset.id, cb.checked));
  });

  ordersList.querySelectorAll("[data-action]").forEach(el => {
    const evt = el.tagName === "INPUT" ? "change" : "click";
    el.addEventListener(evt, async () => {
      const id = el.dataset.id;
      const action = el.dataset.action;
      if (action === "delete" && !confirm("Delete this order? This cannot be undone.")) return;
      el.disabled = true;
      try {
        if (action === "delete") {
          const { error: e1 } = await sb.from("orders").delete().eq("id", id);
          if (e1) throw e1;
        } else if (action === "togglepaid") {
          const newStatus = el.checked ? "paid" : "awaiting_payment";
          const { error: e2 } = await sb.from("orders").update({ status: newStatus }).eq("id", id);
          if (e2) throw e2;
        } else if (action === "togglecommission") {
          const { error: e4 } = await sb.from("orders").update({ commission_paid: el.checked }).eq("id", id);
          if (e4) throw e4;
        } else if (action === "shipped") {
          const ord = all.find(o => o.id === id) || {};
          const trackEl = document.getElementById("track-" + id);
          const tracking = trackEl ? trackEl.value.trim() : "";
          const who = `${ord.first_name || ""} ${ord.last_name || ""}`.trim();
          const addr = `${ord.address || ""}, ${ord.city || ""}, ${ord.state || ""} ${ord.zip || ""}`;
          const ok = confirm(
            `Ship order ${id}?\n\n` +
            `To: ${who}\n${addr}\n${ord.email || ""}\n\n` +
            `Tracking: ${tracking || "(none entered)"}\n\n` +
            `This marks ONLY this order shipped and emails this customer.`
          );
          if (!ok) { el.disabled = false; return; }
          const { error: e3 } = await sb.from("orders").update({ status: "shipped", tracking: tracking || null }).eq("id", id);
          if (e3) throw e3;
          sendShippedEmail({ ...ord, tracking });
        }
        renderOrders();
      } catch (e) {
        alert("Action failed: " + (e.message || "check your connection."));
        el.disabled = false;
      }
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
