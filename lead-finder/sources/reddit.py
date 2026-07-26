"""Reddit source via PRAW (official free API)."""
import os
import praw
from datetime import datetime, timezone
from utils import make_lead
from config import REDDIT_SUBREDDITS, ALL_KEYWORDS

_reddit = None


def _client():
    global _reddit
    if _reddit is None:
        _reddit = praw.Reddit(
            client_id=os.environ["REDDIT_CLIENT_ID"],
            client_secret=os.environ["REDDIT_CLIENT_SECRET"],
            user_agent=os.environ.get("REDDIT_USER_AGENT", "loopai-lead-finder/1.0"),
        )
        _reddit.read_only = True
    return _reddit


def scrape(dry_run=False):
    r = _client()
    leads = []
    seen = set()

    for sub_name in REDDIT_SUBREDDITS:
        sub = r.subreddit(sub_name)
        for kw in ALL_KEYWORDS:
            try:
                for post in sub.search(kw, sort="new", time_filter="month", limit=50):
                    if post.id in seen:
                        continue
                    seen.add(post.id)
                    date = datetime.fromtimestamp(post.created_utc, tz=timezone.utc).date().isoformat()
                    lead = make_lead(
                        platform=f"Reddit r/{sub_name}",
                        url=f"https://www.reddit.com{post.permalink}",
                        text=post.selftext or "",
                        title=post.title,
                        author_username=str(post.author) if post.author else "",
                        date_posted=date,
                    )
                    if lead:
                        leads.append(lead)
                        if dry_run:
                            print(f"  [reddit][{lead['relevance_score']}] {post.title[:70]}")

                # Also scan comments in matching posts
                for post in sub.search(kw, sort="relevance", time_filter="month", limit=20):
                    post.comments.replace_more(limit=0)
                    for comment in post.comments.list()[:30]:
                        cid = f"c_{comment.id}"
                        if cid in seen:
                            continue
                        seen.add(cid)
                        date = datetime.fromtimestamp(comment.created_utc, tz=timezone.utc).date().isoformat()
                        lead = make_lead(
                            platform=f"Reddit r/{sub_name}",
                            url=f"https://www.reddit.com{post.permalink}",
                            text=comment.body or "",
                            title=post.title,
                            author_username=str(comment.author) if comment.author else "",
                            date_posted=date,
                        )
                        if lead:
                            leads.append(lead)
            except Exception as e:
                print(f"  ! reddit r/{sub_name} '{kw}': {e}")

    return leads
