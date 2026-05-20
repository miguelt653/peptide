/* =========================================================
   Leanova — App Logic
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
const CASHAPP_HANDLE    = "$Frankie-DiLorenzo"; // change to actual cashtag
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
    detail: {
      overview: "BPC-157 (Body Protection Compound 157) is a synthetic peptide derived from a protective protein found naturally in gastric juice. It consists of 15 amino acids and has been the subject of extensive preclinical research for its remarkable regenerative properties across multiple tissue types.",
      benefits: [
        "Accelerates healing of tendons, ligaments, and muscle tissue",
        "Supports gut lining integrity and gastrointestinal health",
        "Reduces inflammation at injury sites",
        "Promotes angiogenesis (new blood vessel formation) to injured areas",
        "Studied for neuroprotective effects and nervous system repair",
        "May support joint health and cartilage recovery",
      ],
      mechanism: "BPC-157 works by upregulating growth hormone receptors and activating the FAK-paxillin pathway, which plays a key role in cell survival and migration. It also promotes the formation of new blood vessels through VEGF signaling, accelerating nutrient delivery to healing tissue.",
      specs: [
        { label: "Sequence", value: "Gly-Glu-Pro-Pro-Pro-Gly-Lys-Pro-Ala-Asp-Asp-Ala-Gly-Leu-Val" },
        { label: "Molecular Weight", value: "1,419.5 Da" },
        { label: "Form", value: "Lyophilized powder" },
        { label: "Purity", value: "≥99% (HPLC verified)" },
        { label: "Storage", value: "Refrigerate at 2–8°C. Stable up to 24 months lyophilized." },
        { label: "Reconstitution", value: "Bacteriostatic water" },
      ],
    },
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
    detail: {
      overview: "TB-500 is a synthetic version of Thymosin Beta-4, a naturally occurring 43-amino acid peptide found in virtually all human and animal cells. It plays a central role in building new blood vessels, muscle fibers, and cell migration. Unlike BPC-157 which is more site-specific, TB-500 has a systemic healing effect throughout the body.",
      benefits: [
        "Promotes systemic healing — works throughout the entire body",
        "Accelerates muscle fiber repair and regeneration",
        "Reduces inflammation and scar tissue formation",
        "Improves flexibility and range of motion in damaged tissue",
        "Studied for cardiac tissue repair and protection",
        "Supports hair follicle growth in research models",
      ],
      mechanism: "TB-500 works primarily by upregulating actin — a protein critical for cell structure and movement. By promoting actin polymerization, it accelerates cell migration to injury sites, speeds up tissue repair, and facilitates the growth of new blood vessels. Its systemic nature means it doesn't require local injection near the injury site.",
      specs: [
        { label: "Sequence", value: "Ac-LKKTETQ (17-mer fragment)" },
        { label: "Molecular Weight", value: "4,963.5 Da" },
        { label: "Form", value: "Lyophilized powder" },
        { label: "Purity", value: "≥98.5% (HPLC verified)" },
        { label: "Storage", value: "Refrigerate at 2–8°C. Stable up to 24 months lyophilized." },
        { label: "Reconstitution", value: "Bacteriostatic water" },
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
    price: 79.99,
    unit: "100mg vial",
    purity: "≥99%",
    desc: "A critical coenzyme present in every living cell, studied extensively for cellular energy production, mitochondrial function, DNA repair, and longevity pathways.",
    meta: ["100mg / vial", "≥99% Purity", "Lyophilized", "COA Included"],
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
    detail: {
      overview: "This blend combines two complementary growth hormone-releasing peptides into a single vial. CJC-1295 DAC extends the natural GHRH signal for days at a time, while Ipamorelin provides a clean, selective GH pulse without affecting cortisol or prolactin. Together they produce a sustained and amplified GH release pattern that mimics the body's natural rhythm.",
      benefits: [
        "Sustained growth hormone release over multiple days (CJC-1295)",
        "Clean GH pulse with no cortisol or prolactin elevation (Ipamorelin)",
        "Supports lean muscle development and recovery in research",
        "Studied for improvements in sleep quality and deep sleep duration",
        "May enhance fat metabolism and body composition",
        "Synergistic effect — works better together than either alone",
      ],
      mechanism: "CJC-1295 binds to GHRH receptors and extends the natural GH-releasing hormone signal for up to 8 days via its Drug Affinity Complex (DAC) technology. Ipamorelin mimics ghrelin to stimulate GH secretion through a separate receptor pathway (GHS-R). Using both simultaneously creates a dual-pathway pulse that produces a larger and more sustained GH response than either compound alone.",
      specs: [
        { label: "Contents", value: "5mg CJC-1295 DAC + 5mg Ipamorelin" },
        { label: "CJC-1295 Half-Life", value: "~8 days" },
        { label: "Ipamorelin Half-Life", value: "~2 hours" },
        { label: "Form", value: "Lyophilized blend" },
        { label: "Purity", value: "≥99% each component (HPLC verified)" },
        { label: "Storage", value: "Refrigerate at 2–8°C. Keep away from light." },
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
    price: 39.99,
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
];

/* ---- Load products w/ stock from localStorage ---- */
function loadProducts() {
  const saved = localStorage.getItem("leanova_products");
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
  localStorage.setItem("leanova_products", JSON.stringify(PRODUCTS.map(p => ({ id: p.id, stock: p.stock }))));
}
const PRODUCTS = loadProducts();

