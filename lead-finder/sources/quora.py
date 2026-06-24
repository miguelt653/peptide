"""Quora scraper via Playwright (JS-rendered). Searches public question/answer pages.

Playwright renders the page before parsing, handling Quora's client-side rendering.
Requires: pip install playwright && playwright install chromium
"""
from utils import make_lead, polite_sleep
from config import ALL_KEYWORDS


def scrape(dry_run=False):
    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        print("  ! quora: playwright not installed. Run: pip install playwright && playwright install chromium")
        return []

    leads = []
    seen = set()
    # Use a narrower set of high-intent keywords for Quora to limit run time
    quora_keywords = [kw for kw in ALL_KEYWORDS if any(
        term in kw for term in ["reconcil", "chargeback", "doordash", "uber eats",
                                "payout", "restaurant", "franchise", "reporting"]
    )][:15]

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
            viewport={"width": 1280, "height": 800},
        )
        page = context.new_page()

        for kw in quora_keywords:
            url = f"https://www.quora.com/search?q={kw.replace(' ', '+')}&type=question"
            try:
                page.goto(url, timeout=30000, wait_until="domcontentloaded")
                page.wait_for_timeout(3000)

                # Grab question links
                links = page.eval_on_selector_all(
                    "a[href*='/What'], a[href*='/How'], a[href*='/Why'], a[href*='/Can'], a[href*='/Is']",
                    "els => els.slice(0,10).map(e => ({href: e.href, text: e.innerText}))"
                )
                for lnk in links:
                    href = lnk.get("href", "")
                    q_text = lnk.get("text", "").strip()
                    if not href or href in seen or not q_text:
                        continue
                    seen.add(href)

                    # Visit the question page to get top answer text
                    try:
                        qpage = context.new_page()
                        qpage.goto(href, timeout=20000, wait_until="domcontentloaded")
                        qpage.wait_for_timeout(2000)
                        answer_els = qpage.query_selector_all(".q-box.spacing_log_answer_content")
                        answer_text = " ".join(el.inner_text() for el in answer_els[:2])[:500]

                        author_el = qpage.query_selector(".q-text.qu-bold")
                        author = author_el.inner_text().strip() if author_el else ""

                        qpage.close()
                    except Exception:
                        answer_text = ""
                        author = ""

                    lead = make_lead(
                        platform="Quora",
                        url=href,
                        text=answer_text,
                        title=q_text,
                        author_username=author,
                    )
                    if lead:
                        leads.append(lead)
                        if dry_run:
                            print(f"  [quora][{lead['relevance_score']}] {q_text[:70]}")

                polite_sleep()
            except Exception as e:
                print(f"  ! quora '{kw}': {e}")

        browser.close()

    return leads
