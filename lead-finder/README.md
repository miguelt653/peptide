# Loop AI Pain Signal Scraper

Monitors free public platforms for restaurant operators, franchise owners, and finance/ops leaders expressing pain around the exact problems Loop AI solves.

## Setup

```bash
cd lead-finder
pip install -r requirements.txt
playwright install chromium
cp .env.example .env
# Edit .env with your Reddit API credentials
```

## Reddit API credentials (free)

1. Go to https://www.reddit.com/prefs/apps
2. Click "create another app" → choose **script**
3. Fill in name/description, redirect URI = `http://localhost:8080`
4. Copy the **client_id** (under app name) and **client_secret** into `.env`

## Run

```bash
# Quick test — HN only, no credentials needed
python scrape.py --source hackernews --dry-run

# Full run — all sources
python scrape.py

# Single source
python scrape.py --source reddit
python scrape.py --source g2
python scrape.py --source capterra
python scrape.py --source trustpilot
python scrape.py --source google
python scrape.py --source quora   # requires playwright

# Output goes to: output/loop_pain_signals_YYYY-MM-DD.csv
```

## Output columns

| Column | Description |
|---|---|
| platform | Source platform |
| post_url | Direct link to the post/review/comment |
| author_username | Handle or username |
| author_full_name | Name if visible |
| author_title | Job title if visible |
| author_company | Company if visible |
| post_text | Truncated to 500 chars |
| keyword_matched | Which pain keyword triggered |
| product_signal | Reconciliation / Chargebacks / TruROI / Loop Chat |
| date_posted | ISO date if available |
| relevance_score | 1–3 (auto-scored: keyword density + persona match) |
