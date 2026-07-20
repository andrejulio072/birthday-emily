import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Reveal } from './Effects'
import { MEDIA_BASE_URL } from '../config/media'
import { albums, loadAlbum, totalPreparedMemories } from '../photoData/registry'
import type { PhotoMemory } from '../photoData/types'

const chapterFolders: Record<PhotoMemory['chapter'], string> = {
  birthday: 'birthday',
  us: 'us',
  quiet: 'quiet-days',
  adventures: 'adventures',
  training: 'training',
  'many-sides': 'many-sides',
  alicante: 'alicante',
}

function unique(values: Array<string | undefined>) {
  return [...new Set(values.filter((value): value is string => Boolean(value)))]
}

function fileNameFromUrl(source: string) {
  if (!source || source.startsWith('data:')) return ''
  try {
    return decodeURIComponent(new URL(source, MEDIA_BASE_URL).pathname.split('/').pop() || '')
  } catch {
    return source.split('/').pop() || ''
  }
}

function storageCandidates(source: string, photo: PhotoMemory) {
  if (!source || source.startsWith('data:')) return []

  const fileName = fileNameFromUrl(source)
  if (!fileName) return [source]

  const folder = chapterFolders[photo.chapter]
  const rawName = `${photo.id}.jpg`

  return unique([
    source,
    `${MEDIA_BASE_URL}/Photos/${folder}/${fileName}`,
    `${MEDIA_BASE_URL}/Photos/${folder}/block-01/${fileName}`,
    `${MEDIA_BASE_URL}/${fileName}`,
    `${MEDIA_BASE_URL}/Photos/${folder}/raw/${rawName}`,
  ])
}

function isFullEmbeddedPhoto(source: string | undefined) {
  return Boolean(source?.startsWith('data:image/') && source.length > 800)
}

function photoCandidates(photo: PhotoMemory) {
  const preferred = [
    photo.fallbackDisplaySrc,
    photo.displaySrc,
    photo.fallbackThumbSrc,
    photo.thumbSrc,
  ]

  const remoteSources = preferred.filter(
    (source): source is string => typeof source === 'string' && !source.startsWith('data:'),
  )
  const embeddedSources = preferred.filter(
    (source): source is string => typeof source === 'string' && source.startsWith('data:image/'),
  )
  const embeddedFullPhoto = isFullEmbeddedPhoto(photo.blurDataUrl) ? [photo.blurDataUrl] : []

  return unique([
    ...remoteSources.flatMap((source) => storageCandidates(source, photo)),
    ...embeddedSources,
    ...embeddedFullPhoto,
  ])
}

