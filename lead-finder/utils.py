"""Shared utilities: scoring, dedup, CSV output, rate limiting."""
import random
import time
import re
from config import PRODUCT_SIGNALS, PERSONA_SIGNALS, DELAY_MIN, DELAY_MAX

# Rotating user agents to reduce fingerprinting on static scrapes
USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:124.0) Gecko/20100101 Firefox/124.0",
]


def random_ua():
    return random.choice(USER_AGENTS)


def polite_sleep():
    time.sleep(random.uniform(DELAY_MIN, DELAY_MAX))


def detect_product_signal(text):
    """Return the Loop product most relevant to this text, and the matched keyword."""
    if not text:
        return None, None
    low = text.lower()
    best_product, best_kw = None, None
    for product, keywords in PRODUCT_SIGNALS.items():
        for kw in keywords:
            if kw in low:
                best_product, best_kw = product, kw
                return best_product, best_kw
    return None, None


def score_lead(text, product_signal):
    """
    Score 1–3:
      1 = one keyword hit
      2 = multiple keyword hits OR persona signal present
      3 = multiple keyword hits AND persona signal present
    """
    if not text or not product_signal:
        return 1
    low = text.lower()
    keywords = PRODUCT_SIGNALS.get(product_signal, [])
    kw_hits = sum(1 for kw in keywords if kw in low)
    persona_hit = any(p in low for p in PERSONA_SIGNALS)
    if kw_hits >= 2 and persona_hit:
        return 3
    if kw_hits >= 2 or persona_hit:
        return 2
    return 1


def make_lead(platform, url, text, title="", author_username="",
              author_full_name="", author_title="", author_company="",
              date_posted=""):
    """Construct a lead dict ready for the CSV."""
    full_text = f"{title} {text}".strip()
    product_signal, keyword_matched = detect_product_signal(full_text)
    if not product_signal:
        return None  # not a qualified lead
    score = score_lead(full_text, product_signal)
    return {
        "platform": platform,
        "post_url": url,
        "author_username": author_username,
        "author_full_name": author_full_name,
        "author_title": author_title,
        "author_company": author_company,
        "post_text": full_text[:500],
        "keyword_matched": keyword_matched,
        "product_signal": product_signal,
        "date_posted": date_posted,
        "relevance_score": score,
    }


CSV_COLUMNS = [
    "platform", "post_url", "author_username", "author_full_name",
    "author_title", "author_company", "post_text", "keyword_matched",
    "product_signal", "date_posted", "relevance_score",
]
