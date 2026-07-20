import { useEffect } from 'react'
import birthdayPhotos from '../photoData/birthdayBlock'
import usPhotos from '../photoData/usBlock'
import quietPhotos from '../photoData/quietDaysBlock'
import trainingPhotos from '../photoData/trainingBlock'
import manySidesPhotos from '../photoData/manySidesBlock'
import adventurePhotos from '../photoData/adventuresBlock'
import alicantePhotos from '../photoData/alicanteBlock'
import type { PhotoMemory } from '../photoData/types'

const photoPool: PhotoMemory[] = [
  ...birthdayPhotos,
  ...usPhotos,
  ...quietPhotos,
  ...trainingPhotos,
  ...manySidesPhotos,
  ...adventurePhotos,
  ...alicantePhotos,
]

function uniqueSources(values: Array<string | undefined>) {
  return [...new Set(values.filter((value): value is string => Boolean(value)))]
}

const remoteSources = uniqueSources(photoPool.flatMap((photo) => [
  photo.fallbackDisplaySrc,
  photo.displaySrc,
  photo.fallbackThumbSrc,
  photo.thumbSrc,
])).filter((source) => !source.startsWith('data:'))

const sourceChecks = new Map<string, Promise<boolean>>()

function sourceWorks(source: string) {
  const existing = sourceChecks.get(source)
  if (existing) return existing

  const check = new Promise<boolean>((resolve) => {
    const image = new Image()
    const timer = window.setTimeout(() => {
      image.onload = null
      image.onerror = null
      resolve(false)
    }, 6500)

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

async function findWorkingSource(startIndex: number) {
  if (remoteSources.length === 0) return null

  for (let offset = 0; offset < remoteSources.length; offset += 1) {
    const source = remoteSources[(startIndex + offset) % remoteSources.length]
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
    let scanTimer = 0

    const applyReasonPhotos = () => {
      const cards = Array.from(document.querySelectorAll<HTMLElement>('.reason-card'))

      cards.forEach((card, index) => {
        if (card.dataset.photoRecovery === 'ready' || card.dataset.photoRecovery === 'loading') return
        card.dataset.photoRecovery = 'loading'

        void findWorkingSource(index * 2).then((source) => {
          if (!active || !source) {
            if (active) card.dataset.photoRecovery = 'failed'
            return
          }

          card.style.setProperty('--reason-photo', cssUrl(source))
          card.classList.add('reason-photo-ready')
          card.dataset.photoRecovery = 'ready'
        })
      })
    }

    const applyArchiveRecovery = () => {
      const cards = Array.from(document.querySelectorAll<HTMLElement>('.memory-card'))

      cards.forEach((card, index) => {
        const image = card.querySelector<HTMLImageElement>('img')
        const isGeneratedFallback = Boolean(
          image?.src.startsWith('data:image/svg+xml') ||
          image?.dataset.artworkFallback === 'true',
        )

        if (!isGeneratedFallback || card.dataset.archiveRecovery === 'ready' || card.dataset.archiveRecovery === 'loading') return
        card.dataset.archiveRecovery = 'loading'

        void findWorkingSource(30 + index * 3).then((source) => {
          if (!active || !source) {
            if (active) card.dataset.archiveRecovery = 'failed'
            return
          }

          card.style.setProperty('--archive-rescue-photo', cssUrl(source))
          card.classList.add('photo-rescued')
          card.dataset.archiveRecovery = 'ready'
        })
      })

      const lightboxImage = document.querySelector<HTMLImageElement>('.memory-lightbox img')
      if (
        lightboxImage &&
        (lightboxImage.src.startsWith('data:image/svg+xml') || lightboxImage.dataset.artworkFallback === 'true') &&
        lightboxImage.dataset.lightboxRecovery !== 'loading' &&
        lightboxImage.dataset.lightboxRecovery !== 'ready'
      ) {
        lightboxImage.dataset.lightboxRecovery = 'loading'
        void findWorkingSource(17).then((source) => {
          if (!active || !source) return
          lightboxImage.src = source
          lightboxImage.dataset.lightboxRecovery = 'ready'
        })
      }
    }

    const scan = () => {
      window.clearTimeout(scanTimer)
      applyReasonPhotos()
      scanTimer = window.setTimeout(applyArchiveRecovery, 900)
    }

    const observer = new MutationObserver(scan)
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'src'],
    })

    scan()

    return () => {
      active = false
      window.clearTimeout(scanTimer)
      observer.disconnect()
    }
  }, [])

  return null
}
