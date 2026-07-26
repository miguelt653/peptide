"""Google Search scraper — parses result snippets for pain signals.

Uses requests + BeautifulSoup against the public search results page.
No API key needed. Sends one query at a time with polite delays.
Heavy use risks IP blocks — this is designed for weekly batch runs only.
"""
import requests
from bs4 import BeautifulSoup
from utils import make_lead, polite_sleep, random_ua
from config import GOOGLE_QUERIES

GOOGLE = "https://www.google.com/search"
HEADERS_BASE = {
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Referer": "https://www.google.com/",
}


def scrape(dry_run=False):
    leads = []
    seen = set()

    for query in GOOGLE_QUERIES:
        try:
            headers = {**HEADERS_BASE, "User-Agent": random_ua()}
            r = requests.get(GOOGLE, params={"q": query, "num": 20, "hl": "en"},
                             headers=headers, timeout=20)
            if r.status_code != 200:
                print(f"  ! google blocked ({r.status_code}) for: {query}")
                polite_sleep()
                continue

            soup = BeautifulSoup(r.text, "html.parser")
            results = soup.select("div.g") or soup.select("[data-sokoban-container]")

            for res in results:
                link_el = res.select_one("a[href]")
                url = link_el["href"] if link_el else ""
                if not url or not url.startswith("http"):
                    continue

                title_el = res.select_one("h3")
                title = title_el.get_text(strip=True) if title_el else ""

                snippet_el = res.select_one("[data-sncf]") or res.select_one(".VwiC3b")
                snippet = snippet_el.get_text(" ", strip=True) if snippet_el else ""

                uid = url[:100]
                if uid in seen:
                    continue
                seen.add(uid)

                lead = make_lead(
                    platform="Google Search",
                    url=url,
                    text=snippet,
                    title=title,
                )
                if lead:
                    leads.append(lead)
                    if dry_run:
                        print(f"  [google][{lead['relevance_score']}] {title[:70]}")

            polite_sleep()
        except Exception as e:
            print(f"  ! google '{query[:40]}': {e}")

    return leads
