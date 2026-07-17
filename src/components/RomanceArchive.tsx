import { useEffect, useMemo, useRef, useState } from 'react'
import { Reveal } from './Effects'
import { albums, loadAlbum, totalPreparedMemories } from '../photoData/registry'
import type { PhotoMemory } from '../photoData/types'

export function RomanceArchive() {
  const sectionRef = useRef<HTMLElement>(null)
  const [activeAlbum, setActiveAlbum] = useState(0)
  const [photos, setPhotos] = useState<PhotoMemory[]>([])
  const [albumCounts, setAlbumCounts] = useState<Record<string, number>>(() =>
    Object.fromEntries(albums.map((album) => [album.id, album.count])),
  )
  const [loadedPhotoIds, setLoadedPhotoIds] = useState<Set<string>>(() => new Set())
  const [previewPhotoIds, setPreviewPhotoIds] = useState<Set<string>>(() => new Set())
  const [loading, setLoading] = useState(false)
  const [armed, setArmed] = useState(false)
  const [selected, setSelected] = useState<number | null>(null)
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
      { rootMargin: '650px 0px', threshold: 0 },
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
    setPreviewPhotoIds(new Set())

    loadAlbum(album).then((result) => {
      if (cancelled) return
      setPhotos(result.photos)
      setArchiveSource(result.source)
      setAlbumCounts((current) => ({ ...current, [album.id]: result.photos.length }))
      setLoading(false)
    })

    return () => { cancelled = true }
  }, [activeAlbum, armed])

  useEffect(() => {
    if (selected === null || photos.length === 0) return
    document.body.style.overflow = 'hidden'
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelected(null)
      if (event.key === 'ArrowRight') setSelected((value) => value === null ? null : (value + 1) % photos.length)
      if (event.key === 'ArrowLeft') setSelected((value) => value === null ? null : (value - 1 + photos.length) % photos.length)
    }
    window.addEventListener('keydown', close)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', close)
    }
  }, [selected, photos.length])

  const album = albums[activeAlbum]
  const current = selected === null ? null : photos[selected]
  const organisedTotal = useMemo(
    () => Object.values(albumCounts).reduce((total, count) => total + count, 0),
    [albumCounts],
  )
  const archiveProgress = Math.min(organisedTotal || totalPreparedMemories, 100)

  function markReady(photoId: string, image?: HTMLImageElement) {
    setLoadedPhotoIds((currentIds) => {
      const nextIds = new Set(currentIds)
      nextIds.add(photoId)
      return nextIds
    })

    if (!image || !image.naturalWidth || !image.naturalHeight) return
    const orientation = image.naturalHeight > image.naturalWidth ? 'portrait' : 'landscape'
    setPhotos((currentPhotos) => currentPhotos.map((photo) => {
      if (photo.id !== photoId) return photo
      if (
        photo.width === image.naturalWidth &&
        photo.height === image.naturalHeight &&
        photo.orientation === orientation
      ) return photo
      return {
        ...photo,
        width: image.naturalWidth,
        height: image.naturalHeight,
        orientation,
      }
    }))
  }

  function showEmbeddedPreview(photo: PhotoMemory, image: HTMLImageElement) {
    if (image.dataset.displayFallback !== 'true' && photo.displaySrc && image.currentSrc !== photo.displaySrc) {
      image.dataset.displayFallback = 'true'
      image.srcset = ''
      image.src = photo.displaySrc
      return
    }

    if (image.dataset.previewFallback === 'true') return
    image.dataset.previewFallback = 'true'
    image.srcset = ''
    image.src = photo.blurDataUrl
    setPreviewPhotoIds((currentIds) => {
      const nextIds = new Set(currentIds)
      nextIds.add(photo.id)
      return nextIds
    })
    markReady(photo.id)
  }

  return (
    <section ref={sectionRef} className="romance-archive" id="memories" data-archive-source={archiveSource}>
      <div className="archive-orbit" aria-hidden="true" />
      <Reveal className="section-heading archive-heading">
        <p className="eyebrow">The real love story</p>
        <h2>More than a case file.<br /><em>These are us.</em></h2>
        <p>The investigation was the joke. This is the evidence that matters: real smiles, ordinary days and the memories we are still building.</p>
      </Reveal>

      <div className="archive-dashboard">
        <div className="archive-counter">
          <strong>{String(organisedTotal || totalPreparedMemories).padStart(3, '0')}</strong>
          <span>memories organised</span>
        </div>
        <div className="archive-capacity">
          <div><span style={{ width: `${archiveProgress}%` }} /></div>
          <p>
            {archiveSource === 'supabase'
              ? 'The live archive is connected. New photos added to each chapter can appear here automatically.'
              : 'The archive is ready, with lightweight previews keeping every chapter visible while the full photographs are added.'}
          </p>
        </div>
        <div className={`archive-source-badge ${archiveSource}`}>
          <i />
          {archiveSource === 'supabase' ? 'Live archive' : 'Preview archive'}
        </div>
      </div>

      <div className="album-tabs" role="tablist" aria-label="Photo albums">
        {albums.map((item, index) => (
          <button
            key={item.id}
            className={activeAlbum === index ? 'active' : ''}
            onClick={() => { setActiveAlbum(index); setSelected(null) }}
            role="tab"
            aria-selected={activeAlbum === index}
          >
            <span>Chapter {String(index + 1).padStart(2, '0')}</span>
            <strong>{item.title}</strong>
            <small>{item.subtitle} · {albumCounts[item.id] ?? item.count} memories</small>
          </button>
        ))}
        <div className="future-album" aria-label="Future photo blocks">
          <span>+</span>
          <p>More chapters ready</p>
        </div>
      </div>

      <div className={`${loading ? 'memory-grid loading' : 'memory-grid'} album-${album.id}`} aria-live="polite">
        {loading && Array.from({ length: 4 }, (_, index) => <div className="memory-skeleton" key={index} />)}
        {!loading && photos.map((photo, index) => {
          const isReady = loadedPhotoIds.has(photo.id)
          const isPreview = previewPhotoIds.has(photo.id)
          return (
            <button
              className={`memory-card ${photo.orientation} ${isReady ? 'media-ready' : 'media-pending'} ${isPreview ? 'embedded-preview' : ''}`}
              key={photo.id}
              onClick={() => { if (isReady) setSelected(index) }}
              aria-label={isReady ? `Open ${photo.caption}` : `${photo.caption}. Loading preview.`}
              aria-disabled={!isReady}
              style={{ backgroundImage: `url(${photo.blurDataUrl})`, backgroundSize: 'cover', backgroundPosition: photo.position }}
            >
              <img
                src={photo.thumbSrc}
                srcSet={photo.thumbSrc === photo.displaySrc ? undefined : `${photo.thumbSrc} 480w, ${photo.displaySrc} 1280w`}
                sizes="(max-width: 540px) 100vw, (max-width: 820px) 50vw, 34vw"
                width={photo.width}
                height={photo.height}
                alt={photo.alt}
                loading="lazy"
                decoding="async"
                style={{ objectPosition: photo.position }}
                onLoad={(event) => markReady(photo.id, event.currentTarget)}
                onError={(event) => showEmbeddedPreview(photo, event.currentTarget)}
              />
              {isPreview && <span className="media-status">Preview · Full photograph pending</span>}
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
        <span>Storage chapters connected</span>
        <p>Couple · Dublin · Alicante · More folders can be added later without rebuilding the gallery</p>
      </div>

      {current && selected !== null && (
        <div className="memory-lightbox" role="dialog" aria-modal="true" aria-label={current.caption} onClick={() => setSelected(null)}>
          <button className="lightbox-close" onClick={() => setSelected(null)} aria-label="Close photo">×</button>
          <button
            className="lightbox-arrow previous"
            onClick={(event) => { event.stopPropagation(); setSelected((selected - 1 + photos.length) % photos.length) }}
            aria-label="Previous photo"
          >←</button>
          <figure onClick={(event) => event.stopPropagation()}>
            <img
              src={current.displaySrc}
              alt={current.alt}
              style={{ objectPosition: current.position }}
              decoding="async"
              onError={(event) => {
                const image = event.currentTarget
                if (image.dataset.thumbFallback !== 'true' && current.thumbSrc !== current.displaySrc) {
                  image.dataset.thumbFallback = 'true'
                  image.src = current.thumbSrc
                  return
                }
                if (image.dataset.previewFallback === 'true') return
                image.dataset.previewFallback = 'true'
                image.src = current.blurDataUrl
              }}
            />
            <figcaption>
              <span>{album.title}{previewPhotoIds.has(current.id) ? ' · Preview' : ''}</span>
              <strong>{current.caption}</strong>
            </figcaption>
          </figure>
          <button
            className="lightbox-arrow next"
            onClick={(event) => { event.stopPropagation(); setSelected((selected + 1) % photos.length) }}
            aria-label="Next photo"
          >→</button>
        </div>
      )}
    </section>
  )
}