function fallbackArtwork(photo: PhotoMemory) {
  const escapedCaption = photo.caption.replace(/[<>&'\"]/g, '')
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="720" height="900" viewBox="0 0 720 900"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#24101f"/><stop offset=".52" stop-color="#6d294f"/><stop offset="1" stop-color="#d7b77c"/></linearGradient></defs><rect width="720" height="900" fill="url(#g)"/><circle cx="590" cy="150" r="180" fill="none" stroke="rgba(255,255,255,.15)" stroke-width="2"/><text x="54" y="720" fill="#f4c66f" font-family="Georgia,serif" font-size="24">EMILY ARCHIVE</text><text x="54" y="772" fill="#fff" font-family="Georgia,serif" font-size="34">${escapedCaption}</text><text x="54" y="825" fill="rgba(255,255,255,.68)" font-family="Arial,sans-serif" font-size="18">Photograph unavailable</text></svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

type ArchiveImageProps = {
  photo: PhotoMemory
  eager?: boolean
  onReady: (photoId: string, image: HTMLImageElement | null) => void
}

function ArchiveImage({ photo, eager = false, onReady }: ArchiveImageProps) {
  const candidates = useMemo(() => photoCandidates(photo), [
    photo.id,
    photo.thumbSrc,
    photo.displaySrc,
    photo.fallbackThumbSrc,
    photo.fallbackDisplaySrc,
    photo.blurDataUrl,
    photo.chapter,
  ])
  const candidateKey = candidates.join('|')
  const [source, setSource] = useState('')

  useEffect(() => {
    let cancelled = false
    let activeLoader: HTMLImageElement | null = null
    let index = 0

    setSource('')

    const loadNext = () => {
      if (cancelled) return

      if (index >= candidates.length) {
        setSource(fallbackArtwork(photo))
        onReady(photo.id, null)
        return
      }

      const candidate = candidates[index]
      index += 1

      const loader = new Image()
      activeLoader = loader
      loader.decoding = 'async'
      loader.onload = () => {
        if (cancelled) return
        setSource(candidate)
        onReady(photo.id, loader)
      }
      loader.onerror = loadNext
      loader.src = candidate
    }

    loadNext()

    return () => {
      cancelled = true
      if (activeLoader) {
        activeLoader.onload = null
        activeLoader.onerror = null
      }
    }
  }, [candidateKey, candidates, photo, onReady])

  if (!source) return null

  return (
    <img
      src={source}
      width={photo.width}
      height={photo.height}
      alt={photo.alt}
      loading={eager ? 'eager' : 'lazy'}
      fetchPriority={eager ? 'high' : 'auto'}
      decoding="async"
      style={{ objectPosition: photo.position }}
      onError={(event) => {
        const image = event.currentTarget
        if (image.dataset.artworkFallback === 'true') return
        image.dataset.artworkFallback = 'true'
        image.src = fallbackArtwork(photo)
        onReady(photo.id, null)
      }}
    />
  )
}

export function RomanceArchive() {
  const sectionRef = useRef<HTMLElement>(null)
  const [activeAlbum, setActiveAlbum] = useState(0)
  const [photos, setPhotos] = useState<PhotoMemory[]>([])
  const [albumCounts, setAlbumCounts] = useState<Record<string, number>>(() =>
    Object.fromEntries(albums.map((album) => [album.id, album.count])),
  )
  const [loadedPhotoIds, setLoadedPhotoIds] = useState<Set<string>>(() => new Set())
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

  const markReady = useCallback((photoId: string, image: HTMLImageElement | null) => {
    setLoadedPhotoIds((currentIds) => new Set(currentIds).add(photoId))

    if (!image?.naturalWidth || !image.naturalHeight) return

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
  }, [])

  return (
    <section ref={sectionRef} className="romance-archive" id="memories" data-archive-source={archiveSource}>
      <div className="archive-orbit" aria-hidden="true" />

      <Reveal className="section-heading archive-heading">
        <p className="eyebrow">The real love story</p>
        <h2>More than a case file.<br /><em>These are us.</em></h2>
        <p>All {totalPreparedMemories} photographs are organised here as full images, with the same clean presentation in every chapter.</p>
      </Reveal>

      <div className="archive-dashboard">
        <div className="archive-counter">
          <strong>{String(organisedTotal || totalPreparedMemories).padStart(3, '0')}</strong>
          <span>photographs organised</span>
        </div>
        <div className="archive-capacity">
          <div><span style={{ width: `${archiveProgress}%` }} /></div>
          <p>Full-size photographs load directly. Blur previews are no longer used as finished images.</p>
        </div>
        <div className={`archive-source-badge ${archiveSource}`}>
          <i />
          {archiveSource === 'supabase' ? 'Live archive' : 'Full photo archive'}
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
            <small>{item.subtitle} · {albumCounts[item.id] ?? item.count} photographs</small>
          </button>
        ))}
      </div>

      <div className={`${loading ? 'memory-grid loading' : 'memory-grid'} album-${album.id}`} aria-live="polite">
        {loading && Array.from({ length: 4 }, (_, index) => <div className="memory-skeleton" key={index} />)}
        {!loading && photos.map((photo, index) => {
          const isReady = loadedPhotoIds.has(photo.id)

          return (
            <button
              className={`memory-card ${photo.orientation} ${isReady ? 'media-ready' : 'media-pending'}`}
              key={photo.id}
              onClick={() => { if (isReady) setSelected(index) }}
              aria-label={isReady ? `Open ${photo.caption}` : `${photo.caption}. Loading photograph.`}
              aria-disabled={!isReady}
            >
              <ArchiveImage
                photo={photo}
                eager={index < 4}
                onReady={markReady}
              />
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

      {current && selected !== null && (
        <div className="memory-lightbox" role="dialog" aria-modal="true" aria-label={current.caption} onClick={() => setSelected(null)}>
          <button className="lightbox-close" onClick={() => setSelected(null)} aria-label="Close photo">×</button>
          <button
            className="lightbox-arrow previous"
            onClick={(event) => { event.stopPropagation(); setSelected((selected - 1 + photos.length) % photos.length) }}
            aria-label="Previous photo"
          >←</button>
          <figure onClick={(event) => event.stopPropagation()}>
            <ArchiveImage key={current.id} photo={current} eager onReady={markReady} />
            <figcaption>
              <span>{album.title}</span>
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
