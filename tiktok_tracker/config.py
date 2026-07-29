"""
All search terms, scoring weights, and thresholds for the TikTok viral tracker.
Tuned specifically for Traveling Maine Coons content strategy.
"""

# --- Hashtags to monitor ---
# Mix of niche (high relevance) and broad (high traffic) tags
HASHTAGS = [
    # Core Maine Coon / travel cat niche
    "mainecoon",
    "mainecooncat",
    "travelingcats",
    "adventurecat",
    "vanlifecat",
    "catsofttiktok",
    "roadtripcat",
    # Lifestyle / travel crossover
    "vanlife",
    "cattok",
    "catlover",
    "catsoftiktok",
    # Niche discovery targets
    "mainecoonlover",
    "fluffycat",
    "bigcat",
    "catsofinstagram",
]

# --- Keywords that signal high relevance ---
# Found in video descriptions, captions, or creator bios
RELEVANCE_KEYWORDS = [
    "maine coon",
    "mainecoon",
    "traveling cat",
    "adventure cat",
    "van life",
    "vanlife",
    "road trip",
    "cat travel",
    "travel cat",
    "car cat",
    "cat adventures",
    "fluffy cat",
    "big cat",
    "cat mom",
    "cats on tour",
    "new orleans",
    "stevie",
    "jewels",
]

# --- Keywords that reduce relevance ---
NEGATIVE_KEYWORDS = [
    "dog",
    "puppy",
    "ferret",
    "hamster",
    "rabbit",
]

# --- Viral potential scoring weights (sum to 1.0) ---
SCORING_WEIGHTS = {
    "engagement_rate": 0.30,   # likes+comments / views
    "view_count":      0.25,   # raw reach
    "keyword_match":   0.20,   # content relevance
    "creator_size":    0.15,   # sweet spot for collab / follow
    "recency":         0.10,   # posted within last N days
}

# --- Thresholds ---
MIN_VIEWS = 1_000              # ignore tiny videos
MAX_VIEWS_FOR_CREATOR_SWEET_SPOT = 500_000   # mega-viral is hard to engage with
CREATOR_SWEET_SPOT_MIN = 5_000              # micro-influencer floor
CREATOR_SWEET_SPOT_MAX = 200_000            # micro-influencer ceiling
ENGAGEMENT_RATE_GOOD = 0.05    # 5% engagement = solid
ENGAGEMENT_RATE_GREAT = 0.10   # 10%+ = viral territory
RECENCY_DAYS = 7               # only flag videos from the last week as "fresh"

# --- Report settings ---
TOP_N_VIDEOS = 15              # number of top videos to surface in the daily report
TOP_N_CREATORS = 8             # number of creator recommendations
REPORTS_DIR = "reports"        # relative to repo root

# --- Search limits ---
VIDEOS_PER_HASHTAG = 30        # videos to pull per hashtag per run
