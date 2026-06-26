import { useState } from 'react'
import { Check, X, ChevronDown, ChevronUp, Loader2 } from 'lucide-react'
import ScoreBar from './ScoreBar'
import { getScoreTier, getMetricFeedback, PLATFORMS } from '../utils/scoring'

export default function PhotoCard({ photo, activePlatform, rank }) {
  const [expanded, setExpanded] = useState(false)
  const [selected, setSelected] = useState(false)

  if (!photo.scores) {
    return (
      <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden animate-pulse-slow">
        <div className="aspect-square bg-white/10 flex items-center justify-center">
          <Loader2 size={28} className="text-white/30 animate-spin" />
        </div>
        <div className="p-3">
          <div className="h-3 bg-white/10 rounded mb-2 w-2/3" />
          <div className="h-2 bg-white/5 rounded w-full" />
        </div>
      </div>
    )
  }

  const score = photo.scores[activePlatform]
  const tier = getScoreTier(score)
  const tips = getMetricFeedback(photo.metrics)
  const platform = PLATFORMS.find(p => p.id === activePlatform)

  return (
    <div
      className={`
        rounded-2xl border overflow-hidden transition-all duration-300 animate-slide-up
        ${selected
          ? 'border-brand-teal shadow-lg shadow-brand-teal/20 bg-brand-teal/5'
          : 'border-white/10 bg-white/5 hover:border-white/25'
        }
      `}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden group">
        <img
          src={photo.preview}
          alt={photo.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Rank badge */}
        {rank <= 3 && (
          <div className="absolute top-2 left-2 text-lg">
            {rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉'}
          </div>
        )}
        {/* Tier badge */}
        <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-bold border ${tier.bg} ${tier.color} ${tier.border}`}>
          {tier.label}
        </div>
        {/* Score overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
          <div className="text-white">
            <div className="text-2xl font-black">{score}</div>
            <div className="text-xs text-white/70">{platform?.label} score</div>
          </div>
        </div>
        {/* Select button */}
        <button
          onClick={() => setSelected(!selected)}
          className={`
            absolute bottom-2 right-2 rounded-full w-7 h-7 flex items-center justify-center transition-all
            ${selected ? 'bg-brand-teal text-white' : 'bg-black/50 text-white/60 hover:bg-black/70'}
          `}
        >
          {selected ? <Check size={14} /> : <Check size={14} />}
        </button>
      </div>

      {/* Info */}
      <div className="p-3 space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs text-white/50 truncate flex-1 mr-2">{photo.name}</p>
          <div className={`text-xl font-black ${tier.color}`}>{score}</div>
        </div>

        {/* Platform mini scores */}
        <div className="flex gap-2">
          {PLATFORMS.filter(p => p.id !== 'overall').map(p => (
            <div key={p.id} className="flex-1 text-center">
              <div className="text-xs text-white/40">{p.emoji}</div>
              <div className="text-xs font-bold text-white/80">{photo.scores[p.id]}</div>
            </div>
          ))}
          <div className="flex-1 text-center">
            <div className="text-xs text-white/40">⭐</div>
            <div className="text-xs font-bold text-white/80">{photo.scores.overall}</div>
          </div>
        </div>

        {/* Expand toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-center gap-1 text-xs text-white/40 hover:text-white/70 transition-colors pt-1"
        >
          {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          {expanded ? 'Less' : 'Details'}
        </button>

        {expanded && (
          <div className="space-y-3 pt-1 border-t border-white/10 animate-fade-in">
            <div className="space-y-2">
              <ScoreBar label="Brightness" value={photo.metrics.brightness} color="bg-yellow-400" />
              <ScoreBar label="Vibrancy" value={photo.metrics.saturation} color="bg-pink-500" />
              <ScoreBar label="Contrast" value={photo.metrics.contrast} color="bg-purple-400" />
              <ScoreBar label="Warmth" value={photo.metrics.warmth} color="bg-orange-400" />
            </div>
            <div className="space-y-1">
              {tips.map((tip, i) => (
                <div key={i} className={`flex items-start gap-1.5 text-xs ${tip.type === 'good' ? 'text-emerald-400' : 'text-amber-400'}`}>
                  <span className="mt-0.5 shrink-0">{tip.type === 'good' ? '✓' : '!'}</span>
                  <span>{tip.text}</span>
                </div>
              ))}
            </div>
            {photo.metrics.aspectHint && (
              <div className="text-xs text-white/30">
                Orientation: <span className="text-white/50 capitalize">{photo.metrics.aspectHint}</span>
                {photo.metrics.aspectHint === 'portrait' && ' — perfect for TikTok/Reels'}
                {photo.metrics.aspectHint === 'landscape' && ' — crop to 9:16 for TikTok'}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