const FAQS = [
  {
    q: "What does 'research purposes only' mean?",
    a: "All Leanova peptides are sold strictly for in vitro (laboratory) research. They are not intended for human or veterinary use, consumption, or injection. Always consult a licensed healthcare professional before any personal use.",
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
      <div class="product-card__img">
        <span class="product-card__img-badge">${p.categoryLabel}</span>
      </div>
      <div class="product-card__body">
        <div class="product-card__name">${p.name}</div>
        <p class="product-card__desc">${p.desc}</p>
        <div class="product-card__specs">
          ${p.meta.map(m => `<span class="spec-tag">${m}</span>`).join("")}
        </div>
        <div class="stock-indicator ${soldOut ? 'stock-indicator--out' : lowStock ? 'stock-indicator--low' : 'stock-indicator--in'}">
          <span class="stock-dot"></span>
          ${soldOut ? "Sold Out" : lowStock ? `Only ${p.stock} left` : `${p.stock} in stock`}
        </div>
      </div>
      <div class="product-card__footer">
        <div>
          <div class="product-card__price">$${p.price.toFixed(2)}</div>
          <div class="product-card__price-sub">per ${p.unit}</div>
        </div>
        <div class="product-card__actions">
          <button class="view-details-btn" data-id="${p.id}">Details</button>
          <button class="add-to-cart" data-id="${p.id}" ${available === 0 ? "disabled" : ""}>
            ${available === 0
              ? "Sold Out"
              : `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Add`}
          </button>
        </div>
      </div>
    `;
    productGrid.appendChild(card);
  });

  document.querySelectorAll(".add-to-cart:not([disabled])").forEach(btn => {
    btn.addEventListener("click", () => addToCart(parseInt(btn.dataset.id), btn));
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
  const ship = sub >= 150 ? 0 : 9.99;
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

/* ---- Orders persistence ---- */
function loadOrders() {
  try { return JSON.parse(localStorage.getItem("leanova_orders") || "[]"); }
  catch { return []; }
}
function saveOrders(orders) {
  localStorage.setItem("leanova_orders", JSON.stringify(orders));
}

/* ---- Owner SMS / Email Notification ---- */
function buildOrderMessage(order) {
  const itemsLine = order.items.map(i => `${i.name} x${i.qty}`).join(", ");
  return [
    `🛒 New Leanova Order ${order.id}`,
    `${order.customer.firstName} ${order.customer.lastName}`,
    `${order.customer.email} · ${order.customer.phone || "no phone"}`,
    `${order.customer.address}, ${order.customer.city}, ${order.customer.state} ${order.customer.zip}`,
    `Items: ${itemsLine}`,
    `Total: $${order.total.toFixed(2)} via Cash App (${CASHAPP_HANDLE})`,
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

/* =========================================================
   Product Detail Modal
   ========================================================= */
const detailOverlay = document.getElementById("detailOverlay");
const detailModal   = document.getElementById("detailModal");
const detailClose   = document.getElementById("detailClose");
const detailBody    = document.getElementById("detailBody");
const detailAddBtn  = document.getElementById("detailAddBtn");

let detailProduct = null;

function openDetail(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;
  detailProduct = p;

  document.getElementById("detailIcon").textContent     = p.icon;
  document.getElementById("detailName").textContent     = p.name;
  document.getElementById("detailFullName").textContent = p.fullName;
  document.getElementById("detailPrice").textContent    = `$${p.price.toFixed(2)}`;
  document.getElementById("detailUnit").textContent     = `per ${p.unit}`;

  const available = availableStock(p);
  detailAddBtn.disabled = available === 0;
  detailAddBtn.innerHTML = available === 0
    ? "Sold Out"
    : `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Add to Cart`;

  const d = p.detail;
  detailBody.innerHTML = `
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

    <div class="detail-disclaimer">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
      For research purposes only. Not intended for human consumption. Always consult a licensed healthcare professional.
    </div>
  `;

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
  addToCart(detailProduct.id, detailAddBtn);
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
