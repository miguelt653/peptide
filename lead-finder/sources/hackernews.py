"""Hacker News source — Algolia API, fully free, no auth."""
import requests
from utils import make_lead, polite_sleep
from config import ALL_KEYWORDS

API = "https://hn.algolia.com/api/v1/search"


def scrape(dry_run=False):
    leads = []
    seen = set()

    for kw in ALL_KEYWORDS:
        try:
            r = requests.get(API, params={"query": kw, "tags": "(story,comment)",
                                           "hitsPerPage": 30}, timeout=15)
            if r.status_code != 200:
                continue
            for hit in r.json().get("hits", []):
                oid = hit.get("objectID", "")
                if oid in seen:
                    continue
                seen.add(oid)
                text = hit.get("story_text") or hit.get("comment_text") or ""
                title = hit.get("title") or hit.get("story_title") or ""
                url = f"https://news.ycombinator.com/item?id={oid}"
                lead = make_lead(
                    platform="HackerNews",
                    url=url,
                    text=text,
                    title=title,
                    author_username=hit.get("author", ""),
                    date_posted=(hit.get("created_at") or "")[:10],
                )
                if lead:
                    leads.append(lead)
                    if dry_run:
                        print(f"  [hn][{lead['relevance_score']}] {title[:70]}")
            polite_sleep()
        except Exception as e:
            print(f"  ! hackernews '{kw}': {e}")

    return leads
