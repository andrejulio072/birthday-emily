import { mediaUrl } from '../config/media'
import type { PhotoMemory } from './types'

const photos: PhotoMemory[] = [
  {
    id: 'us-001',
    thumbSrc: mediaUrl('photos/us/block-01/us-001-480.webp'),
    displaySrc: mediaUrl('photos/us/block-01/us-001-1280.webp'),
    blurDataUrl: 'data:image/webp;base64,UklGRpwAAABXRUJQVlA4IJAAAAAQBACdASocAAwAPwForE6rJaQiMAgBYCAJaAAD5YoN6z0HY6jAzh4LcAD+w0N0W5KAj7xmIFaVHY8tL++f8a+6r4Wa10ful7HVNQtbk7tqHgxhxp1zQ1i/WbVHv0OMEr1Wo10S1xlgrzqJGvr63UIe2ulyuHamvPVxCtNHrk1A1uasnJAQg9Shz3ZrlRYAAAA=',
    width: 1280,
    height: 591,
    alt: 'Andre and Emily — One of those simple days that became ours',
    caption: 'One of those simple days that became ours',
    orientation: 'landscape',
    position: '50% 50%',
    chapter: 'us',
  },
  {
    id: 'us-002',
    thumbSrc: mediaUrl('photos/us/block-01/us-002-480.webp'),
    displaySrc: mediaUrl('photos/us/block-01/us-002-1280.webp'),
    blurDataUrl: 'data:image/webp;base64,UklGRrIAAABXRUJQVlA4IKYAAABwBACdASocAAwAPwFqrU8rJaQiMAgBYCAJZgCdMoM6AEsnpFpVRXN7Zk5pgAD+aKoviqNi8StZzvrpQ35fNMxEHSmEvIrnZGWMBqF/OB65fH3TNDtgntMQrIaw/En+IApvpxjsbfd7OEITtZ3jQT1gPoAFbuq6zUjhmXL2TvEON6kNAYBfb1G+vbiNBucEd169p2tz9YjCt1Os8OuiDwWRwIIBgAAA',
    width: 1280,
    height: 591,
    alt: 'Andre and Emily — Us, sunshine and a castle behind us',
    caption: 'Us, sunshine and a castle behind us',
    orientation: 'landscape',
    position: '50% 50%',
    chapter: 'us',
  },
  {
    id: 'us-003',
    thumbSrc: mediaUrl('photos/us/block-01/us-003-480.webp'),
    displaySrc: mediaUrl('photos/us/block-01/us-003-1280.webp'),
    blurDataUrl: 'data:image/webp;base64,UklGRqgAAABXRUJQVlA4IJwAAAAwBACdASocAAwAPwFqrU6rJiQiMAgBYCAJbAC7AYv0YmIALmmQoTZrYYAA/VFyimiAC5gj/9U6wmmnEzQyH4k1HNnTNt9A9WSOU8Sn8DcnOqoKZerfDDZ7douOlfcTV5YCfZRNKkIft2Rd90ge+YV1hZKbT/V8UkJ1E7kHBrUmpgtqb7fljNaCo9J5a9sH2RoDeAZDF5V4eo0LIAA=',
    width: 1280,
    height: 591,
    alt: 'Andre and Emily — A quiet moment on the grass',
    caption: 'A quiet moment on the grass',
    orientation: 'landscape',
    position: '50% 50%',
    chapter: 'us',
  },
  {
    id: 'us-004',
    thumbSrc: mediaUrl('photos/us/block-01/us-004-480.webp'),
    displaySrc: mediaUrl('photos/us/block-01/us-004-1280.webp'),
    blurDataUrl: 'data:image/webp;base64,UklGRrYAAABXRUJQVlA4IKoAAAAwBACdASocAAwAPwForE6rJaQiMAgBYCAJaACdMoACRX2xKaU9vr+VsiAA/mipyHx9lseajFcT5IBUfKMq6itMKCxjbat2RlZrZZ12QMRk2+RRH35mhmQ+FPlkNqR0dDwdVGCGHApfe9SYWdFFzME3dUZ7BCwDWBIJrC8uEHtb8amnQpmlU4b+XnsOtqdgXkBj4NStJAdIlzF3SWnZOOAfe5gjcFkcCJtOAA==',
    width: 1280,
    height: 591,
    alt: 'Andre and Emily — The kind of memory I want to keep',
    caption: 'The kind of memory I want to keep',
    orientation: 'landscape',
    position: '50% 50%',
    chapter: 'us',
  },
]

export default photos
