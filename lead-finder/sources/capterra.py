"""Capterra public review scraper."""
import requests
from bs4 import BeautifulSoup
from utils import make_lead, polite_sleep, random_ua
from config import CAPTERRA_COMPETITORS

BASE = "https://www.capterra.com/p/{slug}/reviews/"


def scrape(dry_run=False):
    leads = []
    seen = set()

    # Capterra slugs are numeric — these are the public search URLs instead
    search_base = "https://www.capterra.com/reviews/{slug}/"

    for slug in CAPTERRA_COMPETITORS:
        for page in range(1, 4):
            url = f"{search_base.format(slug=slug)}?page={page}"
            try:
                r = requests.get(url, headers={"User-Agent": random_ua(),
                                               "Accept-Language": "en-US,en;q=0.9"}, timeout=20)
                if r.status_code != 200:
                    break
                soup = BeautifulSoup(r.text, "html.parser")

                # Capterra wraps reviews in article or review cards
                reviews = (soup.select("article.review") or
                           soup.select("[data-testid='review-card']") or
                           soup.select(".review-listing"))
                if not reviews:
                    break

                for rev in reviews:
                    body_el = rev.select_one(".review-body") or rev.select_one("p")
                    body = body_el.get_text(" ", strip=True) if body_el else ""

                    title_el = rev.select_one(".review-title") or rev.select_one("h3")
                    title = title_el.get_text(strip=True) if title_el else ""

                    author_el = rev.select_one(".reviewer-name") or rev.select_one("strong")
                    author = author_el.get_text(strip=True) if author_el else ""

                    job_el = rev.select_one(".reviewer-info") or rev.select_one(".reviewer-title")
                    job_text = job_el.get_text(" ", strip=True) if job_el else ""

                    date_el = rev.select_one("time")
                    date = date_el.get("datetime", "")[:10] if date_el else ""

                    uid = f"{slug}_{author}_{title[:30]}"
                    if uid in seen:
                        continue
                    seen.add(uid)

                    lead = make_lead(
                        platform=f"Capterra ({slug})",
                        url=url,
                        text=body,
                        title=title,
                        author_username=author,
                        author_title=job_text,
                        date_posted=date,
                    )
                    if lead:
                        leads.append(lead)
                        if dry_run:
                            print(f"  [capterra/{slug}][{lead['relevance_score']}] {title[:70]}")
                polite_sleep()
            except Exception as e:
                print(f"  ! capterra {slug} p{page}: {e}")
                break

    return leads
