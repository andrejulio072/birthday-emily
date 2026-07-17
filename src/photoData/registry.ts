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

async function loadCoupleFallback() {
  const [us, quiet, training, manySides] = await Promise.all([
    import('./usBlock').then((module) => module.default),
    import('./quietDaysBlock').then((module) => module.default),
    import('./trainingBlock').then((module) => module.default),
    import('./manySidesBlock').then((module) => module.default),
  ])
  return [...us, ...quiet, ...training, ...manySides]
}

export const albums: PhotoAlbum[] = [
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
    count: 13,
    fallbackLoader: () => import('./adventuresBlock').then((module) => module.default),
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

export async function loadAlbum(album: PhotoAlbum): Promise<StorageAlbumResult> {
  const liveAlbum = await loadSupabaseAlbum(album.storageFolder, album.id, album.title)
  if (liveAlbum.photos.length > 0) return liveAlbum

  const fallbackPhotos = await album.fallbackLoader()
  return {
    photos: fallbackPhotos.map((photo) => ({ ...photo, source: 'fallback' as const })),
    source: 'fallback',
    reason: liveAlbum.reason,
  }
}

export const totalPreparedMemories = albums.reduce((total, album) => total + album.count, 0)
export const archiveProgress = Math.min(totalPreparedMemories, 100)
