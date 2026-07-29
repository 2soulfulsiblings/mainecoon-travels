"""
Scores TikTok videos on viral-building relevance for Traveling Maine Coons.
Returns a 0-100 score and a breakdown dict for reporting.
"""

from datetime import datetime, timezone
from . import config


def score_video(video: dict) -> tuple[float, dict]:
    """
    Takes a normalized video dict, returns (score_0_to_100, breakdown).

    Expected video dict keys:
        id, desc, author_username, author_followers,
        views, likes, comments, shares, created_at (datetime)
    """
    breakdown = {}

    breakdown["engagement_rate"] = _score_engagement(
        video.get("views", 0),
        video.get("likes", 0),
        video.get("comments", 0),
    )

    breakdown["view_count"] = _score_views(video.get("views", 0))

    desc = (video.get("desc", "") + " " + video.get("author_username", "")).lower()
    breakdown["keyword_match"] = _score_keywords(desc)

    breakdown["creator_size"] = _score_creator_size(video.get("author_followers", 0))

    breakdown["recency"] = _score_recency(video.get("created_at"))

    total = sum(
        breakdown[key] * config.SCORING_WEIGHTS[key]
        for key in config.SCORING_WEIGHTS
    )

    return round(total * 100, 1), breakdown


def _score_engagement(views: int, likes: int, comments: int) -> float:
    """Returns 0-1 based on (likes + comments) / views."""
    if views < config.MIN_VIEWS:
        return 0.0
    rate = (likes + comments) / views
    if rate >= config.ENGAGEMENT_RATE_GREAT:
        return 1.0
    if rate >= config.ENGAGEMENT_RATE_GOOD:
        return 0.6 + (rate - config.ENGAGEMENT_RATE_GOOD) / (
            config.ENGAGEMENT_RATE_GREAT - config.ENGAGEMENT_RATE_GOOD
        ) * 0.4
    return min(rate / config.ENGAGEMENT_RATE_GOOD, 1.0) * 0.6


def _score_views(views: int) -> float:
    """Returns 0-1 log-scaled so 1M views = 1.0."""
    if views < config.MIN_VIEWS:
        return 0.0
    import math
    return min(math.log10(views) / 6.0, 1.0)  # log10(1_000_000) = 6


def _score_keywords(text: str) -> float:
    """Returns 0-1 based on keyword hit ratio."""
    if not text:
        return 0.0

    hits = sum(1 for kw in config.RELEVANCE_KEYWORDS if kw in text)
    penalties = sum(1 for kw in config.NEGATIVE_KEYWORDS if kw in text)

    raw = hits / max(len(config.RELEVANCE_KEYWORDS), 1)
    penalty = penalties * 0.2
    return max(0.0, min(raw - penalty, 1.0))


def _score_creator_size(followers: int) -> float:
    """
    Peaks at 1.0 in the micro-influencer sweet spot.
    Outside that range the score tapers off -- mega-creators are hard
    to engage with, and tiny accounts may not help with viral reach.
    """
    lo = config.CREATOR_SWEET_SPOT_MIN
    hi = config.CREATOR_SWEET_SPOT_MAX

    if followers < lo:
        return followers / lo
    if followers <= hi:
        return 1.0
    # Taper above the sweet spot
    overshot = (followers - hi) / hi
    return max(0.0, 1.0 - overshot * 0.5)


def _score_recency(created_at) -> float:
    """Returns 1.0 if posted within RECENCY_DAYS, scales down linearly after."""
    if created_at is None:
        return 0.5  # unknown -- neutral

    now = datetime.now(timezone.utc)
    if created_at.tzinfo is None:
        created_at = created_at.replace(tzinfo=timezone.utc)

    age_days = (now - created_at).total_seconds() / 86400
    if age_days <= config.RECENCY_DAYS:
        return 1.0
    return max(0.0, 1.0 - (age_days - config.RECENCY_DAYS) / 30)


def label(score: float) -> str:
    if score >= 75:
        return "HOT"
    if score >= 55:
        return "STRONG"
    if score >= 35:
        return "WATCH"
    return "LOW"
