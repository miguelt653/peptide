"""G2 public review scraper — targets competitor product pages."""
import requests
from bs4 import BeautifulSoup
from utils import make_lead, polite_sleep, random_ua
from config import G2_COMPETITORS

BASE = "https://www.g2.com/products/{slug}/reviews"


def scrape(dry_run=False):
    leads = []
    seen = set()

    for slug in G2_COMPETITORS:
        for page in range(1, 4):  # first 3 pages per competitor
            url = f"{BASE.format(slug=slug)}?page={page}"
            try:
                r = requests.get(url, headers={"User-Agent": random_ua()}, timeout=20)
                if r.status_code != 200:
                    break
                soup = BeautifulSoup(r.text, "html.parser")
                reviews = soup.select("[itemprop='review']") or soup.select(".paper.paper--white.paper--shadow.border-all")
                if not reviews:
                    break
                for rev in reviews:
                    # Extract review text
                    body_el = (rev.select_one("[itemprop='reviewBody']") or
                               rev.select_one(".formatted-text"))
                    body = body_el.get_text(" ", strip=True) if body_el else ""

                    # Title / headline
                    title_el = rev.select_one("[itemprop='name']") or rev.select_one(".review-title")
                    title = title_el.get_text(strip=True) if title_el else ""

                    # Author
                    author_el = rev.select_one("[itemprop='author']") or rev.select_one(".m-0.l-2")
                    author = author_el.get_text(strip=True) if author_el else ""

                    # Job title / company
                    job_el = rev.select_one(".mt-4th") or rev.select_one("[data-test='reviewer-info']")
                    job_text = job_el.get_text(" ", strip=True) if job_el else ""

                    # Date
                    date_el = rev.select_one("time")
                    date = date_el.get("datetime", "")[:10] if date_el else ""

                    uid = f"{slug}_{author}_{title[:30]}"
                    if uid in seen:
                        continue
                    seen.add(uid)

                    lead = make_lead(
                        platform=f"G2 ({slug})",
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
                            print(f"  [g2/{slug}][{lead['relevance_score']}] {title[:70]}")
                polite_sleep()
            except Exception as e:
                print(f"  ! g2 {slug} p{page}: {e}")
                break

    return leads
