#!/usr/bin/env python3
"""
FDD Pipeline — Restaurant Finance Monitor
Scrapes brand PDFs, extracts franchisee data, writes to Google Sheets.

Usage:
    python fdd_pipeline.py                  # Full run
    python fdd_pipeline.py --step scrape    # Only scrape brand list
    python fdd_pipeline.py --step download  # Only download PDFs
    python fdd_pipeline.py --step extract   # Only extract from downloaded PDFs
    python fdd_pipeline.py --step sheets    # Only write to Google Sheets

Prerequisites:
    pip install requests beautifulsoup4 pdfplumber pymupdf gspread \
                google-auth google-auth-oauthlib pandas openpyxl

    For Google Sheets: set GOOGLE_CREDS_PATH env var or pass --creds flag
    pointing to your service account JSON key file.
"""
from __future__ import annotations

import argparse
import json
import os
import re
import sys
import time
import traceback
from datetime import datetime
from pathlib import Path

import requests
from bs4 import BeautifulSoup

# ── constants ───────────────────────────────────────────────────────────────

FDD_INDEX_URL = (
    "https://www.restfinance.com/the-monitor-archive/fdd-database/"
    "fdd-database-html/html_10f546de-7081-11eb-bd76-d75a0023f83a.html"
)
PDF_BASE_URL = "https://www.restfinance.com/app/pdf/fdd/"
PDF_DIR = Path("/tmp/fdd_pdfs")
WORK_DIR = Path("/tmp/fdd_work")

BRANDS_JSON = WORK_DIR / "brands.json"
FAILED_DOWNLOADS = WORK_DIR / "failed_downloads.txt"
EXTRACTION_FAILURES = WORK_DIR / "extraction_failures.txt"
COMPLETED_BRANDS = WORK_DIR / "completed_brands.txt"
SUMMARY_JSON = WORK_DIR / "summary.json"
RUN_LOG = WORK_DIR / "run.log"

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5",
    "Accept-Encoding": "gzip, deflate, br",
    "Connection": "keep-alive",
}

FRANCHISEE_KEYWORDS = [
    "item 20",
    "franchisee",
    "current franchisees",
    "list of franchisees",
    "franchise owners",
    "schedule a",
    "schedule b",
    "exhibit a",
    "exhibit b",
    "exhibit i",
    "exhibit j",
    "exhibit k",
    "appendix a",
    "outlet information",
    "open outlets",
]

GOOGLE_SHEET_NAME = "FDD Franchisee Database"
SHEETS_PAUSE = 2          # seconds between brand tab writes
MAX_SHEET_RETRIES = 5


# ── logging ─────────────────────────────────────────────────────────────────

def log(msg: str, level: str = "INFO"):
    ts = datetime.now().strftime("%H:%M:%S")
    line = f"[{ts}] [{level}] {msg}"
    print(line, flush=True)
    with open(RUN_LOG, "a") as f:
        f.write(line + "\n")


# ── setup ────────────────────────────────────────────────────────────────────

def setup_dirs():
    PDF_DIR.mkdir(parents=True, exist_ok=True)
    WORK_DIR.mkdir(parents=True, exist_ok=True)


# ── STEP 1: scrape brand list ────────────────────────────────────────────────

