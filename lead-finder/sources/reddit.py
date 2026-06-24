"""Reddit source — uses the public .json endpoints. No API key required.

Reddit allows unauthenticated JSON access at low volume. We send a descriptive
User-Agent and throttle between requests to stay within their fair-use limits.
For higher volume, switch to PRAW with a registered app (free).
"""
import time
import requests

USER_AGENT = "loopai-lead-finder/0.1 (research; contact: leads@loopai.example)"
HEADERS = {"User-Agent": USER_AGENT}


def _get(url, params):
    for attempt in range(4):
        try:
            r = requests.get(url, params=params, headers=HEADERS, timeout=15)
            if r.status_code == 200:
                return r.json()
            if r.status_code == 429:
                time.sleep(2 ** attempt)
                continue
            return None
        except requests.RequestException:
            time.sleep(2 ** attempt)
    return None


def search(topic, cfg):
    """Search configured subreddits for a topic. Returns raw lead dicts."""
    results = []
    subs = cfg.get("subreddits") or [None]
    time_filter = cfg.get("time_filter", "month")
    limit = cfg.get("limit_per_query", 50)

    for sub in subs:
        if sub:
            url = f"https://www.reddit.com/r/{sub}/search.json"
            params = {"q": topic, "restrict_sr": 1, "sort": "relevance",
                      "t": time_filter, "limit": limit}
        else:
            url = "https://www.reddit.com/search.json"
            params = {"q": topic, "sort": "relevance", "t": time_filter, "limit": limit}

        data = _get(url, params)
        time.sleep(1.5)  # be polite
        if not data:
            continue

        for child in data.get("data", {}).get("children", []):
            d = child.get("data", {})
            results.append({
                "source": "reddit",
                "external_id": d.get("id", ""),
                "author": d.get("author", ""),
                "title": d.get("title", ""),
                "body": d.get("selftext", "") or "",
                "url": "https://www.reddit.com" + d.get("permalink", ""),
                "community": "r/" + d.get("subreddit", ""),
                "upvotes": d.get("score", 0),
                "created_utc": int(d.get("created_utc", 0)),
            })
    return results
