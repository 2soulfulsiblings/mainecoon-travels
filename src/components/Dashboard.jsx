import { STATUS_CONFIG, CATEGORIES } from '../data/products.js'

const TIPS = [
  'Printify tip: Always order a sample before marking a product live. Colors print differently than screen.',
  'Etsy tip: Use all 13 tags. Etsy treats each tag as a separate search query.',
  'SEO tip: Front-load your most important keywords in the first 40 characters of your title.',
  'Pricing tip: For mugs, $18–22 is the sweet spot. Hoodies sell well at $42–50.',
  'Photo tip: Lifestyle mockups outperform flat white-background mockups by 2–3x on Etsy.',
  'Listing tip: Describe what the product *feels* like, not just what it looks like.',
]

export default function Dashboard({ products, setActiveTab }) {
  const counts = {
    total:     products.length,
    idea:      products.filter(p => p.status === 'idea').length,
    designing: products.filter(p => p.status === 'designing').length,
    ready:     products.filter(p => p.status === 'ready').length,
    live:      products.filter(p => p.status === 'live').length,
  }

  const recent = [...products]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)

  const tip = TIPS[Math.floor(Date.now() / 86400000) % TIPS.length]

  const byCat = CATEGORIES.map(cat => ({
    ...cat,
    count: products.filter(p => p.category === cat.id).length,
  })).filter(c => c.count > 0).sort((a, b) => b.count - a.count)

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-tmc-navy">Good morning, Cait! 🌅</h2>
        <p className="text-gray-500 mt-0.5 text-sm">Your Traveling Maine Coons Etsy POD shop at a glance.</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Products', value: counts.total,     bg: 'bg-tmc-teal-light', text: 'text-tmc-teal-dark' },
          { label: 'Ideas',          value: counts.idea,      bg: 'bg-gray-100',        text: 'text-gray-700'      },
          { label: 'In Progress',    value: counts.designing, bg: 'bg-blue-50',         text: 'text-blue-700'      },
          { label: 'Live on Etsy',   value: counts.live,      bg: 'bg-green-50',        text: 'text-green-700'     },
        ].map(stat => (
          <div key={stat.label} className={`${stat.bg} rounded-xl p-4`}>
            <div className={`text-3xl font-bold ${stat.text}`}>{stat.value}</div>
            <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Ready to list — action card */}
        {counts.ready > 0 && (
          <div className="bg-tmc-amber-light border border-amber-200 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <div className="text-2xl">🚀</div>
              <div>
                <h3 className="font-semibold text-amber-900">
                  {counts.ready} product{counts.ready > 1 ? 's' : ''} ready to list!
                </h3>
                <p className="text-sm text-amber-700 mt-1">
                  Head to the Listing Generator to create Etsy-ready copy for your shop.
                </p>
                <button
                  onClick={() => setActiveTab('generator')}
                  className="mt-3 text-sm font-medium bg-tmc-amber text-white px-4 py-1.5 rounded-lg hover:opacity-90 transition"
                >
                  Generate Listings →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Daily tip */}
        <div className="bg-tmc-teal-light border border-tmc-teal/20 rounded-xl p-5">
          <div className="flex items-start gap-3">
            <div className="text-2xl">💡</div>
            <div>
              <h3 className="font-semibold text-tmc-teal-dark mb-1">Tip of the day</h3>
              <p className="text-sm text-tmc-teal-dark/80">{tip}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent products */}
        <div className="bg-white rounded-xl border border-tmc-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-tmc-navy">Recently Added</h3>
            <button
              onClick={() => setActiveTab('products')}
              className="text-xs text-tmc-teal hover:underline"
            >
              View all →
            </button>
          </div>
          <div className="space-y-3">
            {recent.map(p => {
              const s = STATUS_CONFIG[p.status]
              return (
                <div key={p.id} className="flex items-center justify-between gap-2">
                  <div className="truncate">
                    <div className="text-sm font-medium text-tmc-navy truncate">{p.name}</div>
                    <div className="text-xs text-gray-400">{p.cat}</div>
                  </div>
                  <span className={`flex-shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${s.color}`}>
                    {s.label}
                  </span>
                </div>
              )
            })}
            {recent.length === 0 && (
              <p className="text-sm text-gray-400">No products yet. Add your first one!</p>
            )}
          </div>
        </div>

        {/* By category */}
        <div className="bg-white rounded-xl border border-tmc-border p-5">
          <h3 className="font-semibold text-tmc-navy mb-4">Products by Category</h3>
          {byCat.length === 0 ? (
            <p className="text-sm text-gray-400">No products yet.</p>
          ) : (
            <div className="space-y-2">
              {byCat.map(cat => (
                <div key={cat.id} className="flex items-center gap-3">
                  <span className="text-lg w-7 text-center">{cat.icon}</span>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700">{cat.label}</span>
                      <span className="font-medium text-tmc-navy">{cat.count}</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-tmc-teal rounded-full"
                        style={{ width: `${(cat.count / counts.total) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-xl border border-tmc-border p-5">
        <h3 className="font-semibold text-tmc-navy mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          {[
            { label: 'Add a product idea', icon: '➕', tab: 'products' },
            { label: 'Generate an Etsy listing', icon: '✍️', tab: 'generator' },
            { label: 'Plan content', icon: '📅', tab: 'calendar' },
          ].map(a => (
            <button
              key={a.label}
              onClick={() => setActiveTab(a.tab)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-tmc-border hover:border-tmc-teal hover:bg-tmc-teal-light text-sm font-medium text-gray-700 hover:text-tmc-teal-dark transition-all"
            >
              <span>{a.icon}</span> {a.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
