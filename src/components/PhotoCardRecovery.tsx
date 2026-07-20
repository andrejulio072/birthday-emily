import { useEffect } from 'react'
import { MEDIA_BASE_URL } from '../config/media'
import birthdayPhotos from '../photoData/birthdayBlock'
import usPhotos from '../photoData/usBlock'
import quietPhotos from '../photoData/quietDaysBlock'
import trainingPhotos from '../photoData/trainingBlock'
import manySidesPhotos from '../photoData/manySidesBlock'
import adventurePhotos from '../photoData/adventuresBlock'
import adventure014 from '../photoData/embedded/adventure014'
import londonMagic15To17 from '../photoData/londonMagic15_17'
import londonMagic18To20 from '../photoData/londonMagic18_20'
import londonMagic21To23 from '../photoData/londonMagic21_23'
import alicantePhotos from '../photoData/alicanteBlock'
import type { PhotoMemory } from '../photoData/types'

const extendedAdventurePhotos: PhotoMemory[] = [
  ...adventurePhotos,
  adventure014,
  ...londonMagic15To17,
  ...londonMagic18To20,
  ...londonMagic21To23,
]

const couplePhotos: PhotoMemory[] = [
  ...usPhotos,
  ...quietPhotos,
  ...trainingPhotos,
  ...manySidesPhotos,
]

const albumPhotos: Record<string, PhotoMemory[]> = {
  birthday: birthdayPhotos,
  us: couplePhotos,
  adventures: extendedAdventurePhotos,
  alicante: alicantePhotos,
}

// Put verified full-size Supabase photographs first, followed by distinct embedded
// photographs. Every reason card owns one photograph and never borrows another card's image.
const reasonPhotos: PhotoMemory[] = [
  ...birthdayPhotos,
  ...alicantePhotos,
  ...usPhotos,
  ...adventurePhotos.slice(0, 5),
  adventure014,
  ...londonMagic15To17,
  ...londonMagic18To20,
  ...londonMagic21To23,
  ...quietPhotos,
  ...trainingPhotos,
  ...manySidesPhotos,
  ...adventurePhotos.slice(5),
]

function uniqueSources(values: Array<string | undefined>) {
  return [...new Set(values.filter((value): value is string => Boolean(value)))]
}

function encodeStoragePath(path: string) {
  return path
    .split('/')
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))
    .join('/')
}

function storageUrl(path: string) {
  return `${MEDIA_BASE_URL}/${encodeStoragePath(path)}`
}

function storageFolder(photo: PhotoMemory) {
  if (photo.chapter === 'birthday') return 'birthday'
  if (photo.chapter === 'adventures') return 'adventures'
  if (photo.chapter === 'alicante') return 'alicante'
  return 'us'
}

