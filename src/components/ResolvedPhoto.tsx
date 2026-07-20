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
      variant,
      extraKey,
    ],
  )
  const candidateKey = candidates.join('|')
  const [candidateIndex, setCandidateIndex] = useState(0)
  const reportedExhaustion = useRef('')

  useEffect(() => {
    setCandidateIndex(0)
    reportedExhaustion.current = ''
  }, [candidateKey])

  const source = candidates[candidateIndex]

  useEffect(() => {
    if (source || reportedExhaustion.current === candidateKey) return
    reportedExhaustion.current = candidateKey
    onExhausted?.()
  }, [source, candidateKey, onExhausted])

  if (!source) return null

  return (
    <img
      key={`${photo.id}-${variant}-${source}`}
      className={className}
      src={source}
      width={photo.width}
      height={photo.height}
      alt={photo.alt}
      loading={eager ? 'eager' : 'lazy'}
      fetchPriority={eager ? 'high' : 'auto'}
      decoding="async"
      draggable={false}
      style={{ objectPosition: photo.position }}
      data-photo-id={photo.id}
      data-photo-variant={variant}
      onLoad={(event) => {
        const image = event.currentTarget
        onResolved?.({
          source,
          width: image.naturalWidth,
          height: image.naturalHeight,
        })
      }}
      onError={() => setCandidateIndex((current) => current + 1)}
    />
  )
}
