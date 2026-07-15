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
  chapter: 'birthday' | 'us' | 'quiet'
}
