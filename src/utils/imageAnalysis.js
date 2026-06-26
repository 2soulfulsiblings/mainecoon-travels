// Analyzes image pixels using Canvas API to extract quality metrics

export function analyzeImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        // Downsample for performance — enough for accurate color stats
        const maxSize = 250
        const scale = Math.min(maxSize / img.width, maxSize / img.height, 1)
        canvas.width = Math.max(1, Math.round(img.width * scale))
        canvas.height = Math.max(1, Math.round(img.height * scale))

        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        const { data: pixels } = ctx.getImageData(0, 0, canvas.width, canvas.height)

        const metrics = computeMetrics(pixels, img.width, img.height)
        URL.revokeObjectURL(url)
        resolve(metrics)
      } catch (err) {
        URL.revokeObjectURL(url)
        reject(err)
      }
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Could not load image'))
    }

    img.src = url
  })
}

function rgbToHsl(r, g, b) {
  const rN = r / 255, gN = g / 255, bN = b / 255
  const max = Math.max(rN, gN, bN)
  const min = Math.min(rN, gN, bN)
  const delta = max - min
  const l = (max + min) / 2
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1))
  return { s, l }
}

function computeMetrics(pixels, originalWidth, originalHeight) {
  const pixelCount = pixels.length / 4
  let totalBrightness = 0
  let totalSaturation = 0
  let totalR = 0, totalG = 0, totalB = 0
  const brightnessArr = []

  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i], g = pixels[i + 1], b = pixels[i + 2]
    // Skip mostly transparent pixels
    if (pixels[i + 3] < 10) continue

    totalR += r; totalG += g; totalB += b

    const brightness = 0.299 * r + 0.587 * g + 0.114 * b
    totalBrightness += brightness
    brightnessArr.push(brightness)

    const { s } = rgbToHsl(r, g, b)
    totalSaturation += s
  }

  const count = brightnessArr.length || 1
  const avgBrightness = totalBrightness / count
  const avgSaturation = totalSaturation / count
  const avgR = totalR / count
  const avgB = totalB / count

  // Contrast = std dev of brightness
  const variance = brightnessArr.reduce((sum, v) => sum + Math.pow(v - avgBrightness, 2), 0) / count
  const contrastRaw = Math.sqrt(variance)

  // Warmth: warm images have more red/yellow than blue
  const warmthRaw = Math.max(0, (avgR - avgB) / 255)

  // Normalize to 0–100
  const brightnessScore = normalizeBrightness(avgBrightness)
  const saturationScore = Math.min(100, Math.round(avgSaturation * 180))
  const contrastScore = Math.min(100, Math.round((contrastRaw / 75) * 100))
  const warmthScore = Math.min(100, Math.round(warmthRaw * 200))

  // Aspect ratio hint
  const landscape = originalWidth > originalHeight * 1.2
  const portrait = originalHeight > originalWidth * 1.1
  const aspectHint = portrait ? 'portrait' : landscape ? 'landscape' : 'square'

  return {
    brightness: brightnessScore,
    saturation: saturationScore,
    contrast: contrastScore,
    warmth: warmthScore,
    aspectHint,
    rawBrightness: avgBrightness,
  }
}

function normalizeBrightness(avg) {
  // Optimal for social media: ~100-170 out of 255
  // Peak score at 135, fall off toward 0 and 255
  const optimal = 135
  const range = 120
  const dist = Math.abs(avg - optimal)
  return Math.max(0, Math.round(100 - (dist / range) * 100))
}
