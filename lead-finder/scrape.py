#!/usr/bin/env python3
"""Lead finder — searches free public sources for people expressing pain points
that Loop AI's products address, scores them, and stores them for the portal.

Usage:
    python scrape.py            # run all enabled sources against config topics
    python scrape.py --dry-run  # show what would be found, don't write to db
"""
import argparse
import json
import re
from pathlib import Path

import db
from sources import reddit, hackernews, lemmy

CONFIG = Path(__file__).parent / "config.json"
SOURCE_MODULES = {"reddit": reddit, "hackernews": hackernews, "lemmy": lemmy}


def load_config():
    with open(CONFIG) as f:
        return json.load(f)


def score_pain(text, signals):
    """Count distinct intent phrases present. Higher = more likely a real lead."""
    if not text:
        return 0
    low = text.lower()
    hits = set()
    for sig in signals:
        # word-ish boundary match so 'cant' doesn't fire inside 'cantaloupe'
        if re.search(r"(?<![a-z])" + re.escape(sig.lower()) + r"(?![a-z])", low):
            hits.add(sig.lower())
    return len(hits)


def run(dry_run=False):
    cfg = load_config()
    signals = cfg.get("pain_signals", [])
    min_score = cfg.get("min_score", 1)
    topics = cfg.get("topics", [])

    found, new, skipped = 0, 0, 0

    for name, mod in SOURCE_MODULES.items():
        scfg = cfg.get(name, {})
        if not scfg.get("enabled"):
            continue
        print(f"\n=== {name} ===")
        for topic in topics:
            try:
                raw = mod.search(topic, scfg)
            except Exception as e:  # one bad source shouldn't kill the run
                print(f"  ! {topic}: {e}")
                continue
            for item in raw:
                found += 1
                score = score_pain(item["title"] + " " + item["body"], signals)
                if score < min_score:
                    skipped += 1
                    continue
                item["matched_topic"] = topic
                item["pain_score"] = score
                if dry_run:
                    print(f"  [{score}] {item['community']}: {item['title'][:70]}")
                    new += 1
                elif db.upsert_lead(item):
                    new += 1
                    print(f"  + [{score}] {item['community']}: {item['title'][:70]}")
            print(f"  · topic '{topic}' done")

    print(f"\nDone. scanned={found}  qualified+new={new}  below-threshold={skipped}")
    if not dry_run:
        s = db.stats()
        print(f"Portal now holds {s['total']} leads. Run: python app.py")


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true", help="don't write to db")
    args = ap.parse_args()
    run(dry_run=args.dry_run)