def scrape_brands() -> list[dict]:
    """Fetch the FDD index page and extract every brand + PDF URL."""
    log("Fetching FDD index page …")
    try:
        resp = requests.get(FDD_INDEX_URL, headers=HEADERS, timeout=30)
        resp.raise_for_status()
    except requests.HTTPError as e:
        log(f"HTTP error fetching index: {e}", "ERROR")
        log("The site may be blocking this IP. Try running from a residential connection.", "ERROR")
        sys.exit(1)
    except requests.RequestException as e:
        log(f"Network error: {e}", "ERROR")
        sys.exit(1)

    soup = BeautifulSoup(resp.text, "html.parser")
    brands = []
    seen_urls = set()

    # Strategy 1: find all <a> tags whose href contains /app/pdf/fdd/
    for a in soup.find_all("a", href=True):
        href = a["href"]
        if "/app/pdf/fdd/" in href and href.endswith(".pdf"):
            full_url = href if href.startswith("http") else "https://www.restfinance.com" + href
            if full_url in seen_urls:
                continue
            seen_urls.add(full_url)
            filename = full_url.split("/")[-1]           # e.g. Subway-2024.pdf
            brand_raw = filename.replace(".pdf", "")     # e.g. Subway-2024
            # Detect trailing -YYYY
            year_match = re.search(r"-(\d{4})$", brand_raw)
            if year_match:
                year = year_match.group(1)
                brand_slug = brand_raw[: year_match.start()]
            else:
                year = ""
                brand_slug = brand_raw
            brand_name = brand_slug.replace("-", " ").strip()
            link_text = a.get_text(strip=True)
            if link_text:
                brand_name = link_text
            brands.append(
                {
                    "brand_name": brand_name,
                    "brand_slug": brand_slug,
                    "year": year,
                    "pdf_url": full_url,
                    "filename": filename,
                }
            )

    # Strategy 2: if Strategy 1 found nothing, look for text links with brand names
    # alongside a pattern-matched URL
    if not brands:
        log("No /app/pdf/fdd/ links found — trying text-pattern extraction …", "WARN")
        for a in soup.find_all("a", href=True):
            href = a["href"]
            if "pdf" in href.lower() and href not in seen_urls:
                full_url = href if href.startswith("http") else "https://www.restfinance.com" + href
                seen_urls.add(full_url)
                text = a.get_text(strip=True)
                brands.append(
                    {
                        "brand_name": text or full_url.split("/")[-1],
                        "brand_slug": full_url.split("/")[-1].replace(".pdf", ""),
                        "year": "",
                        "pdf_url": full_url,
                        "filename": full_url.split("/")[-1],
                    }
                )

    log(f"Found {len(brands)} brands on the index page.")
    if brands:
        log("Sample brands: " + ", ".join(b["brand_name"] for b in brands[:5]))

    # Persist for downstream steps
    with open(BRANDS_JSON, "w") as f:
        json.dump(brands, f, indent=2)
    log(f"Brand list saved to {BRANDS_JSON}")
    return brands


def load_brands() -> list[dict]:
    if not BRANDS_JSON.exists():
        log("brands.json not found — run with --step scrape first.", "ERROR")
        sys.exit(1)
    with open(BRANDS_JSON) as f:
        return json.load(f)


# ── STEP 2: download PDFs ────────────────────────────────────────────────────

def download_pdfs(brands: list[dict]):
    """Download every brand PDF into PDF_DIR with progress + failure logging."""
    total = len(brands)
    failed = []

    for i, brand in enumerate(brands, 1):
        dest = PDF_DIR / brand["filename"]
        if dest.exists() and dest.stat().st_size > 1024:
            log(f"  Already exists, skipping {i}/{total}: {brand['brand_name']}")
            continue

        log(f"  Downloading {i}/{total}: {brand['brand_name']} ← {brand['pdf_url']}")
        try:
            resp = requests.get(brand["pdf_url"], headers=HEADERS, timeout=60, stream=True)
            resp.raise_for_status()
            with open(dest, "wb") as f:
                for chunk in resp.iter_content(chunk_size=8192):
                    f.write(chunk)
            size_kb = dest.stat().st_size // 1024
            log(f"    Saved {size_kb} KB → {dest.name}")
        except Exception as e:
            log(f"    FAILED: {e}", "WARN")
            failed.append({"brand": brand["brand_name"], "url": brand["pdf_url"], "error": str(e)})
            if dest.exists():
                dest.unlink()

        # Polite delay
        time.sleep(1.5)

    with open(FAILED_DOWNLOADS, "w") as f:
        for item in failed:
            f.write(f"{item['brand']}\t{item['url']}\t{item['error']}\n")

    log(f"Download complete. {total - len(failed)}/{total} succeeded. "
        f"{len(failed)} failures logged to {FAILED_DOWNLOADS}")
    return failed


# ── STEP 3: extract franchisee data ─────────────────────────────────────────

def find_franchisee_pages_pdfplumber(pdf_path: Path) -> list[int]:
    """Return page indices (0-based) where franchisee content starts."""
    import pdfplumber
    trigger_pages = []
    with pdfplumber.open(pdf_path) as pdf:
        for i, page in enumerate(pdf.pages):
            text = (page.extract_text() or "").lower()
            if any(kw in text for kw in FRANCHISEE_KEYWORDS):
                trigger_pages.append(i)
    return trigger_pages


