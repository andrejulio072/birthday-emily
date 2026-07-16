import { mediaUrl } from '../config/media'
import type { PhotoMemory } from './types'

const photos: PhotoMemory[] = [
  {
    id: 'many-sides-001',
    thumbSrc: mediaUrl('photos/many-sides/block-01/many-sides-001-480.webp'),
    displaySrc: mediaUrl('photos/many-sides/block-01/many-sides-001-1280.webp'),
    blurDataUrl: 'data:image/webp;base64,UklGRmwAAABXRUJQVlA4IGAAAABwBACdASoRAB4APvVusVCqpqUiqAqpUB6JZQC/7BDROMww2Ag9NkLoSnHzgAD9zPZ36gX8NxLYTRhHHF/S75hhvZ9+lgeg5BVeiLxckwb8TuDBblRpGJC27AUqTaGAAAA=',
    width: 720,
    height: 1280,
    alt: 'Emily — Soft, simple and completely herself',
    caption: 'Soft, simple and completely herself',
    orientation: 'portrait',
    position: '50% 35%',
    chapter: 'many-sides',
  },
  {
    id: 'many-sides-002',
    thumbSrc: mediaUrl('photos/many-sides/block-01/many-sides-002-480.webp'),
    displaySrc: mediaUrl('photos/many-sides/block-01/many-sides-002-1280.webp'),
    blurDataUrl: 'data:image/webp;base64,UklGRmIAAABXRUJQVlA4IFYAAACwAwCdASoOAB4APvVkq04qpaQiMAgBUB6JQBadBDnG2yEpbS554AD+0xGVVJeodweptKoYhFvmMJI4vmbA0lL2dDczmF1Ehw2scxxJExYutRqhEXcQAA==',
    width: 592,
    height: 1280,
    alt: 'Emily — Emily in her own little world',
    caption: 'Emily in her own little world',
    orientation: 'portrait',
    position: '50% 35%',
    chapter: 'many-sides',
  },
]

export default photos
