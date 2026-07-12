import { useState, useEffect } from 'react'
import Layout from './components/Layout.jsx'
import Dashboard from './components/Dashboard.jsx'
import ProductManager from './components/ProductManager.jsx'
import ListingGenerator from './components/ListingGenerator.jsx'
import ContentCalendar from './components/ContentCalendar.jsx'
import { SEED_PRODUCTS } from './data/products.js'

function loadFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

const SEED_CAL_EVENTS = [
  { id: 'ev-001', date: '2026-07-04', type: 'sale',   title: '4th of July Sale',          notes: '20% off all prints' },
  { id: 'ev-002', date: '2026-07-10', type: 'social', title: 'Instagram: Stevie van shot', notes: 'Use road trip reel' },
  { id: 'ev-003', date: '2026-07-15', type: 'launch', title: 'Adventure Cat Sticker Pack', notes: 'List on Etsy + post on IG' },
  { id: 'ev-004', date: '2026-08-01', type: 'travel', title: 'Road trip to NOLA 🎺',       notes: 'Content creation week!' },
  { id: 'ev-005', date: '2026-09-01', type: 'launch', title: 'Fall product drops go live', notes: 'Mugs and totes' },
]

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [products, setProducts]   = useState(() => loadFromStorage('tmc_products', SEED_PRODUCTS))
  const [events, setEvents]       = useState(() => loadFromStorage('tmc_events', SEED_CAL_EVENTS))
  const [generatorProduct, setGeneratorProduct] = useState(null)

  useEffect(() => {
    localStorage.setItem('tmc_products', JSON.stringify(products))
  }, [products])

  useEffect(() => {
    localStorage.setItem('tmc_events', JSON.stringify(events))
  }, [events])

  const handleGenerateListing = (product) => {
    setGeneratorProduct(product)
    setActiveTab('generator')
  }

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} productCount={products.length}>
      {activeTab === 'dashboard' && (
        <Dashboard products={products} setActiveTab={setActiveTab} />
      )}
      {activeTab === 'products' && (
        <ProductManager
          products={products}
          setProducts={setProducts}
          onGenerateListing={handleGenerateListing}
        />
      )}
      {activeTab === 'generator' && (
        <ListingGenerator
          products={products}
          initialProduct={generatorProduct}
        />
      )}
      {activeTab === 'calendar' && (
        <ContentCalendar events={events} setEvents={setEvents} />
      )}
    </Layout>
  )
}
