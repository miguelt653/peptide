#!/usr/bin/env python3
"""
Loop AI Pain Signal Scraper
============================
Scans free public platforms for restaurant operators, franchise owners, and
finance/ops leaders expressing pain around delivery reconciliation, chargebacks,
marketing ROI, and reporting — the exact problems Loop AI solves.

Usage:
    python scrape.py                        # run all sources
    python scrape.py --source reddit        # single source
    python scrape.py --dry-run              # print matches, no CSV
    python scrape.py --source hackernews --dry-run
"""
import argparse
import os
import sys
from datetime import date
from pathlib import Path

import pandas as pd
from dotenv import load_dotenv

load_dotenv()

from utils import CSV_COLUMNS

SOURCES = {
    "reddit": "sources.reddit",
    "hackernews": "sources.hackernews",
    "g2": "sources.g2",
    "capterra": "sources.capterra",
    "trustpilot": "sources.trustpilot",
    "google": "sources.google_search",
    "quora": "sources.quora",
    "press": "sources.industry_press",
}


def import_source(name):
    import importlib
    return importlib.import_module(SOURCES[name])


def run(sources_to_run, dry_run):
    all_leads = []

    for name in sources_to_run:
        print(f"\n{'='*50}")
        print(f"  Source: {name.upper()}")
        print(f"{'='*50}")
        try:
            mod = import_source(name)
            leads = mod.scrape(dry_run=dry_run)
            all_leads.extend(leads)
            print(f"  => {len(leads)} qualified leads from {name}")
        except Exception as e:
            print(f"  ! {name} failed: {e}")
            if os.environ.get("DEBUG"):
                import traceback; traceback.print_exc()

    if not all_leads:
        print("\nNo leads found. Try --dry-run or check your credentials.")
        return

    df = pd.DataFrame(all_leads, columns=CSV_COLUMNS)

    # Deduplicate by URL + author
    df = df.drop_duplicates(subset=["post_url", "author_username"], keep="first")

    # Sort by relevance descending
    df = df.sort_values("relevance_score", ascending=False).reset_index(drop=True)

    if dry_run:
        print(f"\n[dry-run] Would write {len(df)} leads.")
        print(df[["platform", "relevance_score", "product_signal", "keyword_matched",
                   "post_text"]].head(20).to_string(index=False))
        return

    out_dir = Path(__file__).parent / "output"
    out_dir.mkdir(exist_ok=True)
    filename = out_dir / f"loop_pain_signals_{date.today().isoformat()}.csv"
    df.to_csv(filename, index=False)

    print(f"\n{'='*50}")
    print(f"  DONE")
    print(f"  Total leads:     {len(df)}")
    print(f"  Output:          {filename}")
    print(f"  By product:")
    for product, count in df["product_signal"].value_counts().items():
        print(f"    {product}: {count}")
    print(f"  By score:")
    for score, count in df["relevance_score"].value_counts().sort_index(ascending=False).items():
        print(f"    Score {score}: {count}")
    print(f"{'='*50}")


def main():
    ap = argparse.ArgumentParser(description="Loop AI Pain Signal Scraper")
    ap.add_argument("--source", choices=list(SOURCES.keys()),
                    help="Run only this source (default: all)")
    ap.add_argument("--dry-run", action="store_true",
                    help="Print matches without writing CSV")
    ap.add_argument("--self-test", action="store_true",
                    help="Validate scoring/CSV logic offline (no internet needed)")
    args = ap.parse_args()

    if args.self_test:
        import self_test
        self_test.run()
        return

    if args.source:
        sources_to_run = [args.source]
    else:
        # Skip reddit if no credentials are set
        sources_to_run = list(SOURCES.keys())
        if not os.environ.get("REDDIT_CLIENT_ID"):
            print("⚠  REDDIT_CLIENT_ID not set — skipping Reddit. Add to .env to enable.")
            sources_to_run = [s for s in sources_to_run if s != "reddit"]
        # Skip quora unless explicitly requested (slow)
        if not args.source:
            sources_to_run = [s for s in sources_to_run if s != "quora"]
            print("ℹ  Quora skipped by default (slow). Run: python scrape.py --source quora")

    run(sources_to_run, dry_run=args.dry_run)


if __name__ == "__main__":
    main()
