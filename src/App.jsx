import { useState, useCallback } from 'react'
import { Sparkles, TrendingUp, X, RotateCcw, Info } from 'lucide-react'
import PhotoUploader from './components/PhotoUploader'
import PhotoCard from './components/PhotoCard'
import PlatformTabs from './components/PlatformTabs'
import TrendingTags from './components/TrendingTags'
import { analyzeImage } from './utils/imageAnalysis'
import { computePlatformScores } from './utils/scoring'

export default function App() {
  const [photos, setPhotos] = useState([])
  const [activePlatform, setActivePlatform] = useState('tiktok')
  const [globalTags, setGlobalTags] = useState([])
  const [analyzing, setAnalyzing] = useState(false)

  const handlePhotosAdded = useCallback(async (files) => {
    setAnalyzing(true)

    const newPhotos = files.map(file => ({
      id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
      name: file.name,
      preview: URL.createObjectURL(file),
      file,
      metrics: null,
      scores: null,
      tags: [],
    }))

    setPhotos(prev => [...prev, ...newPhotos])

    // Analyze each photo
    const analyzed = await Promise.all(
      newPhotos.map(async (photo) => {
        try {
          const metrics = await analyzeImage(photo.file)
          const scores = computePlatformScores(metrics, globalTags)
          return { ...photo, metrics, scores }
        } catch {
          return { ...photo, metrics: { brightness: 50, saturation: 50, contrast: 50, warmth: 30, aspectHint: 'square' }, scores: { tiktok: 50, instagram: 50, overall: 50 } }
        }
      })
    )

    setPhotos(prev => prev.map(p => {
      const updated = analyzed.find(a => a.id === p.id)
      return updated || p
    }))

    setAnalyzing(false)
  }, [globalTags])

  const removePhoto = (id) => {
    setPhotos(prev => {
      const photo = prev.find(p => p.id === id)
      if (photo?.preview) URL.revokeObjectURL(photo.preview)
      return prev.filter(p => p.id !== id)
    })
  }

  const clearAll = () => {
    photos.forEach(p => { if (p.preview) URL.revokeObjectURL(p.preview) })
    setPhotos([])
    setGlobalTags([])
  }

  // Re-score when global tags change
  const handleTagsChange = (tags) => {
    setGlobalTags(tags)
    setPhotos(prev => prev.map(p => {
      if (!p.metrics) return p
      return { ...p, scores: computePlatformScores(p.metrics, tags) }
    }))
  }

  const sorted = [...photos].sort((a, b) => {
    if (!a.scores) return 1
    if (!b.scores) return -1
    return (b.scores[activePlatform] ?? 0) - (a.scores[activePlatform] ?? 0)
  })

  const topPicks = sorted.filter(p => p.scores && p.scores[activePlatform] >= 65)

  return (
    <div className="min-h-screen bg-brand-dark text-white">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-brand-dark via-brand-card to-brand-muted pointer-events-none" />
      <div className="fixed top-0 right-0 w-96 h-96 bg-brand-orange/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-96 h-96 bg-brand-teal/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 py-8 space-y-8">

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-3">
            <span className="text-4xl">🐾</span>
            <h1 className="text-3xl font-black tracking-tight">
              <span className="text-brand-orange">Social</span> Pic Picker
            </h1>
            <span className="text-4xl">✨</span>
          </div>
          <p className="text-white/50 text-sm max-w-md mx-auto">
            Upload your Maine Coon photos and find out which ones will crush it on TikTok and Instagram
          </p>
        </div>

        {/* Stats bar when photos exist */}
        {photos.length > 0 && (
          <div className="flex items-center justify-between flex-wrap gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
            <div className="flex items-center gap-4 text-sm">
              <span className="text-white/50">{photos.length} photo{photos.length !== 1 ? 's' : ''} loaded</span>
              {topPicks.length > 0 && (
                <span className="flex items-center gap-1 text-emerald-400">
                  <Sparkles size={14} />
                  {topPicks.length} top pick{topPicks.length !== 1 ? 's' : ''}
                </span>
              )}
              {analyzing && (
                <span className="flex items-center gap-1 text-brand-teal text-xs">
                  <span className="inline-block w-2 h-2 bg-brand-teal rounded-full animate-ping" />
                  Analyzing...
                </span>
              )}
            </div>
            <button
              onClick={clearAll}
              className="flex items-center gap-1.5 text-xs text-white/40 hover:text-red-400 transition-colors"
            >
              <RotateCcw size={12} />
              Clear all
            </button>
          </div>
        )}

        {/* Upload zone */}
        <PhotoUploader onPhotosAdded={handlePhotosAdded} />

        {photos.length > 0 && (
          <>
            {/* Trending tags */}
            <TrendingTags selected={globalTags} onChange={handleTagsChange} />

            {/* Platform selector */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <TrendingUp size={16} className="text-brand-orange" />
                <span className="text-sm font-semibold">Sort by platform</span>
              </div>
              <PlatformTabs active={activePlatform} onChange={setActivePlatform} />
            </div>

            {/* Top picks highlight */}
            {topPicks.length > 0 && (
              <div className="rounded-xl bg-gradient-to-r from-brand-orange/10 to-brand-teal/10 border border-brand-orange/20 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={16} className="text-brand-orange" />
                  <span className="text-sm font-bold text-brand-orange">
                    Your Top {Math.min(topPicks.length, 3)} for {activePlatform === 'tiktok' ? 'TikTok' : activePlatform === 'instagram' ? 'Instagram' : 'Social Media'}
                  </span>
                </div>
                <p className="text-xs text-white/50">
                  {topPicks.slice(0, 3).map(p => p.name.replace(/\.[^.]+$/, '')).join(', ')}
                </p>
              </div>
            )}

            {/* Photo grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {sorted.map((photo, i) => (
                <div key={photo.id} className="relative group/card">
                  <PhotoCard photo={photo} activePlatform={activePlatform} rank={i + 1} />
                  <button
                    onClick={() => removePhoto(photo.id)}
                    className="absolute top-2 left-2 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center text-white/60 hover:text-red-400 hover:bg-black/80 opacity-0 group-hover/card:opacity-100 transition-all z-10"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>

            {/* Tips footer */}
            <div className="rounded-xl bg-white/5 border border-white/10 p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Info size={14} className="text-brand-teal" />
                <span className="text-xs font-semibold text-white/70">How the scoring works</span>
              </div>
              <div className="text-xs text-white/40 space-y-1">
                <p><span className="text-white/60">TikTok score</span> weighs vibrancy (38%) + contrast (35%) + brightness (27%) — punchy and vibrant wins.</p>
                <p><span className="text-white/60">Instagram score</span> weighs brightness (38%) + vibrancy (32%) + warmth (12%) + contrast (18%) — clean and aesthetic.</p>
                <p>Trending tags add bonus points based on what's driving engagement right now. Click a tag to apply it to all photos.</p>
              </div>
            </div>
          </>
        )}

        {/* Empty state */}
        {photos.length === 0 && (
          <div className="text-center py-12 space-y-3">
            <div className="text-6xl">📸</div>
            <p className="text-white/40 text-sm">Upload some photos to get started — Stevie, Bridget, and Jewels await their moment!</p>
          </div>
        )}
      </div>
    </div>
  )
}
