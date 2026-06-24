#!/bin/bash
# Loop AI Lead Finder — one-click setup for Mac.
# Double-click this file in Finder. It installs everything and tests it.

cd "$(dirname "$0")" || exit 1

echo ""
echo "=================================================="
echo "   Loop AI Lead Finder — Setup"
echo "=================================================="
echo ""

# --- 1. Check for Python 3 -------------------------------------------------
if ! command -v python3 >/dev/null 2>&1; then
    echo "❌ Python 3 is not installed."
    echo ""
    echo "   Please install it first:"
    echo "   1. Go to https://www.python.org/downloads/"
    echo "   2. Download and run the macOS installer"
    echo "   3. Then double-click this setup file again"
    echo ""
    read -p "Press Return to close..."
    exit 1
fi

PYVER=$(python3 --version)
echo "✅ Found $PYVER"
echo ""

# --- 2. Install the required libraries -------------------------------------
echo "Installing required libraries (this may take a minute)..."
echo ""
python3 -m pip install --quiet --upgrade pip
if python3 -m pip install --quiet -r requirements.txt; then
    echo "✅ Libraries installed"
else
    echo "⚠  Some libraries failed to install. Trying the essentials only..."
    python3 -m pip install --quiet praw requests beautifulsoup4 pandas python-dotenv
fi
echo ""

# --- 3. Run the self-test --------------------------------------------------
echo "Testing that everything works..."
python3 scrape.py --self-test
echo ""

# --- 4. Set up the .env file for Reddit ------------------------------------
if [ ! -f .env ]; then
    cp .env.example .env
    echo "--------------------------------------------------"
    echo "📝 ONE MORE STEP to unlock Reddit (the best source):"
    echo ""
    echo "   1. Go to: https://www.reddit.com/prefs/apps"
    echo "   2. Click 'create another app' at the bottom"
    echo "   3. Choose 'script', name it anything,"
    echo "      set redirect URI to: http://localhost:8080"
    echo "   4. Copy the ID and secret into the file that's"
    echo "      about to open, then save and close it."
    echo "--------------------------------------------------"
    echo ""
    read -p "Press Return to open the credentials file..."
    open -e .env
fi

echo ""
echo "=================================================="
echo "   ✅ Setup complete!"
echo ""
echo "   To find leads: double-click 'run.command'"
echo "=================================================="
echo ""
read -p "Press Return to close..."
