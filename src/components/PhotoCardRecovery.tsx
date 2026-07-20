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
    }, 5000)

    image.onload = () => {
      window.clearTimeout(timer)
      resolve(image.naturalWidth > 80 && image.naturalHeight > 80)
    }
    image.onerror = () => {
      window.clearTimeout(timer)
      resolve(false)
    }
    image.src = source
  })

  sourceChecks.set(source, check)
  return check
}

async function resolveReasonPhoto(photo: PhotoMemory) {
  for (const source of photoSourceCandidates(photo, 'thumb')) {
    if (await sourceWorks(source)) return source
  }
  return null
}

function cssUrl(source: string) {
  return `url(${JSON.stringify(source)})`
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

        void resolveReasonPhoto(photo).then((source) => {
          if (!active || card.dataset.photoId !== photo.id) return

          if (!source) {
            card.dataset.photoState = 'unavailable'
            return
          }

          card.style.setProperty('--reason-photo', cssUrl(source))
          card.classList.add('reason-photo-ready')
          card.dataset.photoState = 'ready'
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
