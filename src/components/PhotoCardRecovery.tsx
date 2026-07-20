import { useEffect } from 'react'
import { reasonPhotos } from '../photoData/reasonPhotos'
import { photoSourceCandidates } from '../photoData/sourceCandidates'
import type { PhotoMemory } from '../photoData/types'

const sourceChecks = new Map<string, Promise<boolean>>()

function sourceWorks(source: string) {
  if (source.startsWith('data:image/')) return Promise.resolve(true)

  const existing = sourceChecks.get(source)
  if (existing) return existing

  const check = new Promise<boolean>((resolve) => {
    const image = new Image()
    const timer = window.setTimeout(() => {
      image.onload = null
      image.onerror = null
      resolve(false)
    }, 2400)

    image.onload = () => {
      window.clearTimeout(timer)
      resolve(image.naturalWidth > 80 && image.naturalHeight > 80)
    }
    image.onerror = () => {
      window.clearTimeout(timer)
      resolve(false)
    }
    image.decoding = 'async'
    image.src = source
  })

  sourceChecks.set(source, check)
  return check
}

async function resolveBestRemotePhoto(photo: PhotoMemory) {
  const remoteSources = photoSourceCandidates(photo, 'thumb')
    .filter((source) => !source.startsWith('data:image/'))
    .slice(0, 14)

  if (remoteSources.length === 0) return null

  return new Promise<string | null>((resolve) => {
    let pending = remoteSources.length
    let settled = false

    remoteSources.forEach((source) => {
      void sourceWorks(source).then((works) => {
        if (settled) return
        if (works) {
          settled = true
          resolve(source)
          return
        }

        pending -= 1
        if (pending === 0) resolve(null)
      })
    })
  })
}

function immediateFallback(photo: PhotoMemory) {
  return photoSourceCandidates(photo, 'thumb')
    .find((source) => source.startsWith('data:image/')) || null
}

function cssUrl(source: string) {
  return `url(${JSON.stringify(source)})`
}

function applySource(card: HTMLElement, photo: PhotoMemory, source: string, quality: 'preview' | 'full') {
  card.style.setProperty('--reason-photo', cssUrl(source))
  card.classList.add('reason-photo-ready')
  card.dataset.photoState = 'ready'
  card.dataset.photoQuality = quality
  card.dataset.photoId = photo.id
}

export function PhotoCardRecovery() {
  useEffect(() => {
    let active = true
    let observer: MutationObserver | null = null

    const applyPhotos = () => {
      const cards = Array.from(document.querySelectorAll<HTMLElement>('.flip-reasons-grid .reason-card'))
      if (cards.length === 0) return false

      cards.forEach((card, index) => {
        const photo = reasonPhotos[index]
        if (!photo || card.dataset.photoId === photo.id) return

        card.dataset.photoId = photo.id
        card.dataset.photoState = 'loading'

        const fallback = immediateFallback(photo)
        if (fallback) applySource(card, photo, fallback, 'preview')

        void resolveBestRemotePhoto(photo).then((source) => {
          if (!active || !source || card.dataset.photoId !== photo.id) return
          applySource(card, photo, source, 'full')
        })
      })

      return cards.length >= Math.min(reasonPhotos.length, 30)
    }

    if (!applyPhotos()) {
      observer = new MutationObserver(() => {
        if (applyPhotos()) {
          observer?.disconnect()
          observer = null
        }
      })
      observer.observe(document.body, { childList: true, subtree: true })
    }

    return () => {
      active = false
      observer?.disconnect()
    }
  }, [])

  return null
}
