"""Lemmy source — public search API on any instance. Free, no key."""
import requests


def search(topic, cfg):
    instance = cfg.get("instance", "https://lemmy.world").rstrip("/")
    limit = cfg.get("limit_per_query", 20)
    try:
        r = requests.get(f"{instance}/api/v3/search",
                         params={"q": topic, "type_": "Posts", "sort": "TopMonth",
                                 "limit": limit},
                         headers={"User-Agent": "loopai-lead-finder/0.1"}, timeout=15)
        if r.status_code != 200:
            return []
        data = r.json()
    except requests.RequestException:
        return []

    results = []
    for item in data.get("posts", []):
        post = item.get("post", {})
        creator = item.get("creator", {})
        community = item.get("community", {})
        counts = item.get("counts", {})
        results.append({
            "source": "lemmy",
            "external_id": str(post.get("id", "")),
            "author": creator.get("name", ""),
            "title": post.get("name", ""),
            "body": post.get("body", "") or "",
            "url": post.get("ap_id", ""),
            "community": "!" + community.get("name", ""),
            "upvotes": counts.get("score", 0),
            "created_utc": 0,
        })
    return results
