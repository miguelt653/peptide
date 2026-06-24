"""Industry press scraper — Restaurant Business Online and QSR Magazine comment sections."""
import requests
from bs4 import BeautifulSoup
from utils import make_lead, polite_sleep, random_ua

SITES = [
    {
        "name": "RestaurantBusinessOnline",
        "search_url": "https://www.restaurantbusinessonline.com/search?q={kw}",
        "article_sel": "article a[href]",
        "comment_sel": ".comment-body, .comment-content, [class*='comment']",
    },
    {
        "name": "QSRMagazine",
        "search_url": "https://www.qsrmagazine.com/?s={kw}",
        "article_sel": ".entry-title a, h2.title a",
        "comment_sel": ".comment-body, [class*='comment-text']",
    },
]

TARGET_KEYWORDS = [
    "delivery reconciliation", "chargeback", "payout discrepancy",
    "marketing ROI delivery", "third party delivery fees",
]


def _get(url):
    try:
        r = requests.get(url, headers={"User-Agent": random_ua()}, timeout=20)
        return r if r.status_code == 200 else None
    except Exception:
        return None


def scrape(dry_run=False):
    leads = []
    seen = set()

    for site in SITES:
        for kw in TARGET_KEYWORDS:
            search_url = site["search_url"].format(kw=kw.replace(" ", "+"))
            r = _get(search_url)
            if not r:
                continue
            soup = BeautifulSoup(r.text, "html.parser")

            article_links = [a["href"] for a in soup.select(site["article_sel"])
                             if a.get("href", "").startswith("http")][:5]

            for article_url in article_links:
                if article_url in seen:
                    continue
                seen.add(article_url)
                polite_sleep()
                ar = _get(article_url)
                if not ar:
                    continue
                asoup = BeautifulSoup(ar.text, "html.parser")

                # Scrape comments
                comment_els = asoup.select(site["comment_sel"])
                for cel in comment_els:
                    text = cel.get_text(" ", strip=True)
                    author_el = cel.find_previous(["cite", "span"], class_=lambda c: c and "author" in c)
                    author = author_el.get_text(strip=True) if author_el else ""

                    uid = f"{article_url}_{text[:40]}"
                    if uid in seen:
                        continue
                    seen.add(uid)

                    lead = make_lead(
                        platform=site["name"],
                        url=article_url,
                        text=text,
                        author_username=author,
                    )
                    if lead:
                        leads.append(lead)
                        if dry_run:
                            print(f"  [{site['name']}][{lead['relevance_score']}] {text[:70]}")

            polite_sleep()

    return leads