def extract_tables_pdfplumber(pdf_path: Path, start_page: int) -> list[list]:
    """Extract structured rows from start_page onward using pdfplumber."""
    import pdfplumber
    rows = []
    with pdfplumber.open(pdf_path) as pdf:
        total = len(pdf.pages)
        # Look up to 80 pages beyond start, or to the end
        end_page = min(start_page + 80, total)
        for page_idx in range(start_page, end_page):
            page = pdf.pages[page_idx]
            # Try table extraction first
            tables = page.extract_table()
            if tables:
                for row in tables:
                    cleaned = [cell.strip() if cell else "" for cell in row]
                    if any(cleaned):
                        rows.append(cleaned)
            else:
                # Fall back to line-by-line text
                text = page.extract_text() or ""
                for line in text.splitlines():
                    line = line.strip()
                    if line:
                        rows.append([line])
    return rows


def extract_tables_pymupdf(pdf_path: Path, start_page: int) -> list[list]:
    """Fallback extraction using PyMuPDF."""
    import fitz
    rows = []
    doc = fitz.open(str(pdf_path))
    total = doc.page_count
    end_page = min(start_page + 80, total)
    for page_idx in range(start_page, end_page):
        page = doc[page_idx]
        text = page.get_text("text")
        for line in text.splitlines():
            line = line.strip()
            if line:
                rows.append([line])
    doc.close()
    return rows


def parse_franchisee_rows(raw_rows: list[list]) -> list[dict]:
    """
    Normalise raw table/text rows into structured franchisee dicts.
    Handles multi-column tables and single-line text blobs.
    """
    records = []

    # If rows are multi-column (from pdfplumber table), try to map columns
    if raw_rows and len(raw_rows[0]) >= 4:
        # Heuristic column mapping from header row
        header = [c.lower() for c in raw_rows[0]]
        col_map = _guess_column_map(header)
        for row in raw_rows[1:]:
            if len(row) < 2 or all(c == "" for c in row):
                continue
            rec = _map_row_to_record(row, col_map)
            if rec:
                records.append(rec)
    else:
        # Plain text — try to parse structured lines
        records = _parse_text_lines(raw_rows)

    return records


def _guess_column_map(header: list[str]) -> dict:
    """Map column indices to field names based on header text."""
    mapping = {}
    field_hints = {
        "franchisee_name": ["name", "franchisee", "owner", "entity", "licensee"],
        "address": ["address", "street", "addr"],
        "city": ["city"],
        "state": ["state", "st"],
        "zip": ["zip", "postal", "code"],
        "phone": ["phone", "telephone", "tel", "fax"],
        "notes": ["date", "opened", "agreement", "status", "outlet"],
    }
    for field, hints in field_hints.items():
        for idx, col in enumerate(header):
            if any(h in col for h in hints) and idx not in mapping.values():
                mapping[field] = idx
                break
    return mapping


def _map_row_to_record(row: list[str], col_map: dict) -> dict | None:
    def get(field):
        idx = col_map.get(field)
        return row[idx].strip() if idx is not None and idx < len(row) else ""

    name = get("franchisee_name")
    if not name:
        # Fall back to first non-empty cell
        for cell in row:
            if cell.strip():
                name = cell.strip()
                break
    if not name:
        return None

    return {
        "franchisee_name": name,
        "address": get("address"),
        "city": get("city"),
        "state": get("state"),
        "zip": get("zip"),
        "phone": get("phone"),
        "notes": get("notes"),
    }


def _parse_text_lines(raw_rows: list[list]) -> list[dict]:
    """
    Parse loosely formatted text lines.
    Looks for patterns like: Name | Address | City, ST ZIP | Phone
    """
    records = []
    # Join each row's cells into a single line
    lines = []
    for row in raw_rows:
        line = "  ".join(c for c in row if c).strip()
        if line:
            lines.append(line)

    # Heuristic: lines with a state abbreviation look like address lines
    state_pat = re.compile(
        r'\b([A-Z]{2})\s+(\d{5}(?:-\d{4})?)\b'
    )
    phone_pat = re.compile(
        r'\(?\d{3}\)?[\s.\-]?\d{3}[\s.\-]?\d{4}'
    )

    i = 0
    while i < len(lines):
        line = lines[i]
        # Skip obvious headers / page numbers
        if re.match(r'^(page|item|exhibit|schedule|\d+)$', line.lower()):
            i += 1
            continue

        state_m = state_pat.search(line)
        if state_m:
            # This looks like an address line; group with the previous line as name
            name = lines[i - 1].strip() if i > 0 else ""
            address_part = line[: state_m.start()].strip().rstrip(",")
            city_state = line[: state_m.start()].rsplit(",", 1)
            city = city_state[-1].strip() if len(city_state) > 1 else ""
            address = city_state[0].strip() if len(city_state) > 1 else address_part
            state = state_m.group(1)
            zip_code = state_m.group(2)
            phone_m = phone_pat.search(line)
            phone = phone_m.group(0) if phone_m else ""
            records.append(
                {
                    "franchisee_name": name,
                    "address": address,
                    "city": city,
                    "state": state,
                    "zip": zip_code,
                    "phone": phone,
                    "notes": "",
                }
            )
            i += 1
        else:
            i += 1

    return records


