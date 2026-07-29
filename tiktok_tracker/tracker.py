"""
Pulls videos from TikTok using the TikTokApi library (unofficial).
Requires MS_TOKEN set as an environment variable (see SETUP.md).
"""

import asyncio
import logging
import os
from datetime import datetime, timezone

from TikTokApi import TikTokApi

from . import config
from .scorer import score_video

logger = logging.getLogger(__name__)

MS_TOKEN = os.environ.get("TIKTOK_MS_TOKEN", "")


async def fetch_all_videos() -> list[dict]:
    """
    Searches every hashtag in config.HASHTAGS and returns a deduplicated,
    scored list of video dicts sorted by score descending.
    """
    seen_ids = set()
    videos = []

    async with TikTokApi() as api:
        await api.create_sessions(
            ms_tokens=[MS_TOKEN],
            num_sessions=1,
            sleep_after=3,
            headless=True,
        )

        for tag in config.HASHTAGS:
            logger.info("Searching hashtag: #%s", tag)
            try:
                tag_videos = await _fetch_hashtag(api, tag)
                for v in tag_videos:
                    if v["id"] not in seen_ids:
                        seen_ids.add(v["id"])
                        score, breakdown = score_video(v)
                        v["score"] = score
                        v["score_breakdown"] = breakdown
                        v["source_hashtag"] = tag
                        videos.append(v)
            except Exception as exc:
                logger.warning("Failed to fetch #%s: %s", tag, exc)
                continue

    videos.sort(key=lambda x: x["score"], reverse=True)
    return videos


async def _fetch_hashtag(api: TikTokApi, tag: str) -> list[dict]:
    """Pulls up to VIDEOS_PER_HASHTAG videos for a single hashtag."""
    results = []
    async for video in api.hashtag(name=tag).videos(count=config.VIDEOS_PER_HASHTAG):
        raw = video.as_dict
        normalized = _normalize(raw)
        if normalized["views"] >= config.MIN_VIEWS:
            results.append(normalized)
    return results


def _normalize(raw: dict) -> dict:
    """Flattens TikTokApi's raw video dict into the shape scorer.py expects."""
    stats = raw.get("stats", {})
    author = raw.get("author", {})

    created_ts = raw.get("createTime")
    created_at = (
        datetime.fromtimestamp(created_ts, tz=timezone.utc)
        if created_ts
        else None
    )

    return {
        "id": raw.get("id", ""),
        "url": f"https://www.tiktok.com/@{author.get('uniqueId', '')}/video/{raw.get('id', '')}",
        "desc": raw.get("desc", ""),
        "created_at": created_at,
        "author_username": author.get("uniqueId", ""),
        "author_display": author.get("nickname", ""),
        "author_followers": author.get("followerCount", 0),
        "views": stats.get("playCount", 0),
        "likes": stats.get("diggCount", 0),
        "comments": stats.get("commentCount", 0),
        "shares": stats.get("shareCount", 0),
        "is_live": raw.get("isLive", False) or raw.get("status") == "2",
    }


def run() -> list[dict]:
    """Synchronous entry point for run_daily.py."""
    return asyncio.run(fetch_all_videos())