function photoCandidates(photo: PhotoMemory) {
  const folder = storageFolder(photo)
  const exactSupabasePaths = [
    storageUrl(`Photos/${folder}/${photo.id}-1280.webp`),
    storageUrl(`Photos/${folder}/${photo.id}-480.webp`),
    storageUrl(`Photos/${folder}/${photo.id}.webp`),
    storageUrl(`Photos/${folder}/${photo.id}.jpg`),
  ]

  if (folder === 'adventures') {
    exactSupabasePaths.push(
      storageUrl(`${photo.id}-1280.webp`),
      storageUrl(`${photo.id}-480.webp`),
      storageUrl(`dublin/${photo.id}-1280.webp`),
      storageUrl(`dublin/${photo.id}.jpg`),
    )
  }

  if (folder === 'us') {
    exactSupabasePaths.push(
      storageUrl(`couple/${photo.id}-1280.webp`),
      storageUrl(`couple/${photo.id}.jpg`),
    )
  }

  if (folder === 'alicante') {
    exactSupabasePaths.push(
      storageUrl(`alicante/${photo.id}-1280.webp`),
      storageUrl(`alicante/${photo.id}.jpg`),
    )
  }

  const suppliedRemoteSources = [
    photo.fallbackDisplaySrc,
    photo.displaySrc,
    photo.fallbackThumbSrc,
    photo.thumbSrc,
  ].filter((source): source is string => typeof source === 'string' && !source.startsWith('data:'))

  const ownEmbeddedSources = [
    photo.fallbackDisplaySrc,
    photo.displaySrc,
    photo.fallbackThumbSrc,
    photo.thumbSrc,
    photo.blurDataUrl,
  ].filter((source): source is string => typeof source === 'string' && source.startsWith('data:image/'))

  return uniqueSources([
    ...exactSupabasePaths,
    ...suppliedRemoteSources,
    ...ownEmbeddedSources,
  ])
}

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
    }, 5500)

    image.onload = () => {
      window.clearTimeout(timer)
      resolve(image.naturalWidth > 40 && image.naturalHeight > 40)
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

async function resolveOwnPhoto(photo: PhotoMemory) {
  for (const source of photoCandidates(photo)) {
    if (await sourceWorks(source)) return source
  }
  return null
}

function cssUrl(source: string) {
  return `url(${JSON.stringify(source)})`
}

function activeArchivePhotos(grid: HTMLElement) {
  const albumName = Object.keys(albumPhotos).find((name) => grid.classList.contains(`album-${name}`))
  return albumName ? albumPhotos[albumName] : []
}

export function PhotoCardRecovery() {
  useEffect(() => {
    let active = true
    let scanTimer = 0

    const applyReasonPhotos = () => {
      const cards = Array.from(document.querySelectorAll<HTMLElement>('.reason-card'))

      cards.forEach((card, index) => {
        const photo = reasonPhotos[index]
        if (!photo) return
        if (card.dataset.photoRecoveryId === photo.id && card.dataset.photoRecovery === 'ready') return
        if (card.dataset.photoRecoveryId === photo.id && card.dataset.photoRecovery === 'loading') return

        card.dataset.photoRecoveryId = photo.id
        card.dataset.photoRecovery = 'loading'

        void resolveOwnPhoto(photo).then((source) => {
          if (!active || card.dataset.photoRecoveryId !== photo.id) return
          if (!source) {
            card.dataset.photoRecovery = 'failed'
            return
          }

          card.style.setProperty('--reason-photo', cssUrl(source))
          card.classList.add('reason-photo-ready')
          card.dataset.photoRecovery = 'ready'
        })
      })
    }

    const applyArchivePhotos = () => {
      const grids = Array.from(document.querySelectorAll<HTMLElement>('.memory-grid'))

      grids.forEach((grid) => {
        const photos = activeArchivePhotos(grid)
        const cards = Array.from(grid.querySelectorAll<HTMLElement>('.memory-card'))

        cards.forEach((card, index) => {
          const photo = photos[index]
          if (!photo) return

          const image = card.querySelector<HTMLImageElement>('img')
          const generatedFallback = Boolean(
            image?.src.startsWith('data:image/svg+xml') ||
            image?.dataset.artworkFallback === 'true',
          )

          if (!generatedFallback) return
          if (card.dataset.archiveRecoveryId === photo.id && card.dataset.archiveRecovery === 'ready') return
          if (card.dataset.archiveRecoveryId === photo.id && card.dataset.archiveRecovery === 'loading') return

          card.dataset.archiveRecoveryId = photo.id
          card.dataset.archiveRecovery = 'loading'

          void resolveOwnPhoto(photo).then((source) => {
            if (!active || card.dataset.archiveRecoveryId !== photo.id) return
            if (!source) {
              card.dataset.archiveRecovery = 'failed'
              return
            }

            card.style.setProperty('--archive-rescue-photo', cssUrl(source))
            card.classList.add('photo-rescued')
            card.dataset.archiveRecovery = 'ready'
          })
        })

        const lightboxImage = document.querySelector<HTMLImageElement>('.memory-lightbox img')
        const lightboxCaption = document.querySelector<HTMLElement>('.memory-lightbox figcaption strong')?.textContent?.trim()
        const lightboxPhoto = photos.find((photo) => photo.caption === lightboxCaption)
        const lightboxNeedsRecovery = Boolean(
          lightboxImage && (
            lightboxImage.src.startsWith('data:image/svg+xml') ||
            lightboxImage.dataset.artworkFallback === 'true'
          ),
        )

        if (
          lightboxImage &&
          lightboxPhoto &&
          lightboxNeedsRecovery &&
          lightboxImage.dataset.lightboxRecoveryId !== lightboxPhoto.id
        ) {
          lightboxImage.dataset.lightboxRecoveryId = lightboxPhoto.id
          lightboxImage.dataset.lightboxRecovery = 'loading'

          void resolveOwnPhoto(lightboxPhoto).then((source) => {
            if (!active || !source || lightboxImage.dataset.lightboxRecoveryId !== lightboxPhoto.id) return
            lightboxImage.src = source
            lightboxImage.dataset.lightboxRecovery = 'ready'
          })
        }
      })
    }

    const scan = () => {
      window.clearTimeout(scanTimer)
      applyReasonPhotos()
      scanTimer = window.setTimeout(applyArchivePhotos, 500)
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
