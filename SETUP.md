# TikTok Viral Tracker -- Setup Guide

This tracker runs automatically every day at 9 AM Eastern and saves a report to `reports/YYYY-MM-DD.md`.

---

## One-Time Setup

### Step 1: Get your TikTok ms_token

This is a cookie value from your own TikTok browser session. You need to be logged in as your Traveling Maine Coons account.

1. Open TikTok.com in Chrome or Firefox and log in
2. Open Developer Tools (F12)
3. Go to **Application** > **Cookies** > `https://www.tiktok.com`
4. Find the cookie named **`msToken`**
5. Copy the value -- it's a long string of letters and numbers

### Step 2: Add the token as a GitHub Secret

1. Go to your repo on GitHub
2. Click **Settings** > **Secrets and variables** > **Actions**
3. Click **New repository secret**
4. Name: `TIKTOK_MS_TOKEN`
5. Value: paste the msToken value you copied
6. Click **Add secret**

That's it. The daily workflow will pick it up automatically.

---

## Running Manually

**Dry run (no TikTok login needed -- uses sample data):**
```bash
python run_daily.py --dry-run
```

**Live run (needs ms_token in your environment):**
```bash
export TIKTOK_MS_TOKEN="your_token_here"
python run_daily.py
```

---

## Reading Your Daily Report

Reports are saved in two places:
- `reports/latest.md` -- always the most recent report
- `reports/YYYY-MM-DD.md` -- one file per day (history stays in the repo)

**Score labels:**
| Label | Score | What to do |
| --- | --- | --- |
| HOT | 75-100 | Engage immediately -- like, comment, consider a duet |
| STRONG | 55-74 | Worth a follow and genuine comment |
| WATCH | 35-54 | Keep an eye on the creator |
| LOW | 0-34 | Skip |

**LIVE tag:** If you see `LIVE` next to a creator, they were live when the scan ran. Check if they're still live -- commenting during a live stream gets way more visibility than on a regular video.

---

## Customizing What Gets Tracked

Edit `tiktok_tracker/config.py`:

- **HASHTAGS** -- add or remove hashtags to search
- **RELEVANCE_KEYWORDS** -- words that make a video more relevant to your niche
- **SCORING_WEIGHTS** -- change what matters most (engagement vs. reach vs. freshness)
- **CREATOR_SWEET_SPOT_MIN/MAX** -- adjust the follower range you want to target
- **TOP_N_VIDEOS** -- how many videos show up in the report

---

## Troubleshooting

**"No videos found today"** -- Your ms_token may have expired (they last about 2 weeks). Refresh it using the steps in Step 1 above and update the GitHub Secret.

**Workflow doesn't run** -- Check the **Actions** tab in your GitHub repo to see if it's enabled. GitHub sometimes disables scheduled workflows on inactive repos.

**Want to run it right now** -- Go to **Actions** > **Daily TikTok Viral Tracker** > **Run workflow** > choose dry_run: true or false.
