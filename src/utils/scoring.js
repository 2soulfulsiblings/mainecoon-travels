// Platform-specific scoring formulas + trending tag bonuses

export const PLATFORMS = [
  { id: 'tiktok', label: 'TikTok', emoji: '🎵', color: '#FF2D55' },
  { id: 'instagram', label: 'Instagram', emoji: '📸', color: '#E1306C' },
  { id: 'overall', label: 'Best Overall', emoji: '⭐', color: '#7C3AED' },
]

export const TRENDING_TAGS = [
  { id: 'golden_hour', label: 'Golden Hour', bonus: 12, icon: '🌅', tip: 'Warm sunset tones = massive engagement right now' },
  { id: 'close_up', label: 'Close-Up Portrait', bonus: 10, icon: '🐾', tip: 'Extreme close-ups are trending hard on TikTok' },
  { id: 'van_life', label: 'Van Life / Adventure', bonus: 10, icon: '🚐', tip: 'Travel + pets is a viral combo' },
  { id: 'funny', label: 'Funny Moment', bonus: 14, icon: '😂', tip: 'Humor drives shares — top engagement trigger' },
  { id: 'cozy', label: 'Cozy Aesthetic', bonus: 8, icon: '☕', tip: 'Soft, warm, intimate vibes trending on Instagram' },
  { id: 'action', label: 'Action Shot', bonus: 9, icon: '⚡', tip: 'Movement and energy stop the scroll' },
  { id: 'sunset', label: 'Sunset / Sky', bonus: 11, icon: '🌇', tip: 'Dramatic skies always perform well' },
  { id: 'nature', label: 'Nature Backdrop', bonus: 8, icon: '🌿', tip: 'Outdoor settings boost reach on discovery feeds' },
  { id: 'reaction', label: 'Reaction Face', bonus: 13, icon: '👀', tip: 'Expressive pet faces = instant stop-scroll moment' },
]

export function computePlatformScores(metrics, tags = []) {
  const { brightness, saturation, contrast, warmth } = metrics
  const tagBonus = tags.reduce((sum, tagId) => {
    const tag = TRENDING_TAGS.find(t => t.id === tagId)
    return sum + (tag?.bonus ?? 0)
  }, 0)

  // TikTok loves: vibrant, punchy, high contrast
  const tiktok = clamp(
    saturation * 0.38 + contrast * 0.35 + brightness * 0.27 + tagBonus * 0.8,
    0, 100
  )

  // Instagram loves: well-lit, aesthetically pleasing, slightly warm
  const instagram = clamp(
    brightness * 0.38 + saturation * 0.32 + warmth * 0.12 + contrast * 0.18 + tagBonus * 0.6,
    0, 100
  )

  const overall = clamp((tiktok * 0.5 + instagram * 0.5), 0, 100)

  return {
    tiktok: Math.round(tiktok),
    instagram: Math.round(instagram),
    overall: Math.round(overall),
  }
}

export function getScoreTier(score) {
  if (score >= 80) return { label: 'Top Pick', color: 'text-emerald-400', bg: 'bg-emerald-400/20', border: 'border-emerald-400/40' }
  if (score >= 65) return { label: 'Great', color: 'text-teal-400', bg: 'bg-teal-400/20', border: 'border-teal-400/40' }
  if (score >= 50) return { label: 'Good', color: 'text-yellow-400', bg: 'bg-yellow-400/20', border: 'border-yellow-400/40' }
  if (score >= 35) return { label: 'Fair', color: 'text-orange-400', bg: 'bg-orange-400/20', border: 'border-orange-400/40' }
  return { label: 'Skip', color: 'text-red-400', bg: 'bg-red-400/20', border: 'border-red-400/40' }
}

export function getMetricFeedback(metrics) {
  const tips = []

  if (metrics.brightness < 40) tips.push({ type: 'warn', text: 'Too dark — try brightening in editing' })
  else if (metrics.brightness > 85) tips.push({ type: 'warn', text: 'Slightly overexposed — reduce highlights' })
  else tips.push({ type: 'good', text: 'Exposure looks solid' })

  if (metrics.saturation < 35) tips.push({ type: 'warn', text: 'Boost the vibrancy — social media loves color' })
  else if (metrics.saturation > 80) tips.push({ type: 'good', text: 'Super vibrant — will pop in the feed' })
  else tips.push({ type: 'good', text: 'Color saturation is on point' })

  if (metrics.contrast < 35) tips.push({ type: 'warn', text: 'Flat contrast — add some punch in editing' })
  else tips.push({ type: 'good', text: 'Good contrast — stops the scroll' })

  if (metrics.warmth > 55) tips.push({ type: 'good', text: 'Warm tones — performs well on Instagram' })

  return tips
}

function clamp(val, min, max) {
  return Math.min(max, Math.max(min, val))
}
