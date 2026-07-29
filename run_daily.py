#!/usr/bin/env python3
"""
Entry point for the daily TikTok viral tracker.

Usage:
    python run_daily.py                  # live run
    python run_daily.py --dry-run        # load sample data, no TikTok calls
"""

import argparse
import logging
import sys
from datetime import date, datetime, timezone

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger(__name__)


def main():
    parser = argparse.ArgumentParser(description="Traveling Maine Coons TikTok Viral Tracker")
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Skip TikTok API calls and generate a sample report instead",
    )
    args = parser.parse_args()

    run_date = date.today()
    logger.info("Starting TikTok Viral Tracker for %s", run_date.isoformat())

    if args.dry_run:
        logger.info("DRY RUN -- using sample data")
        videos = _sample_videos()
    else:
        try:
            from tiktok_tracker.tracker import run
            videos = run()
        except ImportError as e:
            logger.error("TikTokApi not installed: %s", e)
            logger.error("Run: pip install -r requirements.txt && playwright install")
            sys.exit(1)

    logger.info("Fetched %d unique videos", len(videos))

    from tiktok_tracker.reporter import build_report, save_report

    report = build_report(videos, run_date=run_date)
    dated_path, latest_path = save_report(report, run_date=run_date)

    logger.info("Report saved to %s", dated_path)
    logger.info("Latest report updated at %s", latest_path)

    # Print a short summary to stdout so GitHub Actions logs show it
    top = [v for v in videos if v["score"] >= 55][: 5]
    if top:
        print("\nTop finds today:")
        for v in top:
            print(f"  {v['score']:5.1f}  @{v['author_username']:25s}  {v['views']:>10,} views")
    else:
        print("No high-scoring videos found today.")


def _sample_videos():
    """Returns fake data so you can test the report format without TikTok credentials."""
    from datetime import timedelta
    from tiktok_tracker.scorer import score_video

    samples = [
        {
            "id": "sample_001",
            "url": "https://www.tiktok.com/@adventurecatmom/video/sample_001",
            "desc": "My Maine Coon loves van life! Road trip through New Orleans #mainecoon #vanlife #adventurecat",
            "created_at": datetime.now(timezone.utc) - timedelta(days=1),
            "author_username": "adventurecatmom",
            "author_display": "Adventure Cat Mom",
            "author_followers": 42_000,
            "views": 380_000,
            "likes": 52_000,
            "comments": 1_800,
            "shares": 4_200,
            "is_live": False,
            "source_hashtag": "mainecoon",
        },
        {
            "id": "sample_002",
            "url": "https://www.tiktok.com/@fluffytraveler/video/sample_002",
            "desc": "LIVE Q&A with my Maine Coons Stevie and Belle! #mainecooncat #cattok #catsoftiktok",
            "created_at": datetime.now(timezone.utc) - timedelta(hours=3),
            "author_username": "fluffytraveler",
            "author_display": "Fluffy Traveler",
            "author_followers": 18_500,
            "views": 95_000,
            "likes": 14_000,
            "comments": 2_100,
            "shares": 980,
            "is_live": True,
            "source_hashtag": "mainecooncat",
        },
        {
            "id": "sample_003",
            "url": "https://www.tiktok.com/@roadtripcats/video/sample_003",
            "desc": "Cat travel essentials for long road trips #travelingcats #roadtripcat #adventurecat",
            "created_at": datetime.now(timezone.utc) - timedelta(days=3),
            "author_username": "roadtripcats",
            "author_display": "Road Trip Cats",
            "author_followers": 8_700,
            "views": 62_000,
            "likes": 8_400,
            "comments": 610,
            "shares": 720,
            "is_live": False,
            "source_hashtag": "travelingcats",
        },
        {
            "id": "sample_004",
            "url": "https://www.tiktok.com/@vanlifer_cats/video/sample_004",
            "desc": "Van life with two maine coons -- morning routine #vanlifecat #mainecoon #catlover",
            "created_at": datetime.now(timezone.utc) - timedelta(days=2),
            "author_username": "vanlifer_cats",
            "author_display": "Van Life Cats",
            "author_followers": 77_000,
            "views": 1_200_000,
            "likes": 180_000,
            "comments": 9_200,
            "shares": 22_000,
            "is_live": False,
            "source_hashtag": "vanlifecat",
        },
        {
            "id": "sample_005",
            "url": "https://www.tiktok.com/@cattok_daily/video/sample_005",
            "desc": "When your cat is better at van life than you #cattok #vanlife #fluffycat",
            "created_at": datetime.now(timezone.utc) - timedelta(days=5),
            "author_username": "cattok_daily",
            "author_display": "CatTok Daily",
            "author_followers": 124_000,
            "views": 450_000,
            "likes": 38_000,
            "comments": 2_900,
            "shares": 5_100,
            "is_live": False,
            "source_hashtag": "cattok",
        },
    ]

    for v in samples:
        score, breakdown = score_video(v)
        v["score"] = score
        v["score_breakdown"] = breakdown

    samples.sort(key=lambda x: x["score"], reverse=True)
    return samples


if __name__ == "__main__":
    main()
