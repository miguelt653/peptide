"""Hacker News source — Algolia search API. Completely free, no key, no auth."""
import requests

API = "https://hn.algolia.com/api/v1/search"


def search(topic, cfg):
    limit = cfg.get("limit_per_query", 30)
    try:
        r = requests.get(API, params={"query": topic, "tags": "(story,comment)",
                                       "hitsPerPage": limit}, timeout=15)
        if r.status_code != 200:
            return []
        data = r.json()
    except requests.RequestException:
        return []

    results = []
    for hit in data.get("hits", []):
        text = hit.get("story_text") or hit.get("comment_text") or ""
        title = hit.get("title") or hit.get("story_title") or ""
        oid = hit.get("objectID", "")
        results.append({
            "source": "hackernews",
            "external_id": oid,
            "author": hit.get("author", ""),
            "title": title,
            "body": text,
            "url": f"https://news.ycombinator.com/item?id={oid}",
            "community": "HackerNews",
            "upvotes": hit.get("points") or 0,
            "created_utc": int(hit.get("created_at_i") or 0),
        })
    return results
