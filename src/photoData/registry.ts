import type { PhotoChapter, PhotoMemory } from './types'

export type PhotoAlbum = {
  id: PhotoChapter
  title: string
  subtitle: string
  count: number
  loader: () => Promise<PhotoMemory[]>
}

export const albums: PhotoAlbum[] = [
  {
    id: 'birthday',
    title: 'Chapter 30',
    subtitle: 'The birthday girl',
    count: 5,
    loader: () => import('./birthdayBlock').then((module) => module.default),
  },
  {
    id: 'us',
    title: 'The Us Files',
    subtitle: 'Real moments, no filters',
    count: 4,
    loader: () => import('./usBlock').then((module) => module.default),
  },
  {
    id: 'quiet',
    title: 'Quiet Days',
    subtitle: 'Home, closeness and the ordinary',
    count: 10,
    loader: () => import('./quietDaysBlock').then((module) => module.default),
  },
  {
    id: 'adventures',
    title: 'Little Adventures',
    subtitle: 'Coffee, gardens, sunshine and sea',
    count: 5,
    loader: () => import('./adventuresBlock').then((module) => module.default),
  },
  {
    id: 'training',
    title: 'Stronger Together',
    subtitle: 'A very convincing power couple',
    count: 3,
    loader: () => import('./trainingBlock').then((module) => module.default),
  },
  {
    id: 'many-sides',
    title: 'Her Many Sides',
    subtitle: 'Soft, strong and unmistakably Emily',
    count: 2,
    loader: () => import('./manySidesBlock').then((module) => module.default),
  },
  {
    id: 'alicante',
    title: 'The Alicante Files',
    subtitle: 'Camels, sea views, salt lakes and us',
    count: 10,
    loader: () => import('./alicanteBlock').then((module) => module.default),
  },
]

export const totalPreparedMemories = albums.reduce((total, album) => total + album.count, 0)
export const archiveProgress = Math.min(totalPreparedMemories, 100)
