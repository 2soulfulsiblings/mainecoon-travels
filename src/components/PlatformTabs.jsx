import { PLATFORMS } from '../utils/scoring'

export default function PlatformTabs({ active, onChange }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {PLATFORMS.map(p => (
        <button
          key={p.id}
          onClick={() => onChange(p.id)}
          className={`
            px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200
            ${active === p.id
              ? 'bg-brand-orange text-white shadow-lg shadow-brand-orange/30'
              : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10'
            }
          `}
        >
          {p.emoji} Sort by {p.label}
        </button>
      ))}
    </div>
  )
}
