import { MEDIA_BASE_URL } from './media'
import type { PhotoMemory } from '../photoData/types'

export const SUPABASE_PROJECT_URL = (
  import.meta.env.VITE_SUPABASE_URL || 'https://ujdkepevbkjwwotcmnvr.supabase.co'
).replace(/\/$/, '')

export const STORAGE_BUCKET = import.meta.env.VITE_SUPABASE_BUCKET || 'emily-birthday-media'

const publishableKey = (
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  ''
).trim()

const supportedImagePattern = /\.(avif|gif|jpe?g|png|webp)$/i
const renditionPattern = /[-_](?:thumb|small|medium|large|full|hd|\d{3,4})(?=\.[^.]+$)/i

type StorageListItem = {
  id?: string | null
  name: string
  metadata?: {
    mimetype?: string
    size?: number
  } | null
}

type StorageImageGroup = {
  baseName: string
  paths: string[]
}

export type StorageAlbumResult = {
  photos: PhotoMemory[]
  source: 'github' | 'supabase' | 'fallback'
  reason?: 'missing-key' | 'empty-folder' | 'request-failed'
}

function storageHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    apikey: publishableKey,
    'Content-Type': 'application/json',
  }

  if (publishableKey.startsWith('eyJ')) {
    headers.Authorization = `Bearer ${publishableKey}`
  }

  return headers
}

function encodeStoragePath(path: string) {
  return path
    .split('/')
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))
    .join('/')
}

function publicStorageUrl(path: string) {
  return `${MEDIA_BASE_URL}/${encodeStoragePath(path)}`
}

function stripRendition(name: string) {
  return name.replace(renditionPattern, '')
}

function naturalCompare(left: string, right: string) {
  return left.localeCompare(right, undefined, { numeric: true, sensitivity: 'base' })
}

function preferredThumb(paths: string[]) {
  return [...paths].sort((left, right) => {
    const leftScore = /(?:thumb|small|480|640)/i.test(left) ? 0 : /(?:960|1280)/i.test(left) ? 1 : 2
    const rightScore = /(?:thumb|small|480|640)/i.test(right) ? 0 : /(?:960|1280)/i.test(right) ? 1 : 2
    return leftScore - rightScore || left.length - right.length
  })[0]
}

function preferredDisplay(paths: string[]) {
  return [...paths].sort((left, right) => {
    const leftScore = /(?:full|large|hd|1920|1600|1280)/i.test(left) ? 0 : 1
    const rightScore = /(?:full|large|hd|1920|1600|1280)/i.test(right) ? 0 : 1
    return leftScore - rightScore || right.length - left.length
  })[0]
}

function cleanCaption(fileName: string, index: number, albumTitle: string) {
  const withoutExtension = fileName.replace(/\.[^.]+$/, '')
  const withoutTechnicalSuffix = withoutExtension
    .replace(/[-_](?:thumb|small|medium|large|full|hd|\d{3,4})$/i, '')
    .replace(/^\d{8,}[-_]?/, '')
    .replace(/^(?:img|image|photo|screenshot)[-_]?\d*[-_]?/i, '')
  const words = withoutTechnicalSuffix
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  if (!words || /^\d+$/.test(words) || words.length < 3) {
    return `${albumTitle} memory ${String(index + 1).padStart(2, '0')}`
  }

  return words.replace(/\b\w/g, (character) => character.toUpperCase())
}

function placeholderDataUrl(index: number) {
  const palettes = [
    ['#4b1838', '#d76a9d', '#f4c66f'],
    ['#172f49', '#4eb8bd', '#efd9c8'],
    ['#3d245a', '#8e72d8', '#ef8aad'],
  ]
  const palette = palettes[index % palettes.length]
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="64" viewBox="0 0 48 64"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${palette[0]}"/><stop offset=".55" stop-color="${palette[1]}"/><stop offset="1" stop-color="${palette[2]}"/></linearGradient></defs><rect width="48" height="64" fill="url(#g)"/></svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

async function listFolder(prefix: string): Promise<string[]> {
  const endpoint = `${SUPABASE_PROJECT_URL}/storage/v1/object/list/${encodeURIComponent(STORAGE_BUCKET)}`
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: storageHeaders(),
    body: JSON.stringify({
      prefix,
      limit: 1000,
      offset: 0,
      sortBy: { column: 'name', order: 'asc' },
    }),
  })

  if (!response.ok) {
    throw new Error(`Supabase Storage list failed with ${response.status}`)
  }

  const items = await response.json() as StorageListItem[]
  const files: string[] = []

  for (const item of items) {
    const itemPath = prefix ? `${prefix}/${item.name}` : item.name
    const looksLikeFolder = !item.id && !item.metadata && !supportedImagePattern.test(item.name)

    if (looksLikeFolder) {
      files.push(...await listFolder(itemPath))
      continue
    }

    const isImage = supportedImagePattern.test(item.name) || item.metadata?.mimetype?.startsWith('image/')
    if (isImage) files.push(itemPath)
  }

  return files
}

function groupRenditions(paths: string[]) {
  const groups = new Map<string, StorageImageGroup>()

  for (const path of paths.sort(naturalCompare)) {
    const segments = path.split('/')
    const fileName = segments.pop() || path
    const directory = segments.join('/')
    const baseName = stripRendition(fileName)
    const groupKey = `${directory}/${baseName}`.toLowerCase()
    const group = groups.get(groupKey) || { baseName, paths: [] }
    group.paths.push(path)
    groups.set(groupKey, group)
  }

  return [...groups.values()].sort((left, right) => naturalCompare(left.baseName, right.baseName))
}

export async function loadSupabaseAlbum(
  folder: string,
  chapter: PhotoMemory['chapter'],
  albumTitle: string,
): Promise<StorageAlbumResult> {
  if (!publishableKey) {
    return { photos: [], source: 'fallback', reason: 'missing-key' }
  }

  try {
    const paths = await listFolder(folder)
    if (paths.length === 0) {
      return { photos: [], source: 'fallback', reason: 'empty-folder' }
    }

    const photos = groupRenditions(paths).map((group, index): PhotoMemory => {
      const thumbPath = preferredThumb(group.paths)
      const displayPath = preferredDisplay(group.paths)
      const caption = cleanCaption(group.baseName, index, albumTitle)
      const portraitHint = /(?:portrait|vertical|selfie|story)/i.test(group.baseName)
      const orientation = portraitHint || index % 4 === 1 ? 'portrait' : 'landscape'

      return {
        id: `${folder}-${index + 1}-${group.baseName}`,
        thumbSrc: publicStorageUrl(thumbPath),
        displaySrc: publicStorageUrl(displayPath),
        blurDataUrl: placeholderDataUrl(index),
        width: orientation === 'portrait' ? 900 : 1400,
        height: orientation === 'portrait' ? 1200 : 900,
        alt: `${albumTitle} — ${caption}`,
        caption,
        orientation,
        position: '50% 50%',
        chapter,
        storagePath: displayPath,
        source: 'supabase',
      }
    })

    return { photos, source: 'supabase' }
  } catch (error) {
    console.warn('Unable to load Supabase album', folder, error)
    return { photos: [], source: 'fallback', reason: 'request-failed' }
  }
}
