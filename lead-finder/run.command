#!/bin/bash
# Loop AI Lead Finder — find leads. Double-click this file in Finder.

cd "$(dirname "$0")" || exit 1

echo ""
echo "=================================================="
echo "   Loop AI Lead Finder — Finding leads..."
echo "=================================================="
echo ""

# Run the reliable sources. Reddit runs automatically if credentials are set.
python3 scrape.py --source hackernews

if grep -q "your_client_id_here" .env 2>/dev/null || [ ! -f .env ]; then
    echo ""
    echo "ℹ  Reddit not set up yet — skipping it (Hacker News still ran)."
    echo "   To unlock Reddit, run setup.command again."
else
    echo ""
    echo "Running Reddit (this takes a few minutes)..."
    python3 scrape.py --source reddit
fi

echo ""
echo "=================================================="
echo "   ✅ Done! Your leads are in the 'output' folder."
echo "      Open the newest loop_pain_signals_*.csv file"
echo "      in Excel or Google Sheets."
echo "=================================================="
echo ""

# Open the output folder in Finder
open output 2>/dev/null

read -p "Press Return to close..."
