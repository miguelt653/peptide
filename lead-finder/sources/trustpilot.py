"""Trustpilot scraper — targets merchant-side reviews of delivery platforms."""
import requests
from bs4 import BeautifulSoup
from utils import make_lead, polite_sleep, random_ua
from config import TRUSTPILOT_TARGETS

BASE = "https://www.trustpilot.com/review/{slug}"


def scrape(dry_run=False):
    leads = []
    seen = set()

    for slug in TRUSTPILOT_TARGETS:
        for page in range(1, 4):
            url = f"{BASE.format(slug=slug)}?page={page}&languages=en"
            try:
                r = requests.get(url, headers={"User-Agent": random_ua(),
                                               "Accept-Language": "en-US,en;q=0.9"}, timeout=20)
                if r.status_code != 200:
                    break
                soup = BeautifulSoup(r.text, "html.parser")

                reviews = (soup.select("[data-service-review-card-paper]") or
                           soup.select("article.review") or
                           soup.select("[class*='styles_reviewCard']"))
                if not reviews:
                    break

                for rev in reviews:
                    body_el = (rev.select_one("[data-service-review-text-typography]") or
                               rev.select_one("p.typography_body"))
                    body = body_el.get_text(" ", strip=True) if body_el else ""

                    title_el = rev.select_one("[data-service-review-title-typography]") or rev.select_one("h2")
                    title = title_el.get_text(strip=True) if title_el else ""

                    author_el = rev.select_one("[data-consumer-name-typography]") or rev.select_one("span.typography_heading-xxs")
                    author = author_el.get_text(strip=True) if author_el else ""

                    date_el = rev.select_one("time")
                    date = date_el.get("datetime", "")[:10] if date_el else ""

                    uid = f"{slug}_{author}_{title[:30]}"
                    if uid in seen:
                        continue
                    seen.add(uid)

                    lead = make_lead(
                        platform=f"Trustpilot ({slug})",
                        url=url,
                        text=body,
                        title=title,
                        author_username=author,
                        date_posted=date,
                    )
                    if lead:
                        leads.append(lead)
                        if dry_run:
                            print(f"  [trustpilot/{slug}][{lead['relevance_score']}] {title[:70]}")
                polite_sleep()
            except Exception as e:
                print(f"  ! trustpilot {slug} p{page}: {e}")
                break

    return leads
