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

function photoKey(photo: PhotoMemory) {
  const searchable = `${photo.id} ${photo.storagePath || ''}`.toLowerCase()
  return searchable.match(/(?:adventure|alicante|birthday|training|quiet|us|many-sides)-\d{3}/)?.[0]
    || photo.id.toLowerCase()
}

export async function loadAlbum(album: PhotoAlbum): Promise<ArchiveAlbumResult> {
  const localPhotos = (await album.fallbackLoader()).map((photo) => ({
    ...photo,
    source: photo.source || ('fallback' as const),
  }))

  const liveAlbum = await loadSupabaseAlbum(album.storageFolder, album.id, album.title)
  const localKeys = new Set(localPhotos.map(photoKey))
  const supabaseOnly = liveAlbum.photos.filter((photo) => !localKeys.has(photoKey(photo)))

  return {
    photos: [...localPhotos, ...supabaseOnly],
    source: supabaseOnly.length > 0 && localPhotos.length === 0 ? 'supabase' : 'fallback',
    reason: liveAlbum.reason,
  }
}

export const totalPreparedMemories = albums.reduce((total, album) => total + album.count, 0)
export const archiveProgress = Math.min(totalPreparedMemories, 100)
