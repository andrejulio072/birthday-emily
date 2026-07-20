import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Reveal } from './Effects'
import { ResolvedPhoto, type ResolvedPhotoDetails } from './ResolvedPhoto'
import { albums, loadAlbum, totalPreparedMemories } from '../photoData/registry'
import { photoSourceCandidates } from '../photoData/sourceCandidates'
import type { PhotoMemory } from '../photoData/types'

export function RomanceArchive() {
  const sectionRef = useRef<HTMLElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)
  const touchStartX = useRef<number | null>(null)
  const [activeAlbum, setActiveAlbum] = useState(0)
  const [photos, setPhotos] = useState<PhotoMemory[]>([])
  const [albumCounts, setAlbumCounts] = useState<Record<string, number>>(() =>
    Object.fromEntries(albums.map((album) => [album.id, album.count])),
  )
  const [loadedPhotoIds, setLoadedPhotoIds] = useState<Set<string>>(() => new Set())
  const [failedPhotoIds, setFailedPhotoIds] = useState<Set<string>>(() => new Set())
  const [loading, setLoading] = useState(false)
  const [armed, setArmed] = useState(false)
  const [selected, setSelected] = useState<number | null>(null)
  const [lightboxLoaded, setLightboxLoaded] = useState(false)
  const [lightboxError, setLightboxError] = useState(false)
  const [archiveSource, setArchiveSource] = useState<'supabase' | 'fallback'>('fallback')

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setArmed(true)
        observer.disconnect()
      },
      { rootMargin: '900px 0px', threshold: 0 },
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!armed) return

    let cancelled = false
    const album = albums[activeAlbum]

    setLoading(true)
    setLoadedPhotoIds(new Set())
    setFailedPhotoIds(new Set())

    loadAlbum(album).then((result) => {
      if (cancelled) return
      setPhotos(result.photos)
      setArchiveSource(result.source)
      setAlbumCounts((current) => ({ ...current, [album.id]: result.photos.length }))
      setLoading(false)
    })

    return () => {
      cancelled = true
    }
  }, [activeAlbum, armed])

  const album = albums[activeAlbum]
  const current = selected === null ? null : photos[selected]

  const closeLightbox = useCallback(() => setSelected(null), [])
  const showPrevious = useCallback(() => {
    setSelected((value) => {
      if (value === null || photos.length === 0) return value
      return (value - 1 + photos.length) % photos.length
    })
  }, [photos.length])
  const showNext = useCallback(() => {
    setSelected((value) => {
      if (value === null || photos.length === 0) return value
      return (value + 1) % photos.length
    })
  }, [photos.length])

  useEffect(() => {
    if (selected === null || photos.length === 0) return

    previousFocusRef.current = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null
    document.body.classList.add('archive-lightbox-open')

    const focusTimer = window.setTimeout(() => closeButtonRef.current?.focus(), 0)
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeLightbox()
      if (event.key === 'ArrowRight') showNext()
      if (event.key === 'ArrowLeft') showPrevious()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.clearTimeout(focusTimer)
      document.body.classList.remove('archive-lightbox-open')
      window.removeEventListener('keydown', handleKeyDown)
      previousFocusRef.current?.focus()
    }
  }, [selected, photos.length, closeLightbox, showNext, showPrevious])

  useEffect(() => {
    setLightboxLoaded(false)
    setLightboxError(false)
  }, [current?.id])

  useEffect(() => {
    if (selected === null || photos.length < 2) return

    const neighbourIndexes = [
      (selected - 1 + photos.length) % photos.length,
      (selected + 1) % photos.length,
    ]

    neighbourIndexes.forEach((index) => {
      const source = photoSourceCandidates(photos[index], 'display')[0]
      if (!source) return
      const preload = new Image()
      preload.decoding = 'async'
      preload.src = source
    })
  }, [selected, photos])

  const organisedTotal = useMemo(
    () => Object.values(albumCounts).reduce((total, count) => total + count, 0),
    [albumCounts],
  )
  const archiveProgress = Math.min(organisedTotal || totalPreparedMemories, 100)

  const markCardReady = useCallback((photoId: string, details: ResolvedPhotoDetails) => {
    setLoadedPhotoIds((currentIds) => {
      if (currentIds.has(photoId)) return currentIds
      const next = new Set(currentIds)
      next.add(photoId)
      return next
    })
    setFailedPhotoIds((currentIds) => {
      if (!currentIds.has(photoId)) return currentIds
      const next = new Set(currentIds)
      next.delete(photoId)
      return next
    })

    if (!details.width || !details.height) return
    const orientation = details.height > details.width ? 'portrait' : 'landscape'

    setPhotos((currentPhotos) => currentPhotos.map((photo) => {
      if (photo.id !== photoId) return photo
      if (
        photo.width === details.width &&
        photo.height === details.height &&
        photo.orientation === orientation
      ) return photo

      return {
        ...photo,
        width: details.width,
        height: details.height,
        orientation,
      }
    }))
  }, [])

  const markCardFailed = useCallback((photoId: string) => {
    setFailedPhotoIds((currentIds) => {
      if (currentIds.has(photoId)) return currentIds
      const next = new Set(currentIds)
      next.add(photoId)
      return next
    })
  }, [])

  const lightbox = current && selected !== null ? (
    <div
      className="memory-lightbox"
      role="dialog"
      aria-modal="true"
      aria-labelledby="memory-lightbox-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closeLightbox()
      }}
      onTouchStart={(event) => {
        touchStartX.current = event.touches[0]?.clientX ?? null
      }}
      onTouchEnd={(event) => {
        if (touchStartX.current === null) return
        const endX = event.changedTouches[0]?.clientX ?? touchStartX.current
        const distance = endX - touchStartX.current
        touchStartX.current = null
        if (Math.abs(distance) < 55) return
        if (distance > 0) showPrevious()
        else showNext()
      }}
    >
      <div className="lightbox-topbar">
        <span>{album.title}</span>
        <strong>{String(selected + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}</strong>
      </div>

      <button
        ref={closeButtonRef}
        className="lightbox-close"
        onClick={closeLightbox}
        aria-label="Close photograph"
      >×</button>

      <button className="lightbox-arrow previous" onClick={showPrevious} aria-label="Previous photograph">←</button>

      <figure className={`lightbox-frame ${current.orientation}`} onMouseDown={(event) => event.stopPropagation()}>
        <div className="lightbox-media">
          {!lightboxLoaded && !lightboxError && <div className="lightbox-loader" aria-label="Loading full-size photograph" />}
          {!lightboxError && (
            <ResolvedPhoto
              key={`lightbox-${current.id}`}
              photo={current}
              variant="display"
              className={lightboxLoaded ? 'lightbox-photo loaded' : 'lightbox-photo'}
              eager
              onResolved={() => setLightboxLoaded(true)}
              onExhausted={() => {
                setLightboxError(true)
                setLightboxLoaded(true)
              }}
            />
          )}
          {lightboxError && (
            <div className="lightbox-unavailable">
              <span>Photograph temporarily unavailable</span>
              <p>The card remains organised and will reconnect when its full image is available.</p>
            </div>
          )}
        </div>
        <figcaption>
          <div>
            <span>{album.title}</span>
            <strong id="memory-lightbox-title">{current.caption}</strong>
          </div>
          <small>Use ← → or swipe to continue</small>
        </figcaption>
      </figure>

      <button className="lightbox-arrow next" onClick={showNext} aria-label="Next photograph">→</button>
    </div>
  ) : null

  return (
    <>
      <section ref={sectionRef} className="romance-archive" id="memories" data-archive-source={archiveSource}>
        <div className="archive-orbit" aria-hidden="true" />

        <Reveal className="section-heading archive-heading">
          <p className="eyebrow">The real love story</p>
          <h2>More than a case file.<br /><em>These are us.</em></h2>
          <p>All {totalPreparedMemories} photographs are organised into four chapters, with a full-screen viewer designed for every image shape.</p>
        </Reveal>

        <div className="archive-dashboard">
          <div className="archive-counter">
            <strong>{String(organisedTotal || totalPreparedMemories).padStart(3, '0')}</strong>
            <span>photographs organised</span>
          </div>
          <div className="archive-capacity">
            <div><span style={{ width: `${archiveProgress}%` }} /></div>
            <p>Cards use lightweight images. Clicking opens the best available full-size photograph without stretching or forced cropping.</p>
          </div>
          <div className={`archive-source-badge ${archiveSource}`}>
            <i />
            {archiveSource === 'supabase' ? 'Live archive' : 'Curated archive'}
          </div>
        </div>

        <div className="album-tabs" role="tablist" aria-label="Photo albums">
          {albums.map((item, index) => (
            <button
              id={`album-tab-${item.id}`}
              key={item.id}
              className={activeAlbum === index ? 'active' : ''}
              onClick={() => {
                setActiveAlbum(index)
                setSelected(null)
              }}
              role="tab"
              aria-controls={`album-panel-${item.id}`}
              aria-selected={activeAlbum === index}
            >
              <span>Chapter {String(index + 1).padStart(2, '0')}</span>
              <strong>{item.title}</strong>
              <small>{item.subtitle} · {albumCounts[item.id] ?? item.count} photographs</small>
            </button>
          ))}
        </div>

        <div
          id={`album-panel-${album.id}`}
          className={`${loading ? 'memory-grid loading' : 'memory-grid'} album-${album.id}`}
          role="tabpanel"
          aria-labelledby={`album-tab-${album.id}`}
          aria-busy={loading}
        >
          {loading && Array.from({ length: 8 }, (_, index) => <div className="memory-skeleton" key={index} />)}

          {!loading && photos.map((photo, index) => {
            const isReady = loadedPhotoIds.has(photo.id)
            const hasFailed = failedPhotoIds.has(photo.id)

            return (
              <button
                className={`memory-card ${photo.orientation} ${isReady ? 'media-ready' : 'media-pending'} ${hasFailed ? 'media-failed' : ''}`}
                key={photo.id}
                onClick={() => setSelected(index)}
                aria-label={isReady ? `Open ${photo.caption}` : `${photo.caption}. Photograph loading.`}
                disabled={!isReady}
              >
                <ResolvedPhoto
                  photo={photo}
                  variant="thumb"
                  className="memory-card-photo"
                  eager={index < 6}
                  onResolved={(details) => markCardReady(photo.id, details)}
                  onExhausted={() => markCardFailed(photo.id)}
                />
                {hasFailed && <span className="memory-unavailable">Image reconnecting</span>}
                <span className="memory-number">{String(index + 1).padStart(2, '0')}</span>
                <div className="memory-caption">
                  <small>{album.title}</small>
                  <strong>{photo.caption}</strong>
                </div>
              </button>
            )
          })}
        </div>

        <div className="archive-next-blocks">
          <span>{totalPreparedMemories} photographs connected</span>
          <p>Chapter 30 · Us · Adventures · Alicante</p>
        </div>
      </section>

      {lightbox && typeof document !== 'undefined' ? createPortal(lightbox, document.body) : null}
    </>
  )
}
