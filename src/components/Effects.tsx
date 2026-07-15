import {
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

type ParticleMode = 'calm' | 'party'

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  alpha: number
  phase: number
}

export function ParticleField({ mode = 'calm' }: { mode?: ParticleMode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    if (!context) return

    let frame = 0
    let width = 0
    let height = 0
    let particles: Particle[] = []
    const pointer = { x: -10_000, y: -10_000, active: false }
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * ratio
      canvas.height = height * ratio
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(ratio, 0, 0, ratio, 0, 0)

      const targetCount = reducedMotion ? 18 : Math.min(92, Math.floor((width * height) / 13_000))
      particles = Array.from({ length: targetCount }, (_, index) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * (mode === 'party' ? 0.9 : 0.28),
        vy: (Math.random() - 0.5) * (mode === 'party' ? 0.9 : 0.28),
        radius: 0.7 + Math.random() * (mode === 'party' ? 2.3 : 1.5),
        alpha: 0.14 + Math.random() * 0.55,
        phase: index * 0.65 + Math.random() * Math.PI,
      }))
    }

    const movePointer = (event: PointerEvent) => {
      pointer.x = event.clientX
      pointer.y = event.clientY
      pointer.active = true
    }
    const leavePointer = () => { pointer.active = false }

    const draw = (time: number) => {
      context.clearRect(0, 0, width, height)
      const palette = mode === 'party'
        ? ['#f2c777', '#ef93b6', '#ffffff', '#b79cff', '#fb6f92']
        : ['#f2c777', '#efd7df', '#ffffff']

      particles.forEach((particle, index) => {
        if (!reducedMotion) {
          particle.x += particle.vx
          particle.y += particle.vy
        }

        if (pointer.active) {
          const dx = particle.x - pointer.x
          const dy = particle.y - pointer.y
          const distance = Math.hypot(dx, dy)
          if (distance > 0 && distance < 125) {
            const force = (125 - distance) / 125
            particle.x += (dx / distance) * force * 1.8
            particle.y += (dy / distance) * force * 1.8
          }
        }

        if (particle.x < -10) particle.x = width + 10
        if (particle.x > width + 10) particle.x = -10
        if (particle.y < -10) particle.y = height + 10
        if (particle.y > height + 10) particle.y = -10

        const shimmer = 0.6 + Math.sin(time / 900 + particle.phase) * 0.4
        context.beginPath()
        context.fillStyle = palette[index % palette.length]
        context.globalAlpha = particle.alpha * shimmer
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        context.fill()
      })

      context.globalAlpha = 1
      frame = window.requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', movePointer, { passive: true })
    window.addEventListener('pointerleave', leavePointer)
    frame = window.requestAnimationFrame(draw)

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', movePointer)
      window.removeEventListener('pointerleave', leavePointer)
    }
  }, [mode])

  return <canvas ref={canvasRef} className="particle-field" aria-hidden="true" />
}

export function Reveal({
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.13, rootMargin: '0px 0px -7% 0px' },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? 'reveal-visible' : ''} ${className}`}
      style={{ '--reveal-delay': `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  )
}

export function TiltCard({
  children,
  className = '',
  onClick,
}: {
  children: ReactNode
  className?: string
  onClick?: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)

  const handleMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'touch') return
    const element = ref.current
    if (!element) return
    const rect = element.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width - 0.5
    const y = (event.clientY - rect.top) / rect.height - 0.5
    element.style.setProperty('--tilt-x', `${y * -10}deg`)
    element.style.setProperty('--tilt-y', `${x * 12}deg`)
    element.style.setProperty('--shine-x', `${(x + 0.5) * 100}%`)
    element.style.setProperty('--shine-y', `${(y + 0.5) * 100}%`)
  }

  const reset = () => {
    const element = ref.current
    if (!element) return
    element.style.setProperty('--tilt-x', '0deg')
    element.style.setProperty('--tilt-y', '0deg')
  }

  return (
    <div
      ref={ref}
      className={`tilt-card ${className}`}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(event: ReactKeyboardEvent<HTMLDivElement>) => {
        if (onClick && (event.key === 'Enter' || event.key === ' ')) onClick()
      }}
    >
      {children}
    </div>
  )
}

