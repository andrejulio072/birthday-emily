import { useEffect, useRef } from 'react'

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

function getPerformanceProfile() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const coarsePointer = window.matchMedia('(pointer: coarse)').matches
  const smallScreen = window.innerWidth <= 820
  const deviceMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory
  const lowMemory = typeof deviceMemory === 'number' && deviceMemory <= 4
  const mobile = coarsePointer || smallScreen

  return {
    reducedMotion,
    mobile,
    lowPower: reducedMotion || mobile || lowMemory,
  }
}

export function AdaptiveParticleField({ mode = 'calm' }: { mode?: ParticleMode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const parent = canvas?.parentElement
    if (!canvas || !parent) return

    const context = canvas.getContext('2d', { alpha: true })
    if (!context) return

    const profile = getPerformanceProfile()
    const pointer = { x: -10_000, y: -10_000, active: false }
    let particles: Particle[] = []
    let frame = 0
    let width = 1
    let height = 1
    let visible = true
    let pageVisible = !document.hidden
    let lastPaint = 0

    const frameInterval = profile.lowPower ? 1000 / 24 : 1000 / 50

    const resize = () => {
      const rect = parent.getBoundingClientRect()
      width = Math.max(1, rect.width)
      height = Math.max(1, rect.height)
      const ratio = profile.lowPower ? 1 : Math.min(window.devicePixelRatio || 1, 1.5)

      canvas.width = Math.round(width * ratio)
      canvas.height = Math.round(height * ratio)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(ratio, 0, 0, ratio, 0, 0)

      const areaCount = Math.floor((width * height) / 22_000)
      const targetCount = profile.lowPower
        ? mode === 'party' ? 20 : 14
        : Math.min(mode === 'party' ? 72 : 58, Math.max(22, areaCount))

      particles = Array.from({ length: targetCount }, (_, index) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * (mode === 'party' ? 0.65 : 0.2),
        vy: (Math.random() - 0.5) * (mode === 'party' ? 0.65 : 0.2),
        radius: 0.6 + Math.random() * (mode === 'party' ? 1.8 : 1.2),
        alpha: 0.12 + Math.random() * 0.42,
        phase: index * 0.65 + Math.random() * Math.PI,
      }))
    }

    const drawFrame = (time: number) => {
      frame = window.requestAnimationFrame(drawFrame)
      if (!visible || !pageVisible || time - lastPaint < frameInterval) return
      lastPaint = time

      context.clearRect(0, 0, width, height)
      const palette = mode === 'party'
        ? ['#f2c777', '#ef93b6', '#ffffff', '#b79cff']
        : ['#f2c777', '#efd7df', '#ffffff']

      particles.forEach((particle, index) => {
        if (!profile.reducedMotion) {
          particle.x += particle.vx
          particle.y += particle.vy
        }

        if (!profile.lowPower && pointer.active) {
          const dx = particle.x - pointer.x
          const dy = particle.y - pointer.y
          const distance = Math.hypot(dx, dy)
          if (distance > 0 && distance < 110) {
            const force = (110 - distance) / 110
            particle.x += (dx / distance) * force * 1.25
            particle.y += (dy / distance) * force * 1.25
          }
        }

        if (particle.x < -8) particle.x = width + 8
        if (particle.x > width + 8) particle.x = -8
        if (particle.y < -8) particle.y = height + 8
        if (particle.y > height + 8) particle.y = -8

        const shimmer = profile.reducedMotion ? 0.75 : 0.65 + Math.sin(time / 1000 + particle.phase) * 0.35
        context.beginPath()
        context.fillStyle = palette[index % palette.length]
        context.globalAlpha = particle.alpha * shimmer
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        context.fill()
      })

      context.globalAlpha = 1
    }

    const handlePointer = (event: PointerEvent) => {
      if (profile.lowPower) return
      const rect = parent.getBoundingClientRect()
      pointer.x = event.clientX - rect.left
      pointer.y = event.clientY - rect.top
      pointer.active = true
    }

    const handleVisibility = () => {
      pageVisible = !document.hidden
    }

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => { visible = entry.isIntersecting },
      { rootMargin: '160px 0px', threshold: 0 },
    )
    intersectionObserver.observe(parent)

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(parent)

    resize()
    parent.addEventListener('pointermove', handlePointer, { passive: true })
    parent.addEventListener('pointerleave', () => { pointer.active = false })
    document.addEventListener('visibilitychange', handleVisibility)
    frame = window.requestAnimationFrame(drawFrame)

    return () => {
      window.cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      parent.removeEventListener('pointermove', handlePointer)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [mode])

  return <canvas ref={canvasRef} className="particle-field adaptive-particle-field" aria-hidden="true" />
}

export function AdaptiveDanceVisualizer({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d', { alpha: true })
    if (!context) return

    const profile = getPerformanceProfile()
    let frame = 0
    let visible = false
    let width = 1
    let height = 1
    let lastPaint = 0
    const frameInterval = profile.lowPower ? 1000 / 20 : 1000 / 45

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      width = Math.max(1, rect.width)
      height = Math.max(1, rect.height)
      const ratio = profile.lowPower ? 1 : Math.min(window.devicePixelRatio || 1, 1.5)
      canvas.width = Math.round(width * ratio)
      canvas.height = Math.round(height * ratio)
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
    }

    const draw = (time: number) => {
      frame = window.requestAnimationFrame(draw)
      if (!visible || document.hidden || time - lastPaint < frameInterval) return
      lastPaint = time
      context.clearRect(0, 0, width, height)

      const bars = profile.lowPower ? 18 : Math.max(24, Math.floor(width / 22))
      const gap = profile.lowPower ? 6 : 5
      const barWidth = Math.max(3, width / bars - gap)

      for (let index = 0; index < bars; index += 1) {
        const phase = index * 0.63
        const wave = profile.reducedMotion || !active
          ? 0.22 + (index % 5) * 0.045
          : 0.2 + Math.abs(Math.sin(time / 390 + phase)) * 0.62
        const barHeight = height * wave
        const x = index * (barWidth + gap)
        const gradient = context.createLinearGradient(0, height - barHeight, 0, height)
        gradient.addColorStop(0, '#f3c979')
        gradient.addColorStop(0.55, '#ea9db9')
        gradient.addColorStop(1, 'rgba(234,157,185,.06)')
        context.fillStyle = gradient
        context.globalAlpha = 0.58 + (index % 4) * 0.08
        context.fillRect(x, height - barHeight, barWidth, barHeight)
      }
      context.globalAlpha = 1
    }

    const observer = new IntersectionObserver(
      ([entry]) => { visible = entry.isIntersecting },
      { rootMargin: '120px 0px', threshold: 0 },
    )
    observer.observe(canvas)

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(canvas)
    resize()
    frame = window.requestAnimationFrame(draw)

    return () => {
      window.cancelAnimationFrame(frame)
      observer.disconnect()
      resizeObserver.disconnect()
    }
  }, [active])

  return <canvas ref={canvasRef} className="dance-visualizer adaptive-dance-visualizer" aria-hidden="true" />
}
