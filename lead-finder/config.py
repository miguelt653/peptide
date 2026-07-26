"""Central config for all pain signals, subreddits, and scoring rules."""

# ---------------------------------------------------------------------------
# Pain signals keyed by product — used to assign product_signal and score
# ---------------------------------------------------------------------------
PRODUCT_SIGNALS = {
    "Reconciliation": [
        "reconciliation nightmare", "manual reconciliation", "pos doesn't match",
        "pos does not match", "doordash payout wrong", "uber eats discrepancy",
        "skipthedishes payout", "missing payout", "delivery fee discrepancy",
        "payout adjustment", "third party delivery fees", "hours reconciling",
        "delivery deposit wrong", "grubhub payout", "third-party delivery reconcil",
        "delivery platform fees", "payout error", "deposit discrepancy",
        "reconcile doordash", "reconcile uber eats",
    ],
    "Chargebacks": [
        "chargeback", "dispute delivery", "doordash dispute", "uber eats refund",
        "missing item refund", "order error charge", "losing money on disputes",
        "can't win chargebacks", "cant win chargebacks", "delivery error charges",
        "refund abuse", "fraud orders", "recovering revenue delivery",
        "delivery dispute", "grubhub dispute", "refund dispute delivery",
        "delivery platform dispute", "customer fraud delivery",
    ],
    "TruROI": [
        "delivery ads not working", "doordash ads roi", "uber eats promotions waste",
        "third party marketing spend", "cannibalization delivery",
        "incremental sales delivery", "restaurant marketing roi",
        "delivery promotion results", "ad spend delivery platforms",
        "promotions eating into margin", "delivery ads wasted",
        "doordash promotion roi", "uber eats ad spend", "sponsored listings delivery",
        "marketing spend delivery", "delivery platform ads",
    ],
    "Loop Chat": [
        "can't get data out of", "cant get data out of", "reporting across locations",
        "no visibility into sales", "pulling reports manually",
        "can't track performance", "cant track performance",
        "which locations underperforming", "data across delivery platforms",
        "restaurant analytics", "sales reporting nightmare", "hours pulling reports",
        "no single view", "scattered data", "multiple dashboards",
        "consolidate reports", "multi-location reporting", "location performance",
    ],
}

# Flat list for quick full-text scanning
ALL_KEYWORDS = [kw for kws in PRODUCT_SIGNALS.values() for kw in kws]

# ---------------------------------------------------------------------------
# Persona signals — presence boosts relevance score
# ---------------------------------------------------------------------------
PERSONA_SIGNALS = [
    "franchise", "franchisee", "multi-unit", "multi unit", "owner operator",
    "restaurant group", "qsr", "fast casual", "controller", "cfo", "vp finance",
    "vp operations", "director of operations", "accounting manager", "food service",
    "hospitality group", "chain restaurant", "food and beverage", "f&b",
    "delivery platform", "third party delivery", "3pd",
]

# ---------------------------------------------------------------------------
# Reddit subreddits to search
# ---------------------------------------------------------------------------
REDDIT_SUBREDDITS = [
    "restaurantowners", "franchise", "Accounting", "smallbusiness",
    "financeculture", "FoodService", "marketing", "entrepreneur",
    "restaurantmanagement", "fastfood",
]

# ---------------------------------------------------------------------------
# Google search query templates
# ---------------------------------------------------------------------------
GOOGLE_QUERIES = [
    '"DoorDash payout discrepancy" site:reddit.com OR site:quora.com',
    '"third party delivery chargeback" site:reddit.com',
    '"restaurant marketing ROI" "delivery platforms" site:reddit.com OR site:quora.com',
    '"can\'t track restaurant sales" site:reddit.com',
    '"reconcile DoorDash" OR "reconcile Uber Eats" site:reddit.com',
    '"missing payout" restaurant site:reddit.com OR site:quora.com',
    '"delivery dispute" restaurant owner site:reddit.com',
    '"multi location restaurant" reporting site:reddit.com',
]

# ---------------------------------------------------------------------------
# Competitor names to target on G2 / Capterra / Trustpilot
# ---------------------------------------------------------------------------
G2_COMPETITORS = [
    "restaurant365", "otter", "marketman", "toast-pos", "deliverect",
    "brightback", "margin-edge",
]

CAPTERRA_COMPETITORS = [
    "restaurant365", "toast-pos", "marketman", "deliverect", "lightspeed-restaurant",
]

TRUSTPILOT_TARGETS = [
    "doordash", "ubereats", "grubhub", "skipthedishes",
]

# ---------------------------------------------------------------------------
# Rate limiting (seconds) — randomized between min/max
# ---------------------------------------------------------------------------
DELAY_MIN = 3
DELAY_MAX = 8
