# TikTok Viral Tracker -- Setup Guide

**This runs in dry-run / sample-data mode only.** It does not scrape or connect to TikTok
at all -- it generates a report from fake sample data so you can see the report format and
scoring logic. Trigger it manually from the **Actions** tab whenever you want a fresh copy;
it saves to `reports/YYYY-MM-DD.md`.

Real TikTok scraping was intentionally left disabled. The original version of this tracker
used an unofficial, reverse-engineered TikTok API (`TikTokApi`) authenticated with a personal
session cookie from your TikTok account. That comes with real tradeoffs worth knowing about
before turning it on:
- It's not sanctioned by TikTok's Terms of Service, which carries some risk of your account
  getting flagged or the session getting throttled.
- The session cookie expires roughly every 2 weeks and needs manually refreshing (copying a
  value out of your browser's dev tools each time) or the live run silently stops finding
  anything.
- It's a personal login credential sitting in a GitHub Secret.

If you decide the tradeoffs are worth it later, here's how to flip it on:

## Turning On Live Mode (optional)

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

### Step 3: Re-add the scraping dependencies

Live mode needs `TikTokApi` and `playwright`, which the dry-run-only setup doesn't install.
Add them back to `requirements.txt`:
```
TikTokApi>=6.3.0
playwright>=1.40.0
```

### Step 4: Update the workflow

Edit `.github/workflows/daily-tiktok-scan.yml` to install playwright's browser and run
`python run_daily.py` (no `--dry-run` flag) using the `TIKTOK_MS_TOKEN` secret, and add back
a `schedule:` trigger if you want it to run automatically. Ask Claude to do this for you if
you'd rather not hand-edit YAML.

---

## Running Manually (dry run, always safe)
```bash
python run_daily.py --dry-run
```

---

## Reading the Report

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

## Customizing the Report

Edit `tiktok_tracker/config.py`:

- **HASHTAGS** -- add or remove hashtags to search
- **RELEVANCE_KEYWORDS** -- words that make a video more relevant to your niche
- **SCORING_WEIGHTS** -- change what matters most (engagement vs. reach vs. freshness)
- **CREATOR_SWEET_SPOT_MIN/MAX** -- adjust the follower range you want to target
- **TOP_N_VIDEOS** -- how many videos show up in the report

Note: since dry-run mode always scores the same fixed sample videos, these settings won't
change the sample report's *content* -- they only matter once live mode is turned on.

---

## Troubleshooting

**Want to run it right now** -- Go to **Actions** > **TikTok Viral Tracker (dry run)** > **Run workflow**.
