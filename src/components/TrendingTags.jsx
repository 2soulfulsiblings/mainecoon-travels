import { TRENDING_TAGS } from '../utils/scoring'
import { TrendingUp } from 'lucide-react'

export default function TrendingTags({ selected, onChange }) {
  const toggle = (id) => {
    onChange(selected.includes(id) ? selected.filter(t => t !== id) : [...selected, id])
  }

  return (
    <div className="rounded-xl bg-white/5 border border-white/10 p-4">
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp size={16} className="text-brand-orange" />
        <span className="text-sm font-semibold text-white">Trending Tags</span>
        <span className="text-xs text-white/40 ml-1">Boost your score</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {TRENDING_TAGS.map(tag => {
          const active = selected.includes(tag.id)
          return (
            <button
              key={tag.id}
              onClick={() => toggle(tag.id)}
              title={tag.tip}
              className={`
                text-xs px-3 py-1.5 rounded-full border font-medium transition-all duration-200
                ${active
                  ? 'bg-brand-orange text-white border-brand-orange shadow-lg shadow-brand-orange/20'
                  : 'bg-white/5 text-white/60 border-white/15 hover:border-brand-orange/50 hover:text-white'
                }
              `}
            >
              {tag.icon} {tag.label}
              {active && <span className="ml-1 text-white/70">+{tag.bonus}</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}
