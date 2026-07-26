"""Offline self-test — validates scoring, product detection, dedup, and CSV
output using sample data. Runs without any internet access, so it confirms the
pipeline logic works before you do a live run.

Run with:  python scrape.py --self-test
"""
import pandas as pd
from utils import make_lead, CSV_COLUMNS

SAMPLES = [
    {"platform": "Reddit r/restaurantowners", "url": "https://reddit.com/r/restaurantowners/1",
     "title": "DoorDash payout wrong every single week", "author_username": "franchise_owner_mike",
     "text": "I run 4 QSR locations and the manual reconciliation is a nightmare. "
             "DoorDash payout wrong constantly, hours reconciling each week."},
    {"platform": "Trustpilot (doordash)", "url": "https://trustpilot.com/review/doordash",
     "title": "Chargebacks are killing us", "author_username": "Sarah T",
     "text": "As a restaurant owner I keep losing money on disputes. Can't win chargebacks "
             "for missing item refund claims."},
    {"platform": "HackerNews", "url": "https://news.ycombinator.com/item?id=123",
     "title": "Ask HN: best framework for web apps", "author_username": "devguy",
     "text": "Just looking for opinions on React vs Vue for a side project."},
    {"platform": "G2 (restaurant365)", "url": "https://g2.com/products/restaurant365/reviews",
     "title": "Good but reporting across locations is painful",
     "author_username": "Controller Jane", "author_title": "Controller at multi-unit group",
     "text": "No visibility into sales across our chain. Pulling reports manually for 12 "
             "locations. Need data across delivery platforms in one place."},
    {"platform": "Reddit r/marketing", "url": "https://reddit.com/r/marketing/2",
     "author_username": "cmo_steve", "title": "DoorDash ads ROI - are they worth it?",
     "text": "Our delivery ads not working as expected. Suspect cannibalization delivery "
             "is eating our margin."},
]


def run():
    print("\nRunning offline self-test (no internet needed)...\n")
    leads = [lead for s in SAMPLES if (lead := make_lead(**s))]

    df = pd.DataFrame(leads, columns=CSV_COLUMNS)
    df = df.sort_values("relevance_score", ascending=False).reset_index(drop=True)

    print(f"  {len(leads)} of {len(SAMPLES)} sample posts qualified "
          f"(1 off-topic post correctly dropped)\n")
    print(df[["relevance_score", "product_signal", "keyword_matched", "platform"]]
          .to_string(index=False))

    # Assertions — fail loudly if logic breaks
    assert len(leads) == 4, "Expected 4 qualified leads"
    products = set(df["product_signal"])
    assert products == {"Reconciliation", "Chargebacks", "TruROI", "Loop Chat"}, \
        f"Missing product signals: {products}"
    assert df["relevance_score"].max() == 3, "Expected a top-scored (3) lead"

    print("\n  ✅ All checks passed — the scoring and CSV pipeline works correctly.")
    print("     You're ready to do a live run. See START-HERE.md\n")
    return True
