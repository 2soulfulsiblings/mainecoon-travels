import { useState, useEffect } from 'react'
import { generateListing } from '../data/listingTemplates.js'
import { CATEGORIES, THEMES, CATS } from '../data/products.js'

function CopyButton({ text, label = 'Copy' }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const el = document.createElement('textarea')
      el.value = text
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }
  return (
    <button
      onClick={handleCopy}
      className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-all
        ${copied ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600 hover:bg-tmc-teal-light hover:text-tmc-teal-dark'}`}
    >
      {copied ? '✓ Copied!' : label}
    </button>
  )
}

function Section({ title, children, extra }) {
  return (
    <div className="bg-white rounded-xl border border-tmc-border">
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-50">
        <h3 className="font-semibold text-tmc-navy text-sm">{title}</h3>
        {extra}
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  )
}

export default function ListingGenerator({ products, initialProduct }) {
  const [selectedId, setSelectedId] = useState(initialProduct?.id ?? '')
  const [titleIdx, setTitleIdx]     = useState(0)
  const [listing, setListing]       = useState(null)
  const [useCustom, setUseCustom]   = useState(false)
  const [custom, setCustom] = useState({
    name: '', category: 'mugs', cat: 'All Three',
    theme: 'van-life', description: '', suggestedPrice: '',
  })

  useEffect(() => {
    if (initialProduct) {
      setSelectedId(initialProduct.id)
      setUseCustom(false)
    }
  }, [initialProduct])

  const selectedProduct = useCustom
    ? custom
    : products.find(p => p.id === selectedId)

  const generate = () => {
    if (!selectedProduct) return
    const result = generateListing(selectedProduct)
    setListing(result)
    setTitleIdx(0)
  }

  const allTagsText = listing?.tags.join(', ') ?? ''
  const currentTitle = listing?.titles[titleIdx] ?? ''

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-tmc-navy">Listing Generator ✍️</h2>
        <p className="text-sm text-gray-500 mt-0.5">Generate Etsy-ready titles, descriptions, and tags in one click.</p>
      </div>

      {/* Product selector */}
      <div className="bg-white rounded-xl border border-tmc-border p-5 space-y-4">
        <div className="flex gap-3">
          <button
            onClick={() => setUseCustom(false)}
            className={`text-sm font-medium px-4 py-2 rounded-lg transition
              ${!useCustom ? 'bg-tmc-teal text-white' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            Pick a product
          </button>
          <button
            onClick={() => setUseCustom(true)}
            className={`text-sm font-medium px-4 py-2 rounded-lg transition
              ${useCustom ? 'bg-tmc-teal text-white' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            Enter custom product
          </button>
        </div>

        {!useCustom ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select a product</label>
            <select
              value={selectedId}
              onChange={e => setSelectedId(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-tmc-teal/30 focus:border-tmc-teal"
            >
              <option value="">-- Choose a product --</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            {selectedProduct && (
              <div className="mt-3 p-3 bg-tmc-teal-light rounded-lg text-sm text-tmc-teal-dark space-y-1">
                <div><span className="font-medium">Category:</span> {CATEGORIES.find(c => c.id === selectedProduct.category)?.label}</div>
                <div><span className="font-medium">Theme:</span> {THEMES.find(t => t.id === selectedProduct.theme)?.label}</div>
                <div><span className="font-medium">Featuring:</span> {selectedProduct.cat}</div>
                {selectedProduct.suggestedPrice && <div><span className="font-medium">Price:</span> ${selectedProduct.suggestedPrice}</div>}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product name</label>
              <input
                value={custom.name}
                onChange={e => setCustom(f => ({ ...f, name: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tmc-teal/30 focus:border-tmc-teal"
                placeholder="e.g. Adventure Cat Travel Mug"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select value={custom.category} onChange={e => setCustom(f => ({ ...f, category: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-tmc-teal/30">
                  {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Theme</label>
                <select value={custom.theme} onChange={e => setCustom(f => ({ ...f, theme: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-tmc-teal/30">
                  {THEMES.map(t => <option key={t.id} value={t.id}>{t.icon} {t.label}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Featuring</label>
                <select value={custom.cat} onChange={e => setCustom(f => ({ ...f, cat: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-tmc-teal/30">
                  {CATS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                <input
                  type="number"
                  value={custom.suggestedPrice}
                  onChange={e => setCustom(f => ({ ...f, suggestedPrice: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tmc-teal/30"
                  placeholder="e.g. 22"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Design description</label>
              <textarea
                value={custom.description}
                onChange={e => setCustom(f => ({ ...f, description: e.target.value }))}
                rows={2}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tmc-teal/30 resize-none"
                placeholder="Briefly describe the design so the listing copy can reference it."
              />
            </div>
          </div>
        )}

        <button
          onClick={generate}
          disabled={!selectedProduct || (!useCustom && !selectedId) || (useCustom && !custom.name)}
          className="w-full py-3 bg-tmc-teal text-white font-semibold rounded-xl hover:bg-tmc-teal-dark transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          ✨ Generate Etsy Listing
        </button>
      </div>

      {/* Results */}
      {listing && (
        <div className="space-y-4">
          {/* Titles */}
          <Section
            title={`Title (${currentTitle.length}/140 chars)`}
            extra={
              <div className="flex gap-2 items-center">
                <span className="text-xs text-gray-400">Variation {titleIdx + 1} of {listing.titles.length}</span>
                <button
                  onClick={() => setTitleIdx(i => (i + 1) % listing.titles.length)}
                  className="text-xs text-tmc-teal hover:underline"
                >
                  Next variation →
                </button>
              </div>
            }
          >
            <div className="flex items-start gap-3">
              <p className="flex-1 text-sm text-gray-700 font-medium leading-relaxed">{currentTitle}</p>
              <CopyButton text={currentTitle} />
            </div>
            {listing.titles.length > 1 && (
              <div className="mt-3 flex gap-1">
                {listing.titles.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setTitleIdx(i)}
                    className={`w-2 h-2 rounded-full transition ${i === titleIdx ? 'bg-tmc-teal' : 'bg-gray-200'}`}
                  />
                ))}
              </div>
            )}
          </Section>

          {/* Description */}
          <Section title="Description" extra={<CopyButton text={listing.description} label="Copy all" />}>
            <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
              {listing.description}
            </pre>
          </Section>

          {/* Tags */}
          <Section
            title={`Tags (${listing.tags.length}/13)`}
            extra={<CopyButton text={allTagsText} label="Copy as CSV" />}
          >
            <div className="flex flex-wrap gap-2 mb-3">
              {listing.tags.map((tag, i) => (
                <span key={i} className="bg-tmc-teal-light text-tmc-teal-dark text-xs px-3 py-1 rounded-full font-medium">
                  {tag}
                </span>
              ))}
            </div>
            <p className="text-xs text-gray-400">
              Each tag is max 20 chars. Etsy treats multi-word tags as a phrase search — keep them together.
            </p>
          </Section>

          {/* Copy all */}
          <div className="bg-tmc-amber-light border border-amber-200 rounded-xl p-4 flex items-center justify-between gap-4">
            <div className="text-sm text-amber-800">
              <span className="font-semibold">Ready to list?</span> Copy everything, then paste into your Etsy listing draft.
            </div>
            <CopyButton
              text={`TITLE:\n${currentTitle}\n\nDESCRIPTION:\n${listing.description}\n\nTAGS:\n${allTagsText}`}
              label="Copy everything"
            />
          </div>
        </div>
      )}
    </div>
  )
}
