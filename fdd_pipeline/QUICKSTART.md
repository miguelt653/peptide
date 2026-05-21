# FDD Pipeline — Quick Start

## Install dependencies

```bash
pip install -r requirements.txt
```

## Run the full pipeline

```bash
python fdd_pipeline.py --creds /path/to/service-account.json
```

## Run individual steps

```bash
# Step 1 only — scrape brand list (writes /tmp/fdd_work/brands.json)
python fdd_pipeline.py --step scrape

# Step 2 only — download PDFs to /tmp/fdd_pdfs/
python fdd_pipeline.py --step download

# Step 3 only — extract franchisee data from downloaded PDFs
python fdd_pipeline.py --step extract

# Steps 4-5 — write extracted data to Google Sheets
python fdd_pipeline.py --step sheets --creds /path/to/service-account.json
```

## Google Sheets setup (one-time)

1. Go to https://console.cloud.google.com/
2. Enable **Google Sheets API** and **Google Drive API**
3. Create a **Service Account** → download the JSON key
4. Share your Google Sheet with the service account email (Editor access)
5. Pass the JSON key path via `--creds` or `GOOGLE_CREDS_PATH` env var

## Output locations

| Path | Contents |
|------|----------|
| `/tmp/fdd_pdfs/` | Downloaded PDFs |
| `/tmp/fdd_work/brands.json` | Scraped brand list |
| `/tmp/fdd_work/completed_brands.txt` | Checkpoint file (resume support) |
| `/tmp/fdd_work/failed_downloads.txt` | Download failures |
| `/tmp/fdd_work/extraction_failures.txt` | PDFs with no franchisee data |
| `/tmp/fdd_work/run.log` | Full run log |

## Resume after interruption

Re-running the script automatically skips brands listed in `completed_brands.txt`
and PDFs already downloaded. No data is lost.
