export type PhotoChapter =
  | 'birthday'
  | 'us'
  | 'quiet'
  | 'adventures'
  | 'training'
  | 'many-sides'
  | 'alicante'

export type PhotoMemory = {
  id: string
  thumbSrc: string
  displaySrc: string
  blurDataUrl: string
  width: number
  height: number
  alt: string
  caption: string
  orientation: 'portrait' | 'landscape'
  position: string
  chapter: PhotoChapter
  source?: 'github' | 'supabase' | 'fallback'
  storagePath?: string
  fallbackThumbSrc?: string
  fallbackDisplaySrc?: string
}