def extract_franchisees_from_pdf(pdf_path: Path) -> list[dict]:
    """
    Full extraction flow: find franchisee section, extract tables/text,
    normalise into records. Tries pdfplumber first, PyMuPDF as fallback.
    """
    # --- pdfplumber pass ---
    try:
        import pdfplumber
        trigger_pages = find_franchisee_pages_pdfplumber(pdf_path)
        if trigger_pages:
            start = trigger_pages[0]
            raw = extract_tables_pdfplumber(pdf_path, start)
            records = parse_franchisee_rows(raw)
            if records:
                return records
    except Exception as e:
        log(f"    pdfplumber error on {pdf_path.name}: {e}", "WARN")

    # --- PyMuPDF fallback ---
    try:
        import fitz
        doc = fitz.open(str(pdf_path))
        trigger_page = 0
        for idx in range(doc.page_count):
            text = doc[idx].get_text("text").lower()
            if any(kw in text for kw in FRANCHISEE_KEYWORDS):
                trigger_page = idx
                break
        doc.close()
        raw = extract_tables_pymupdf(pdf_path, trigger_page)
        records = parse_franchisee_rows(raw)
        return records
    except Exception as e:
        log(f"    PyMuPDF error on {pdf_path.name}: {e}", "WARN")

    return []


def extract_all_franchisees(brands: list[dict]) -> dict[str, list[dict]]:
    """Extract franchisee data for all downloaded PDFs."""
    completed = load_completed()
    results = {}
    extraction_fails = []
    total = len(brands)

    for i, brand in enumerate(brands, 1):
        name = brand["brand_name"]
        if name in completed:
            log(f"  [{i}/{total}] SKIP (already done): {name}")
            continue

        pdf_path = PDF_DIR / brand["filename"]
        if not pdf_path.exists():
            log(f"  [{i}/{total}] SKIP (no PDF): {name}", "WARN")
            continue

        log(f"  [{i}/{total}] Extracting: {name} ({brand['filename']})")
        try:
            records = extract_franchisees_from_pdf(pdf_path)
        except Exception as e:
            log(f"    Unhandled error: {e}", "ERROR")
            records = []

        if records:
            log(f"    → {len(records)} franchisee records found")
            results[name] = records
        else:
            log(f"    → No franchisee data extracted", "WARN")
            extraction_fails.append(brand["brand_name"])

    with open(EXTRACTION_FAILURES, "w") as f:
        for b in extraction_fails:
            f.write(b + "\n")

    log(f"Extraction complete: {len(results)} brands with data, "
        f"{len(extraction_fails)} with no data.")
    return results


# ── STEP 4–5: Google Sheets ──────────────────────────────────────────────────

def get_gspread_client(creds_path: str):
    """Return an authenticated gspread client from a service account JSON."""
    import gspread
    from google.oauth2.service_account import Credentials

    scopes = [
        "https://www.googleapis.com/auth/spreadsheets",
        "https://www.googleapis.com/auth/drive",
    ]
    creds = Credentials.from_service_account_file(creds_path, scopes=scopes)
    return gspread.authorize(creds)


def sheets_retry(fn, *args, **kwargs):
    """Call fn with exponential backoff on API errors."""
    import gspread
    for attempt in range(MAX_SHEET_RETRIES):
        try:
            return fn(*args, **kwargs)
        except gspread.exceptions.APIError as e:
            if attempt == MAX_SHEET_RETRIES - 1:
                raise
            wait = 2 ** (attempt + 1)
            log(f"    Sheets API error (attempt {attempt+1}): {e} — retrying in {wait}s …", "WARN")
            time.sleep(wait)


