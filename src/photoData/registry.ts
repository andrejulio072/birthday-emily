import { loadSupabaseAlbum, type StorageAlbumResult } from '../config/storage'
import type { PhotoChapter, PhotoMemory } from './types'

export type PhotoAlbum = {
  id: PhotoChapter
  storageFolder: string
  title: string
  subtitle: string
  count: number
  fallbackLoader: () => Promise<PhotoMemory[]>
}

export type ArchiveAlbumResult = Omit<StorageAlbumResult, 'source'> & {
  source: 'supabase' | 'fallback'
}

async function loadCoupleFallback() {
  const [us, quiet, training, manySides] = await Promise.all([
    import('./usBlock').then((module) => module.default),
    import('./quietDaysBlock').then((module) => module.default),
    import('./trainingBlock').then((module) => module.default),
    import('./manySidesBlock').then((module) => module.default),
  ])
  return [...us, ...quiet, ...training, ...manySides]
}

async function loadAdventureFallback() {
  const [original, adventure14, london15to17, london18to20, london21to23] = await Promise.all([
    import('./adventuresBlock').then((module) => module.default),
    import('./embedded/adventure014').then((module) => [module.default]),
    import('./londonMagic15_17').then((module) => module.default),
    import('./londonMagic18_20').then((module) => module.default),
    import('./londonMagic21_23').then((module) => module.default),
  ])

  return [
    ...original,
    ...adventure14,
    ...london15to17,
    ...london18to20,
    ...london21to23,
  ]
}

export const albums: PhotoAlbum[] = [
  {
    id: 'birthday',
    storageFolder: 'Photos/birthday',
    title: 'Chapter 30',
    subtitle: 'The birthday girl and the beginning of her next era',
    count: 7,
    fallbackLoader: () => import('./birthdayBlock').then((module) => module.default),
  },
  {
    id: 'us',
    storageFolder: 'Photos/us',
    title: 'The Us Files',
    subtitle: 'Couple photos and the moments that belong to us',
    count: 19,
    fallbackLoader: loadCoupleFallback,
  },
  {
    id: 'adventures',
    storageFolder: 'Photos/adventures',
    title: 'Our Adventures',
    subtitle: 'Days out, rides, journeys and the places we discovered together',
    count: 23,
    fallbackLoader: loadAdventureFallback,
  },
  {
    id: 'alicante',
    storageFolder: 'Photos/alicante',
    title: 'The Alicante Files',
    subtitle: 'Camels, sea views, salt lakes and us',
    count: 10,
    fallbackLoader: () => import('./alicanteBlock').then((module) => module.default),
  },
]

export async function loadAlbum(album: PhotoAlbum): Promise<ArchiveAlbumResult> {
  const localPhotos = (await album.fallbackLoader()).map((photo) => ({
    ...photo,
    source: photo.source || ('fallback' as const),
  }))

  const liveAlbum = await loadSupabaseAlbum(album.storageFolder, album.id, album.title)

  if (liveAlbum.photos.length >= localPhotos.length && liveAlbum.photos.length > 0) {
    return {
      photos: liveAlbum.photos,
      source: 'supabase',
      reason: liveAlbum.reason,
    }
  }

  return {
    photos: localPhotos,
    source: 'fallback',
    reason: liveAlbum.reason,
  }
}

export const totalPreparedMemories = albums.reduce((total, album) => total + album.count, 0)
export const archiveProgress = Math.min(totalPreparedMemories, 100)
