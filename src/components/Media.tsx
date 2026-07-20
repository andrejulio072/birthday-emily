import { type PointerEvent as ReactPointerEvent, useEffect, useMemo, useRef, useState } from 'react'
import { MEDIA_BASE_URL } from '../config/media'

export function Typewriter({
  lines,
  speed = 42,
  onComplete,
}: {
  lines: string[]
  speed?: number
  onComplete?: () => void
}) {
  const fullText = useMemo(() => lines.join('\n'), [lines])
  const [count, setCount] = useState(0)

  useEffect(() => {
    setCount(0)
    const timer = window.setInterval(() => {
      setCount((current) => {
        if (current >= fullText.length) {
          window.clearInterval(timer)
          onComplete?.()
          return current
        }
        return current + 1
      })
    }, speed)
    return () => window.clearInterval(timer)
  }, [fullText, speed, onComplete])

  return (
    <span className="typewriter" aria-label={fullText.replace('\n', ' ')}>
      {fullText.slice(0, count).split('\n').map((line, index) => (
        <span key={`${line}-${index}`}>
          {line}
          {index < fullText.slice(0, count).split('\n').length - 1 && <br />}
        </span>
      ))}
      <span className="typewriter-caret" aria-hidden="true" />
    </span>
  )
}

function uniqueSources(values: string[]) {
  return [...new Set(values.filter(Boolean))]
}

export function PhotoSlot({
  src,
  alt,
  className,
  label,
}: {
  src: string
  alt: string
  className: string
  label: string
}) {
  const candidates = useMemo(() => {
    if (!className.includes('hero-photo-placeholder')) return [src]

    return uniqueSources([
      `${MEDIA_BASE_URL}/Photos/birthday/birthday-001-1280.webp`,
      `${MEDIA_BASE_URL}/Photos/birthday/block-01/birthday-001-1280.webp`,
      `${MEDIA_BASE_URL}/Photos/birthday/birthday-001-480.webp`,
      `${MEDIA_BASE_URL}/Photos/us/us-006-1280.webp`,
      src,
    ])
  }, [className, src])

  const candidateKey = candidates.join('|')
  const [candidateIndex, setCandidateIndex] = useState(0)
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    setCandidateIndex(0)
    setLoaded(false)
    setFailed(false)
  }, [candidateKey])

  const currentSource = candidates[candidateIndex]

  return (
    <div className={className}>
      {!failed && currentSource && (
        <img
          className={loaded ? 'media-image loaded' : 'media-image'}
          src={currentSource}
          alt={alt}
          loading={className.includes('hero-photo-placeholder') ? 'eager' : 'lazy'}
          fetchPriority={className.includes('hero-photo-placeholder') ? 'high' : 'auto'}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => {
            if (candidateIndex < candidates.length - 1) {
              setCandidateIndex((current) => current + 1)
              setLoaded(false)
              return
            }
            setFailed(true)
          }}
        />
      )}
      {!loaded && (
        <div className="media-placeholder-copy">
          <span>{label}</span>
        </div>
      )}
    </div>
  )
}

export function VideoSlot() {
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)

  return (
    <div className="video-frame">
      {!failed && (
        <video
          className={ready ? 'birthday-video ready' : 'birthday-video'}
          controls
          playsInline
          preload="metadata"
          onLoadedMetadata={() => setReady(true)}
          onError={() => setFailed(true)}
        >
          <source src="/video/message.mp4" type="video/mp4" />
        </video>
      )}
      {!ready && (
        <div className="video-placeholder-copy">
          <div className="play-icon">▶</div>
          <p>Your video message</p>
          <small>/video/message.mp4</small>
        </div>
      )}
    </div>
  )
}

const galleryItems = [
  { src: '/photos/memory-01.jpg', label: 'The first archive', caption: 'A memory worth keeping exactly as it happened.' },
  { src: '/photos/memory-02.jpg', label: 'Evidence from us', caption: 'The ordinary moments that became part of our story.' },
  { src: '/photos/memory-03.jpg', label: 'A classified favourite', caption: 'One of those photographs that says more than a caption could.' },
  { src: '/photos/memory-04.jpg', label: 'Chapter 30', caption: 'The story keeps moving, but this moment deserves to stay.' },
]

export function SwipeGallery() {
  const [active, setActive] = useState(0)
  const startX = useRef<number | null>(null)
  const current = galleryItems[active]

  const shift = (direction: number) => {
    setActive((value) => (value + direction + galleryItems.length) % galleryItems.length)
  }

  return (
    <div className="swipe-gallery">
      <div
        className="gallery-stage"
        onPointerDown={(event: ReactPointerEvent<HTMLDivElement>) => {
          startX.current = event.clientX
          event.currentTarget.setPointerCapture(event.pointerId)
        }}
        onPointerUp={(event: ReactPointerEvent<HTMLDivElement>) => {
          if (startX.current === null) return
          const delta = event.clientX - startX.current
          if (Math.abs(delta) > 45) shift(delta > 0 ? -1 : 1)
          startX.current = null
        }}
      >
        <PhotoSlot src={current.src} alt={current.caption} className="gallery-photo" label={current.label} />
        <div className="gallery-index">{String(active + 1).padStart(2, '0')} / 04</div>
        <div className="gallery-caption">
          <p>{current.caption}</p>
          <span>Swipe or use the arrows</span>
        </div>
      </div>
      <div className="gallery-controls">
        <button onClick={() => shift(-1)} aria-label="Previous memory">←</button>
        <div className="gallery-dots">
          {galleryItems.map((item, index) => (
            <button
              key={item.src}
              className={index === active ? 'active' : ''}
              onClick={() => setActive(index)}
              aria-label={`Open memory ${index + 1}`}
            />
          ))}
        </div>
        <button onClick={() => shift(1)} aria-label="Next memory">→</button>
      </div>
    </div>
  )
}

export function DanceVisualizer({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    if (!context) return
    let frame = 0
    let width = 0
    let height = 0
    let ratio = 1
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      ratio = Math.min(window.devicePixelRatio || 1, 2)
      width = rect.width
      height = rect.height
      canvas.width = width * ratio
      canvas.height = height * ratio
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
    }

    const draw = (time: number) => {
      context.clearRect(0, 0, width, height)
      const bars = Math.max(22, Math.floor(width / 20))
      const gap = 5
      const barWidth = Math.max(3, width / bars - gap)

      for (let index = 0; index < bars; index += 1) {
        const phase = index * 0.63
        const wave = reducedMotion || !active
          ? 0.28 + (index % 5) * 0.05
          : 0.22 + Math.abs(Math.sin(time / 340 + phase)) * 0.68
        const barHeight = height * wave
        const x = index * (barWidth + gap)
        const gradient = context.createLinearGradient(0, height - barHeight, 0, height)
        gradient.addColorStop(0, '#f3c979')
        gradient.addColorStop(0.55, '#ea9db9')
        gradient.addColorStop(1, 'rgba(234,157,185,.08)')
        context.fillStyle = gradient
        context.globalAlpha = 0.58 + (index % 4) * 0.1
        context.roundRect(x, height - barHeight, barWidth, barHeight, barWidth / 2)
        context.fill()
      }
      context.globalAlpha = 1
      frame = window.requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    frame = window.requestAnimationFrame(draw)
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
    }
  }, [active])

  return <canvas ref={canvasRef} className="dance-visualizer" aria-hidden="true" />
}