def open_or_create_sheet(gc, sheet_name: str):
    """Open existing sheet or create a new one."""
    import gspread
    try:
        return gc.open(sheet_name)
    except gspread.exceptions.SpreadsheetNotFound:
        log(f"Creating new Google Sheet: '{sheet_name}'")
        return gc.create(sheet_name)


def write_brand_tab(spreadsheet, brand_name: str, records: list[dict], year: str):
    """Write one brand's franchisee records to its own worksheet tab."""
    import gspread

    tab_name = brand_name[:100]  # Sheet tab names max 100 chars

    # Get or create worksheet
    try:
        ws = spreadsheet.worksheet(tab_name)
        sheets_retry(ws.clear)
    except gspread.exceptions.WorksheetNotFound:
        ws = sheets_retry(spreadsheet.add_worksheet, title=tab_name, rows=len(records) + 5, cols=7)

    headers = ["Franchisee Name", "Address", "City", "State", "Zip", "Phone", "Notes"]
    rows = [headers]
    for rec in records:
        rows.append([
            rec.get("franchisee_name", ""),
            rec.get("address", ""),
            rec.get("city", ""),
            rec.get("state", ""),
            rec.get("zip", ""),
            rec.get("phone", ""),
            rec.get("notes", ""),
        ])

    sheets_retry(ws.update, rows, value_input_option="RAW")
    log(f"    Wrote {len(records)} rows to tab '{tab_name}'")


def write_summary_tab(spreadsheet, summary_rows: list[list]):
    """Create/update the SUMMARY worksheet."""
    import gspread
    try:
        ws = spreadsheet.worksheet("SUMMARY")
        sheets_retry(ws.clear)
    except gspread.exceptions.WorksheetNotFound:
        ws = sheets_retry(spreadsheet.add_worksheet, title="SUMMARY", rows=500, cols=5)
        # Move summary to position 0
        try:
            spreadsheet.reorder_worksheets([ws] + [
                s for s in spreadsheet.worksheets() if s.title != "SUMMARY"
            ])
        except Exception:
            pass

    headers = ["Brand Name", "PDF Year", "Franchisee Count", "Status"]
    data = [headers] + summary_rows
    sheets_retry(ws.update, data, value_input_option="RAW")
    log(f"SUMMARY tab updated with {len(summary_rows)} brands.")


def write_to_sheets(
    brands: list[dict],
    extracted: dict[str, list[dict]],
    failed_downloads: list[str],
    creds_path: str,
):
    gc = get_gspread_client(creds_path)
    spreadsheet = open_or_create_sheet(gc, GOOGLE_SHEET_NAME)
    log(f"Opened sheet: {spreadsheet.url}")

    completed = load_completed()
    summary_rows = []
    total_records = 0

    brand_by_name = {b["brand_name"]: b for b in brands}

    for brand_name, records in extracted.items():
        if brand_name in completed:
            log(f"  SKIP (already written): {brand_name}")
            continue

        brand_meta = brand_by_name.get(brand_name, {})
        year = brand_meta.get("year", "")
        log(f"  Writing to Sheets: {brand_name} ({len(records)} records)")
        try:
            write_brand_tab(spreadsheet, brand_name, records, year)
            summary_rows.append([brand_name, year, len(records), "Success"])
            total_records += len(records)
            mark_completed(brand_name)
        except Exception as e:
            log(f"    ERROR writing {brand_name}: {e}", "ERROR")
            summary_rows.append([brand_name, year, 0, f"Write Error: {e}"])

        time.sleep(SHEETS_PAUSE)

    # Add no-data and failed entries to summary
    all_brand_names = {b["brand_name"] for b in brands}
    extracted_names = set(extracted.keys())
    failed_dl_names = set(failed_downloads)

    for brand_name in all_brand_names - extracted_names - failed_dl_names:
        brand_meta = brand_by_name.get(brand_name, {})
        summary_rows.append([brand_name, brand_meta.get("year", ""), 0, "No Data"])

    for brand_name in failed_dl_names:
        brand_meta = brand_by_name.get(brand_name, {})
        summary_rows.append([brand_name, brand_meta.get("year", ""), 0, "Download Failed"])

    write_summary_tab(spreadsheet, summary_rows)
    log(f"Total records written to Sheets: {total_records}")
    return total_records


# ── checkpoint helpers ───────────────────────────────────────────────────────

def load_completed() -> set[str]:
    if not COMPLETED_BRANDS.exists():
        return set()
    return set(COMPLETED_BRANDS.read_text().splitlines())


