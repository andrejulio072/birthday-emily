import { useEffect, useMemo, useRef, useState } from 'react'
import { photoSourceCandidates, type PhotoVariant } from '../photoData/sourceCandidates'
import type { PhotoMemory } from '../photoData/types'

export type ResolvedPhotoDetails = {
  source: string
  width: number
  height: number
}

type ResolvedPhotoProps = {
  photo: PhotoMemory
  variant: PhotoVariant
  className?: string
  eager?: boolean
  extraCandidates?: string[]
  onResolved?: (details: ResolvedPhotoDetails) => void
  onExhausted?: () => void
}

export function ResolvedPhoto({
  photo,
  variant,
  className,
  eager = false,
  extraCandidates = [],
  onResolved,
  onExhausted,
}: ResolvedPhotoProps) {
  const extraKey = extraCandidates.join('|')
  const candidates = useMemo(
    () => photoSourceCandidates(photo, variant, extraCandidates),
    [
      photo.id,
      photo.chapter,
      photo.thumbSrc,
      photo.displaySrc,
      photo.fallbackThumbSrc,
      photo.fallbackDisplaySrc,
      photo.storagePath,
      photo.blurDataUrl,
      variant,
      extraKey,
    ],
  )
  const candidateKey = candidates.join('|')
  const previewSource = candidates.find((candidate) => candidate.startsWith('data:image/')) || ''
  const remoteCandidates = candidates.filter((candidate) => !candidate.startsWith('data:image/'))
  const [source, setSource] = useState(() => previewSource || remoteCandidates[0] || '')
  const [quality, setQuality] = useState<'preview' | 'full'>(() => previewSource ? 'preview' : 'full')
  const reportedExhaustion = useRef('')
  const onExhaustedRef = useRef(onExhausted)

  useEffect(() => {
    onExhaustedRef.current = onExhausted
  }, [onExhausted])

  useEffect(() => {
    let cancelled = false
    let activeImage: HTMLImageElement | null = null
    let timer = 0
    let index = 0

    setSource(previewSource || remoteCandidates[0] || '')
    setQuality(previewSource ? 'preview' : 'full')
    reportedExhaustion.current = ''

    const finishWithoutRemote = () => {
      if (previewSource || reportedExhaustion.current === candidateKey) return
      reportedExhaustion.current = candidateKey
      onExhaustedRef.current?.()
    }

    const tryNextRemote = () => {
      if (cancelled) return
      const candidate = remoteCandidates[index]
      index += 1

      if (!candidate) {
        finishWithoutRemote()
        return
      }

      const image = new Image()
      activeImage = image
      timer = window.setTimeout(() => {
        image.onload = null
        image.onerror = null
        tryNextRemote()
      }, 2600)

      image.onload = () => {
        window.clearTimeout(timer)
        if (cancelled) return
        setSource(candidate)
        setQuality('full')
      }
      image.onerror = () => {
        window.clearTimeout(timer)
        tryNextRemote()
      }
      image.decoding = 'async'
      image.src = candidate
    }

    if (remoteCandidates.length > 0) tryNextRemote()
    else finishWithoutRemote()

    return () => {
      cancelled = true
      window.clearTimeout(timer)
      if (activeImage) {
        activeImage.onload = null
        activeImage.onerror = null
      }
    }
  }, [candidateKey, previewSource])

  if (!source) return null

  return (
    <img
      key={`${photo.id}-${variant}-${source}`}
      className={className}
      src={source}
      width={photo.width}
      height={photo.height}
      alt={photo.alt}
      loading={eager || quality === 'preview' ? 'eager' : 'lazy'}
      fetchPriority={eager || quality === 'preview' ? 'high' : 'auto'}
      decoding="async"
      draggable={false}
      style={{ objectPosition: photo.position }}
      data-photo-id={photo.id}
      data-photo-variant={variant}
      data-photo-quality={quality}
      onLoad={(event) => {
        const image = event.currentTarget
        onResolved?.({
          source,
          width: image.naturalWidth,
          height: image.naturalHeight,
        })
      }}
      onError={() => {
        if (!previewSource || source === previewSource) return
        setSource(previewSource)
        setQuality('preview')
      }}
    />
  )
}
