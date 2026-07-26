# 👋 Start Here — Loop AI Lead Finder

This tool finds restaurant operators and finance leaders **publicly complaining online** about the exact problems Loop solves — so you can reach out with a message that references what they actually said.

No coding needed. Here's the whole thing in 3 steps.

---

## Step 1 — Download the tool to your Mac

1. Go to the project on GitHub: **https://github.com/miguelt653/peptide**
2. Click the green **Code** button → **Download ZIP**
3. Open your **Downloads** folder and double-click the ZIP to unzip it
4. Open the unzipped folder, then open the **`lead-finder`** folder inside it

> 💡 Make sure you're on the right version: the branch is `claude/sharp-maxwell-g1o5dz`. If the Download ZIP gives you the wrong files, ask whoever set up the repo to merge the pull request first.

---

## Step 2 — Run setup (one double-click)

Inside the `lead-finder` folder, **double-click `setup.command`**.

A black window (Terminal) opens and does everything automatically:
- installs what it needs
- tests that it works
- helps you connect Reddit (the best lead source)

> ⚠️ **First time only:** Mac may say *"setup.command cannot be opened because it is from an unidentified developer."*
> Fix: **right-click** the file → **Open** → click **Open** in the popup. You only do this once.

When it asks, follow the on-screen steps to get your free Reddit key (takes 2 minutes). If you'd rather skip Reddit for now, that's fine — Hacker News works without it.

---

## Step 3 — Find leads (one double-click)

Whenever you want fresh leads, **double-click `run.command`**.

When it finishes, your leads open automatically in the **`output`** folder as a
spreadsheet named like `loop_pain_signals_2026-06-24.csv`. Open it in **Excel**
or **Google Sheets**.

---

## What you get

Each row is one person who expressed a pain point, sorted with the **hottest leads at the top**:

| Column | What it tells you |
|---|---|
| **relevance_score** | 1–3. A **3** means they hit multiple pain points AND look like a real operator — call these first. |
| **product_signal** | Which Loop product to lead with: Reconciliation, Chargebacks, TruROI, or Loop Chat. |
| **post_text** | What they actually wrote — paste a snippet into your outreach so it feels personal. |
| **post_url** | Link to the original post so you can see the full context and who they are. |
| **platform** | Where it came from (Reddit, Hacker News, a review site, etc.) |

---

## Honest expectations

- **Reddit and Hacker News are the reliable sources.** They'll give you most of your good leads, week after week.
- **The review sites (G2, Trustpilot, etc.) are bonus** — they sometimes block scrapers or change their pages, so they may return little or nothing on a given day. That's normal, not broken.
- Run it **once a week** for a fresh batch. Re-running won't give you duplicates — each file is that run's findings.

---

## Something went wrong?

- **"cannot be opened / unidentified developer"** → right-click the file → Open (see Step 2).
- **"Python 3 is not installed"** → the setup window tells you where to download it; install, then double-click setup again.
- **Reddit leads are empty** → your key probably isn't pasted correctly. Double-click `setup.command` again and re-do the credentials file.
- **Anything else** → take a screenshot of the black window and send it over.