def mark_completed(brand_name: str):
    with open(COMPLETED_BRANDS, "a") as f:
        f.write(brand_name + "\n")


# ── main orchestrator ────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="FDD Pipeline")
    parser.add_argument(
        "--step",
        choices=["scrape", "download", "extract", "sheets", "all"],
        default="all",
        help="Which step(s) to run (default: all)",
    )
    parser.add_argument(
        "--creds",
        default=os.environ.get("GOOGLE_CREDS_PATH", ""),
        help="Path to Google service account JSON key",
    )
    parser.add_argument(
        "--brands-json",
        default="",
        help="Override path to brands.json (skip scraping)",
    )
    args = parser.parse_args()

    setup_dirs()
    start_time = time.time()
    log("=" * 60)
    log("FDD Pipeline starting")
    log(f"Step: {args.step} | PDF dir: {PDF_DIR} | Work dir: {WORK_DIR}")
    log("=" * 60)

    # ── Step 1 ──
    if args.step in ("scrape", "all"):
        brands = scrape_brands()
        print(f"\n{'='*60}")
        print(f"  BRAND LIST SCRAPED: {len(brands)} brands found")
        print(f"  Saved to: {BRANDS_JSON}")
        print(f"{'='*60}\n")

        if args.step == "scrape":
            return

        print("Proceeding to download all PDFs …")
    else:
        brands = load_brands()
        log(f"Loaded {len(brands)} brands from {BRANDS_JSON}")

    # ── Step 2 ──
    failed_downloads: list[str] = []
    if args.step in ("download", "all"):
        log(f"\n--- STEP 2: Downloading {len(brands)} PDFs ---")
        failed_info = download_pdfs(brands)
        failed_downloads = [f["brand"] for f in failed_info]
        if args.step == "download":
            return

    # ── Step 3 ──
    extracted: dict[str, list[dict]] = {}
    if args.step in ("extract", "all"):
        log("\n--- STEP 3: Extracting franchisee data ---")
        extracted = extract_all_franchisees(brands)
        if args.step == "extract":
            # Print sample
            for bname, recs in list(extracted.items())[:3]:
                print(f"\n{bname}: {len(recs)} records (sample: {recs[:2]})")
            return

    # ── Step 4–5 ──
    if args.step in ("sheets", "all"):
        if not args.creds:
            print("\n" + "=" * 60)
            print("GOOGLE SHEETS SETUP REQUIRED")
            print("=" * 60)
            print("""
No Google credentials file found.  To set up access:

  1. Go to https://console.cloud.google.com/
  2. Create a project (or select an existing one)
  3. Enable the Google Sheets API and Google Drive API:
       APIs & Services → Library → search "Google Sheets API" → Enable
       APIs & Services → Library → search "Google Drive API" → Enable
  4. Create a service account:
       APIs & Services → Credentials → Create Credentials → Service Account
       Give it a name, click "Done"
  5. Create a JSON key:
       Click the service account → Keys tab → Add Key → Create new key → JSON
       Download the JSON file
  6. Share your Google Sheet with the service account email
     (it will look like: name@project.iam.gserviceaccount.com)
     Give it "Editor" access
  7. Run this script again with:
       python fdd_pipeline.py --creds /path/to/your-key.json
     OR set the environment variable:
       export GOOGLE_CREDS_PATH=/path/to/your-key.json
""")
            sys.exit(0)

        log("\n--- STEP 4-5: Writing to Google Sheets ---")
        total_records = write_to_sheets(brands, extracted, failed_downloads, args.creds)

    # ── Final summary ──
    elapsed = time.time() - start_time
    mins, secs = divmod(int(elapsed), 60)
    completed = load_completed()

    print("\n" + "=" * 60)
    print("FINAL SUMMARY")
    print("=" * 60)
    print(f"  Total brands attempted:          {len(brands)}")
    print(f"  Brands with data written:        {len(completed)}")
    print(f"  PDF download failures:           {len(failed_downloads)}")
    extraction_fail_count = sum(
        1 for b in brands
        if b["brand_name"] not in extracted
        and b["brand_name"] not in failed_downloads
        and (PDF_DIR / b["filename"]).exists()
    )
    print(f"  PDFs with no franchisee data:    {extraction_fail_count}")
    print(f"  Total runtime:                   {mins}m {secs}s")
    print("=" * 60)


if __name__ == "__main__":
    main()