const sections = [
  ['top', 'Opening'],
  ['profile', 'Profile'],
  ['eras', 'Eras'],
  ['evidence', 'Evidence'],
  ['memories', 'Archives'],
  ['reasons', '30 reasons'],
  ['message', 'Message'],
  ['promise', 'Promise'],
] as const

export function CaseProgress({ starsFound }: { starsFound: number }) {
  const [progress, setProgress] = useState(0)
  const [activeSection, setActiveSection] = useState('Opening')

  useEffect(() => {
    let ticking = false
    const update = () => {
      const maximum = document.documentElement.scrollHeight - window.innerHeight
      const next = maximum > 0 ? Math.min(1, window.scrollY / maximum) : 0
      setProgress(next)

      let current = 'Opening'
      for (const [id, label] of sections) {
        const element = document.getElementById(id)
        if (element && element.getBoundingClientRect().top <= window.innerHeight * 0.42) current = label
      }
      setActiveSection(current)
      ticking = false
    }
    const onScroll = () => {
      if (!ticking) {
        ticking = true
        window.requestAnimationFrame(update)
      }
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <>
      <div className="reading-progress" aria-hidden="true">
        <span style={{ transform: `scaleX(${progress})` }} />
      </div>
      <aside className="case-progress" aria-label="Page progress">
        <span className="case-progress-label">{activeSection}</span>
        <strong>{Math.round(progress * 100)}%</strong>
        <span className="star-counter">✦ {starsFound}/13</span>
      </aside>
    </>
  )
}

const starPositions = [
  [5.5, 82], [11.5, 12], [18.5, 89], [25, 7], [32.5, 78], [40.5, 17], [48, 92],
  [56.5, 9], [64, 83], [71.5, 21], [79, 91], [87, 12], [94, 76],
]

export function SecretStars({
  found,
  onFind,
}: {
  found: Set<number>
  onFind: (index: number, point: { x: number; y: number }) => void
}) {
  return (
    <div className="secret-stars" aria-label="Thirteen hidden birthday stars">
      {starPositions.map(([top, left], index) => {
        const discovered = found.has(index)
        return (
          <button
            key={index}
            className={`secret-star ${discovered ? 'secret-star-found' : ''}`}
            style={{ '--star-top': `${top}%`, '--star-left': `${left}%`, '--star-delay': `${index * -0.27}s` } as CSSProperties}
            onClick={(event: ReactMouseEvent<HTMLButtonElement>) => {
              if (discovered) return
              const rect = event.currentTarget.getBoundingClientRect()
              onFind(index, { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 })
            }}
            aria-label={discovered ? `Secret star ${index + 1} discovered` : `Discover secret star ${index + 1}`}
          >
            ✦
          </button>
        )
      })}
    </div>
  )
}

type Burst = { id: number; x: number; y: number; symbol: string; angle: number; distance: number; delay: number }

export function BurstLayer({ burst }: { burst: { id: number; x: number; y: number } | null }) {
  const pieces = useMemo<Burst[]>(() => {
    if (!burst) return []
    const symbols = ['✦', '♡', '·', '✧']
    return Array.from({ length: 20 }, (_, index) => ({
      id: burst.id * 100 + index,
      x: burst.x,
      y: burst.y,
      symbol: symbols[index % symbols.length],
      angle: (360 / 20) * index + Math.random() * 10,
      distance: 42 + Math.random() * 86,
      delay: Math.random() * 80,
    }))
  }, [burst])

  return (
    <div className="burst-layer" aria-hidden="true">
      {pieces.map((piece) => (
        <span
          key={piece.id}
          style={{
            left: piece.x,
            top: piece.y,
            '--burst-angle': `${piece.angle}deg`,
            '--burst-distance': `${piece.distance}px`,
            '--burst-delay': `${piece.delay}ms`,
          } as CSSProperties}
        >
          {piece.symbol}
        </span>
      ))}
    </div>
  )
}

export function DodgingButton({ onCaught }: { onCaught: () => void }) {
  const [attempts, setAttempts] = useState(0)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const catchable = attempts >= 4

  const dodge = () => {
    if (catchable) return
    const nextAttempt = attempts + 1
    setAttempts(nextAttempt)
    const angle = nextAttempt * 1.9 + Math.random()
    const distance = 44 + nextAttempt * 8
    setOffset({ x: Math.cos(angle) * distance, y: Math.sin(angle) * Math.min(distance, 54) })
  }

  const activate = (event: ReactMouseEvent<HTMLButtonElement>) => {
    if (!catchable) {
      event.preventDefault()
      dodge()
      return
    }
    onCaught()
  }

  return (
    <div className="dodge-zone">
      <button
        className={`dodge-button ${catchable ? 'dodge-button-ready' : ''}`}
        style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
        onMouseEnter={dodge}
        onClick={activate}
      >
        {catchable ? 'Okay… open the final file' : attempts === 0 ? 'Do not press this button' : `Nice try ${attempts}/4`}
      </button>
    </div>
  )
}

export function FinaleOverlay({
  visible,
  onClose,
  starsFound,
}: {
  visible: boolean
  onClose: () => void
  starsFound: number
}) {
  const confetti = useMemo(() => Array.from({ length: 90 }, (_, index) => ({
    id: index,
    left: Math.random() * 100,
    delay: Math.random() * 1.7,
    duration: 2.8 + Math.random() * 2.8,
    drift: -120 + Math.random() * 240,
    rotation: Math.random() * 720,
    symbol: ['♡', '✦', '30', 'E', '♪'][index % 5],
  })), [])

  if (!visible) return null

  return (
    <div className="finale-overlay" role="dialog" aria-modal="true" aria-label="Birthday finale">
      <div className="confetti-rain" aria-hidden="true">
        {confetti.map((piece) => (
          <span
            key={piece.id}
            style={{
              left: `${piece.left}%`,
              '--fall-delay': `${piece.delay}s`,
              '--fall-duration': `${piece.duration}s`,
              '--fall-drift': `${piece.drift}px`,
              '--fall-rotation': `${piece.rotation}deg`,
            } as CSSProperties}
          >
            {piece.symbol}
          </span>
        ))}
      </div>
      <div className="finale-card">
        <p className="eyebrow">Final verdict</p>
        <h2>Case closed.</h2>
        <p>Emily is 30, deeply loved, dangerously good at analysing people and only getting started.</p>
        <div className="finale-stat">Secret stars discovered: {starsFound}/13</div>
        <button className="primary-button" onClick={onClose}>Return to the story</button>
      </div>
    </div>
  )
}

export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)').matches
    if (!finePointer) return
    const move = (event: PointerEvent) => {
      const element = ref.current
      if (!element) return
      element.animate(
        { transform: `translate3d(${event.clientX - 150}px, ${event.clientY - 150}px, 0)` },
        { duration: 650, fill: 'forwards', easing: 'cubic-bezier(.2,.8,.2,1)' },
      )
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => window.removeEventListener('pointermove', move)
  }, [])

  return <div ref={ref} className="cursor-glow" aria-hidden="true" />
}

export function playChime(enabled: boolean, notes: number[] = [523.25, 659.25, 783.99]) {
  if (!enabled || typeof window === 'undefined') return
  const AudioContextConstructor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!AudioContextConstructor) return
  const context = new AudioContextConstructor()
  const now = context.currentTime

  notes.forEach((frequency, index) => {
    const oscillator = context.createOscillator()
    const gain = context.createGain()
    oscillator.type = index % 2 === 0 ? 'sine' : 'triangle'
    oscillator.frequency.value = frequency
    gain.gain.setValueAtTime(0, now + index * 0.09)
    gain.gain.linearRampToValueAtTime(0.07, now + index * 0.09 + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.09 + 0.48)
    oscillator.connect(gain)
    gain.connect(context.destination)
    oscillator.start(now + index * 0.09)
    oscillator.stop(now + index * 0.09 + 0.5)
  })

  window.setTimeout(() => void context.close(), 900)
}
