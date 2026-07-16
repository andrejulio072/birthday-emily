import { mediaUrl } from '../config/media'
import type { PhotoMemory } from './types'

const photos: PhotoMemory[] = [
  {
    id: 'training-001',
    thumbSrc: mediaUrl('photos/training/block-01/training-001-480.webp'),
    displaySrc: mediaUrl('photos/training/block-01/training-001-1280.webp'),
    blurDataUrl: 'data:image/webp;base64,UklGRoQAAABXRUJQVlA4IHgAAADwBACdASoWAB4APvVoqk4qpiOiMBgMAVAeiWcAvzgynTO2wDQLAEhJzGQ1pRPOA9wAxCRceXks5DaUIRsQfvP6r7N5UeydvOhSJul9gyaorMsnkXl18e3FpZeH/5Qzp7JL3EBTZ1HkwNuN96MoCxB6PLZ/0YAAAAA=',
    width: 960,
    height: 1280,
    alt: 'Emily — Strong looks very good on you',
    caption: 'Strong looks very good on you',
    orientation: 'portrait',
    position: '50% 35%',
    chapter: 'training',
  },
  {
    id: 'training-002',
    thumbSrc: mediaUrl('photos/training/block-01/training-002-480.webp'),
    displaySrc: mediaUrl('photos/training/block-01/training-002-1280.webp'),
    blurDataUrl: 'data:image/webp;base64,UklGRkwAAABXRUJQVlA4IEAAAABQAgCdASoOAB4AA4BcJZwAAuRya4IjdD5uysAA/MUGeDtPS/dlTzIdOzKvjeTVIMUizVU0XiwlPzOIY4dKoCAA',
    width: 592,
    height: 1280,
    alt: 'Andre and Emily — Our strongest evidence so far',
    caption: 'Our strongest evidence so far',
    orientation: 'portrait',
    position: '50% 42%',
    chapter: 'training',
  },
  {
    id: 'training-003',
    thumbSrc: mediaUrl('photos/training/block-01/training-003-480.webp'),
    displaySrc: mediaUrl('photos/training/block-01/training-003-1280.webp'),
    blurDataUrl: 'data:image/webp;base64,UklGRloAAABXRUJQVlA4IE4AAABwAwCdASoOAB4APvVsrk4qpqSiMAgBUB6JZwABFK6XbsBFaAAA/eHki/+xf8l2Qv8Ych0ojWrrXYILbkZF6sw8ftilFAwinaThGYkKAAA=',
    width: 592,
    height: 1280,
    alt: 'Andre and Emily — Stronger together, obviously',
    caption: 'Stronger together, obviously',
    orientation: 'portrait',
    position: '50% 42%',
    chapter: 'training',
  },
]

export default photos
