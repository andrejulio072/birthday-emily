import { useEffect, useRef, useState } from 'react'
import { Reveal } from './Effects'
import { albums, archiveProgress, totalPreparedMemories } from '../photoData/registry'
import type { PhotoMemory } from '../photoData/types'

export function RomanceArchive() {
  const sectionRef = useRef<HTMLElement>(null)
  const [activeAlbum, setActiveAlbum] = useState(0)
  const [photos, setPhotos] = useState<PhotoMemory[]>([])
  const [loadedPhotoIds, setLoadedPhotoIds] = useState<Set<string>>(() => new Set())
  const [loading, setLoading] = useState(false)
  const [armed, setArmed] = useState(false)
  const [selected, setSelected] = useState<number | null>(null)

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
    setLoading(true)
    setLoadedPhotoIds(new Set())
    albums[activeAlbum].loader().then((items) => {
      if (cancelled) return
      setPhotos(items)
      setLoading(false)
    })
    return () => { cancelled = true }
  }, [activeAlbum, armed])

  useEffect(() => {
    if (selected === null) return
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

  function markReady(photoId: string) {
    setLoadedPhotoIds((currentIds) => {
      const nextIds = new Set(currentIds)
      nextIds.add(photoId)
      return nextIds
    })
  }

  return (
    <section ref={sectionRef} className="romance-archive" id="memories">
      <div className="archive-orbit" aria-hidden="true" />
      <Reveal className="section-heading archive-heading">
        <p className="eyebrow">The real love story</p>
        <h2>More than a case file.<br /><em>These are us.</em></h2>
        <p>The investigation was the joke. This is the evidence that matters: real smiles, ordinary days and the memories we are still building.</p>
      </Reveal>

      <div className="archive-dashboard">
        <div className="archive-counter">
          <strong>{String(totalPreparedMemories).padStart(3, '0')}</strong>
          <span>memories organised</span>
        </div>
        <div className="archive-capacity">
          <div><span style={{ width: `${archiveProgress}%` }} /></div>
          <p>Every photo is catalogued in GitHub first. Full media can be uploaded to Supabase later without changing the page structure.</p>
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
            <span>Block {String(index + 1).padStart(2, '0')}</span>
            <strong>{item.title}</strong>
            <small>{item.subtitle} · {item.count} memories prepared</small>
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
          return (
            <button
              className={`memory-card ${photo.orientation} ${isReady ? 'media-ready' : 'media-pending'}`}
              key={photo.id}
              onClick={() => { if (isReady) setSelected(index) }}
              aria-label={isReady ? `Open ${photo.caption}` : `${photo.caption}. Full image upload pending.`}
              aria-disabled={!isReady}
              style={{ backgroundImage: `url(${photo.blurDataUrl})`, backgroundSize: 'cover', backgroundPosition: photo.position }}
            >
              <img
                src={photo.thumbSrc}
                srcSet={`${photo.thumbSrc} 480w, ${photo.displaySrc} 1280w`}
                sizes="(max-width: 540px) 100vw, (max-width: 820px) 50vw, 34vw"
                width={photo.width}
                height={photo.height}
                alt={photo.alt}
                loading="lazy"
                decoding="async"
                style={{ objectPosition: photo.position }}
                onLoad={() => markReady(photo.id)}
                onError={(event) => {
                  event.currentTarget.hidden = true
                }}
              />
              {!isReady && <span className="media-status">Preview prepared · media upload later</span>}
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
        <span>Next planned blocks</span>
        <p>Funny moments · Favourite selfies · The moments nobody else saw · London · The next chapter</p>
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
            <img src={current.displaySrc} alt={current.alt} style={{ objectPosition: current.position }} decoding="async" />
            <figcaption><span>{album.title}</span><strong>{current.caption}</strong></figcaption>
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
