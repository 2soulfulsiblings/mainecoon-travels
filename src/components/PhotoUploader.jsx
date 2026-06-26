import { useRef, useState } from 'react'
import { Upload, ImagePlus } from 'lucide-react'

export default function PhotoUploader({ onPhotosAdded }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)

  const handleFiles = (files) => {
    const images = Array.from(files).filter(f => f.type.startsWith('image/'))
    if (images.length) onPhotosAdded(images)
  }

  const onDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      onClick={() => inputRef.current?.click()}
      className={`
        relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300 p-10
        flex flex-col items-center justify-center gap-4 min-h-[220px]
        ${dragging
          ? 'border-brand-teal bg-brand-teal/10 scale-[1.01]'
          : 'border-white/20 bg-white/5 hover:border-brand-orange/60 hover:bg-brand-orange/5'
        }
      `}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <div className={`rounded-full p-5 transition-colors ${dragging ? 'bg-brand-teal/20' : 'bg-white/10'}`}>
        {dragging ? (
          <ImagePlus size={40} className="text-brand-teal" />
        ) : (
          <Upload size={40} className="text-white/60" />
        )}
      </div>
      <div className="text-center">
        <p className="text-lg font-semibold text-white">
          {dragging ? 'Drop your photos here!' : 'Upload your photos'}
        </p>
        <p className="text-sm text-white/50 mt-1">
          Drag & drop or click to browse — any format, multiple at once
        </p>
      </div>
      <div className="flex gap-2 flex-wrap justify-center">
        {['JPG', 'PNG', 'HEIC', 'WEBP', 'GIF'].map(fmt => (
          <span key={fmt} className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/40">{fmt}</span>
        ))}
      </div>
    </div>
  )
}
