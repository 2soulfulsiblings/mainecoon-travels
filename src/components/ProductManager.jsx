import { useState } from 'react'
import { CATEGORIES, THEMES, CATS, STATUS_CONFIG } from '../data/products.js'

const EMPTY_PRODUCT = {
  name: '', category: 'mugs', cat: 'All Three', theme: 'van-life',
  description: '', suggestedPrice: '', status: 'idea', notes: '',
}

function Badge({ status }) {
  const s = STATUS_CONFIG[status]
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-0.5 rounded-full font-medium ${s.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${s.dot}`} />
      {s.label}
    </span>
  )
}

function Modal({ product, onSave, onClose }) {
  const [form, setForm] = useState({ ...product })
  const set = (field, val) => setForm(f => ({ ...f, [field]: val }))

  const handleSave = () => {
    if (!form.name.trim()) return
    onSave(form)
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-tmc-navy">
            {product.id ? 'Edit Product' : 'New Product Idea'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
            <input
              value={form.name}
              onChange={e => set('name', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tmc-teal/40 focus:border-tmc-teal"
              placeholder="e.g. Stevie Rides Shotgun Mug"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={form.category}
                onChange={e => set('category', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tmc-teal/40 focus:border-tmc-teal bg-white"
              >
                {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Theme</label>
              <select
                value={form.theme}
                onChange={e => set('theme', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tmc-teal/40 focus:border-tmc-teal bg-white"
              >
                {THEMES.map(t => <option key={t.id} value={t.id}>{t.icon} {t.label}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Featuring</label>
              <select
                value={form.cat}
                onChange={e => set('cat', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tmc-teal/40 focus:border-tmc-teal bg-white"
              >
                {CATS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={form.status}
                onChange={e => set('status', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tmc-teal/40 focus:border-tmc-teal bg-white"
              >
                {Object.entries(STATUS_CONFIG).map(([id, s]) => (
                  <option key={id} value={id}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Design Description</label>
            <textarea
              value={form.description}
              onChange={e => set('description', e.target.value)}
              rows={3}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tmc-teal/40 focus:border-tmc-teal resize-none"
              placeholder="Describe the design — what's the vibe, what does it look like?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Suggested Price ($)</label>
            <input
              type="number"
              value={form.suggestedPrice}
              onChange={e => set('suggestedPrice', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tmc-teal/40 focus:border-tmc-teal"
              placeholder="e.g. 18"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes (internal)</label>
            <textarea
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
              rows={2}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tmc-teal/40 focus:border-tmc-teal resize-none"
              placeholder="Anything to remember — colorways, variations, inspiration, etc."
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-lg text-sm font-medium bg-tmc-teal text-white hover:bg-tmc-teal-dark transition"
          >
            {product.id ? 'Save Changes' : 'Add Product'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ProductManager({ products, setProducts, onGenerateListing }) {
  const [search, setSearch]   = useState('')
  const [catFilter, setCat]   = useState('')
  const [statusFilter, setSt] = useState('')
  const [themeFilter, setTh]  = useState('')
  const [modal, setModal]     = useState(null)
  const [editing, setEditing] = useState(null)

  const filtered = products.filter(p => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase())
    const matchCat    = !catFilter    || p.category === catFilter
    const matchStatus = !statusFilter || p.status   === statusFilter
    const matchTheme  = !themeFilter  || p.theme    === themeFilter
    return matchSearch && matchCat && matchStatus && matchTheme
  })

  const openAdd  = () => { setEditing({ ...EMPTY_PRODUCT }); setModal('form') }
  const openEdit = (p) => { setEditing({ ...p }); setModal('form') }

  const handleSave = (form) => {
    if (form.id) {
      setProducts(prev => prev.map(p => p.id === form.id ? { ...form } : p))
    } else {
      const newP = { ...form, id: `prod-${Date.now()}`, createdAt: new Date().toISOString().slice(0, 10) }
      setProducts(prev => [newP, ...prev])
    }
    setModal(null)
  }

  const handleDelete = (id) => {
    if (confirm('Delete this product?')) {
      setProducts(prev => prev.filter(p => p.id !== id))
    }
  }

  const updateStatus = (id, status) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, status } : p))
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {modal === 'form' && editing && (
        <Modal product={editing} onSave={handleSave} onClose={() => setModal(null)} />
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-tmc-navy">Products</h2>
          <p className="text-sm text-gray-500 mt-0.5">{products.length} total · {filtered.length} showing</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-tmc-teal text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-tmc-teal-dark transition"
        >
          ➕ Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search products..."
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tmc-teal/30 focus:border-tmc-teal w-52"
        />
        <select value={catFilter} onChange={e => setCat(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-tmc-teal/30">
          <option value=''>All categories</option>
          {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
        </select>
        <select value={statusFilter} onChange={e => setSt(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-tmc-teal/30">
          <option value=''>All statuses</option>
          {Object.entries(STATUS_CONFIG).map(([id, s]) => <option key={id} value={id}>{s.label}</option>)}
        </select>
        <select value={themeFilter} onChange={e => setTh(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-tmc-teal/30">
          <option value=''>All themes</option>
          {THEMES.map(t => <option key={t.id} value={t.id}>{t.icon} {t.label}</option>)}
        </select>
        {(search || catFilter || statusFilter || themeFilter) && (
          <button onClick={() => { setSearch(''); setCat(''); setSt(''); setTh('') }}
            className="text-sm text-gray-400 hover:text-gray-600 px-2">
            Clear filters ×
          </button>
        )}
      </div>

      {/* Product cards */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-4xl mb-3">🐾</div>
          <p className="font-medium">No products found.</p>
          <p className="text-sm mt-1">Try adjusting your filters or add a new product idea.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(p => {
            const cat = CATEGORIES.find(c => c.id === p.category)
            const theme = THEMES.find(t => t.id === p.theme)
            return (
              <div key={p.id} className="bg-white rounded-xl border border-tmc-border hover:border-tmc-teal/40 hover:shadow-sm transition-all p-5 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-tmc-navy text-sm leading-snug">{p.name}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{p.cat}</div>
                  </div>
                  <Badge status={p.status} />
                </div>

                <div className="flex gap-2 flex-wrap">
                  {cat && (
                    <span className={`text-xs px-2 py-0.5 rounded-md font-medium ${cat.color}`}>
                      {cat.icon} {cat.label}
                    </span>
                  )}
                  {theme && (
                    <span className="text-xs px-2 py-0.5 rounded-md bg-gray-100 text-gray-600">
                      {theme.icon} {theme.label}
                    </span>
                  )}
                </div>

                {p.description && (
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{p.description}</p>
                )}

                {p.suggestedPrice && (
                  <div className="text-sm font-semibold text-tmc-teal">${p.suggestedPrice}</div>
                )}

                <div className="flex items-center justify-between pt-1 border-t border-gray-50">
                  <div className="flex gap-1">
                    <button
                      onClick={() => openEdit(p)}
                      className="text-xs text-gray-400 hover:text-tmc-teal px-2 py-1 rounded hover:bg-tmc-teal-light transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="text-xs text-gray-400 hover:text-red-500 px-2 py-1 rounded hover:bg-red-50 transition"
                    >
                      Delete
                    </button>
                  </div>
                  <button
                    onClick={() => onGenerateListing(p)}
                    className="text-xs font-medium text-tmc-amber hover:text-tmc-teal transition px-2 py-1 rounded hover:bg-tmc-amber-light"
                  >
                    ✍️ Generate listing
                  </button>
                </div>

                <div className="flex gap-1 flex-wrap">
                  {Object.entries(STATUS_CONFIG)
                    .filter(([id]) => id !== p.status)
                    .map(([id, s]) => (
                      <button
                        key={id}
                        onClick={() => updateStatus(p.id, id)}
                        title={`Move to: ${s.label}`}
                        className="text-xs text-gray-300 hover:text-gray-600 transition px-1"
                      >
                        → {s.label}
                      </button>
                    ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
