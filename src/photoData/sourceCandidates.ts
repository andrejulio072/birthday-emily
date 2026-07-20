import { MEDIA_BASE_URL } from '../config/media'
import type { PhotoMemory } from './types'

export type PhotoVariant = 'thumb' | 'display'

const chapterFolders: Record<PhotoMemory['chapter'], string> = {
  birthday: 'birthday',
  us: 'us',
  quiet: 'quiet-days',
  adventures: 'adventures',
  training: 'training',
  'many-sides': 'many-sides',
  alicante: 'alicante',
}

function unique(values: Array<string | undefined>) {
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

function fileNameFromSource(source: string | undefined) {
  if (!source || source.startsWith('data:')) return ''

  try {
    return decodeURIComponent(new URL(source, MEDIA_BASE_URL).pathname.split('/').pop() || '')
  } catch {
    return source.split('/').pop() || ''
  }
}

function remoteOnly(values: Array<string | undefined>) {
  return values.filter((value): value is string => Boolean(value && !value.startsWith('data:')))
}

function embeddedOnly(values: Array<string | undefined>) {
  return values.filter((value): value is string => Boolean(value?.startsWith('data:image/')))
}

export function photoSourceCandidates(
  photo: PhotoMemory,
  variant: PhotoVariant,
  extraCandidates: string[] = [],
) {
  const folder = chapterFolders[photo.chapter]
  const primary = variant === 'display'
    ? [photo.displaySrc, photo.fallbackDisplaySrc]
    : [photo.thumbSrc, photo.fallbackThumbSrc]
  const secondary = variant === 'display'
    ? [photo.thumbSrc, photo.fallbackThumbSrc]
    : [photo.displaySrc, photo.fallbackDisplaySrc]

  const suppliedFileNames = unique([
    fileNameFromSource(photo.displaySrc),
    fileNameFromSource(photo.thumbSrc),
    fileNameFromSource(photo.storagePath),
  ])

  const preferredNames = variant === 'display'
    ? [`${photo.id}-1920.webp`, `${photo.id}-1600.webp`, `${photo.id}-1280.webp`, `${photo.id}.webp`, `${photo.id}.jpg`]
    : [`${photo.id}-480.webp`, `${photo.id}-640.webp`, `${photo.id}.webp`, `${photo.id}.jpg`]

  const canonicalNames = unique([...suppliedFileNames, ...preferredNames])
  const canonicalSources = canonicalNames.flatMap((fileName) => [
    storageUrl(`Photos/${folder}/${fileName}`),
    storageUrl(`Photos/${folder}/block-01/${fileName}`),
  ])

  const rawSources = variant === 'display'
    ? [
        storageUrl(`Photos/${folder}/raw/${photo.id}.jpg`),
        storageUrl(`Photos/${folder}/raw/${photo.id}.jpeg`),
        storageUrl(`Photos/${folder}/raw/${photo.id}.png`),
      ]
    : []

  return unique([
    ...extraCandidates,
    ...remoteOnly(primary),
    ...(photo.storagePath ? [storageUrl(photo.storagePath)] : []),
    ...canonicalSources,
    ...rawSources,
    ...remoteOnly(secondary),
    ...embeddedOnly(primary),
    ...embeddedOnly(secondary),
  ])
}
