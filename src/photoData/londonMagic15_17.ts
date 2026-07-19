import type { PhotoMemory } from './types'

const image15 = 'data:image/webp;base64,UklGRuwEAABXRUJQVlA4IOAEAACwGwCdASpBAIwAPwVsqk+rpaOiMdo7MXAgiWpruFkIXymY0CigWr0kOdqZwAOJv3tv18m/Az0Erq4TT5zlCXjhCj6wXI+k9FhBv72mJleXwXgNjtGc4+B2f/dXN7CxsmbRu4V4v2yNDAXSi8gqF372Vw7oGD3lvxghUHoZVSsGYWRwL2sQKvSZGv6VYi/kVPPBPCslTup5vZkw3510qHIQNCOy3QeCL4sVsTU4mT48Xp+MJ6NV6/pNtpmLg0GKBFZc8P7Ua8uS1Ke5eKHh0Ux7aooDN/34OroDSSiKyR8LsUOEaZKGAAD+9Wed4YB8L8/VHzBI46WpgqzT6RB6d8T/ZJMFQbjuMKfP+IEchyKLo9AqyXlYaDGGJIUgOUM/CNcamFq7IRZ5r3BQBJUBIoMeAjctJkUPd95WO6izYe2pfdJlnQ1GYZxnkx5h+KmoU9sQMPfRdnSa1BqrC9KablLJkG6qoecwTiDbNjylZaOnvIxEU/ySOCNdaueic9gW/jT5rJ9v10IQleHejVC5CauL7/AmvMKp/6EzoecH89zNfnzD2+mYoMNTpIINwO666ZH5sdHJRdRKpbJvDlb1w2uCGLdqoWrFbT++amRYwkpkFQ9PUZJFVg1xlixLNEw4insu+bQA0bUwpPIc52Oc06LPFRNiZnllabJoxnTB7/5Bd/fpIQOZp1Zf2WIP0L4wooRwKdt0WlmW2Bs3Z0/5XH/GvjROHF/upzp9AQUKwo/JDevxYAvKrgn8SNnheXkB9yjQeuGVAiOFVnh3m7ROSw1fDTec8Luet6mqPdWXTtOeOAdXGEDdxfaAwELHgSQDFBr31acCUm9xtmQ55y+cpLZ24hxAYVc2dIVSpGGojR1fNXpoHEpO3YJW7Cs4gV1M3fSy8dQ3er29bN2izkwKHTDemJX+YSJysjd+/DuJ/Y8xeJQX9JJNRAyURvrHs+NZgAHKVJhLlpCMsRxg9Nv48vkkNAfUmJq7l1kVu/i1sjdLSEhG/L7EyC1QbczQwl9EhL6N5Q0dv15F6KM8UsKGwGKIXMYHOrC4IQAObo9q6pFe0a1jo9NjW+IVw9x+AZ4haLjs1gmgKCwX/6v8Z/AiSZh5aTPMT0Le3HzAklab8/gr8Bm7tS3ikhzeHPONjxj5vT6B0r6Q5QjYtdYFITm15C/mHPtGUnw4eulVjKIcAiylJJcXmbotTG/MKEsZg58zi3J5uu5SX/DvxubM0lLysM0zVeOvu4d9fx+TpK8EVkxn7xcYlF3a7G0sGPO6THBsvDXZEcfjhwl08+faCBdnXEVDaqHrfjZLKPZBBKxVUY2qFAmXqpO84DfXrjHu5wUe2xLgUM95c5i06dZyLT4TaMA9vwFmX0d3NKrXxwqPtKfHsJfsvGE54jdO69VxYltKNMBkWLywoP/TjjzQ1WUZxLT4wVDYaiLgzw7auawhhzXSW2kT4kYXWyDjIIZendxf2pUK6vqHCjmlL+hWdWmCJmFhp4KY75337gBPFTcGi0v5uXKfMx6CXPFnV/GXAYKTjjes9IK3Mmm+L0RtE5jTDfGMFZT8tIZ22MlAUJTxVKqVeazDVatLVRhMq8MrjK5gzInHB4McWkgJ5xEicrjXoJmJiGel87rIllNoo6J/cObKQXZky1Nf/llXrLSZusoAAAA='
const image16 = 'data:image/webp;base64,UklGRsACAABXRUJQVlA4ILQCAACwEQCdASpBAIwAPwl8tVOrp7CsKfN6UhAhCWMA0Bga9F//X4V8z+XHVAMx/yPybR19zNtRzIune5spwd6wBgADqz7lFYTRpt17R8Ixb5jOPgSU5dewhbrMP3pLzP/Tpr1P6tWjiC3runz4RcIHmNQw02dhbtDlTw/vRkSgGbsYC6AHKCD733aHBdXOZ+vZmnAnsBdmYgAA/tF5vTNTVpjjZoN0fi4sF9Eyet0YLQZTmaLV8bLQQaZo59qraxyKtDRWCd/QOXthbszEEur0vFouxivBxy+9TyH46+2zthL+eIYB7CKzQyWGkWhQ7JUNIzU6TmAFa2rmNKHZ819EMHnI98hDfEjF1EFC+hcvTYOvLISiaAAQ4SZeugma8UD6tBtrBhdzOGbJPiMW3gxr1IDYhWJ2nDMFRGLAspaTJ9T7CVd7rvOWgGI0A1trtYwM9pjWDE8FynoIjxUMyEGDxZFkvFNgFgLurG6YdWYctuqhGwdUubfUyvoKTMrphK89Qa564D1B2QSYWTUMk/C+klU8zjFLssFkhbxV5DNOI+l4yCQ5upbWcE3GelWyqGIw4TrtNcIB2ehMmCqdQuBR/ymSiGSqJlkXmdQTGAxyG38JUzaP3ROK5BsKf6k3xRNYG3gsJe3SLV+z0OQuuPANf1XMY4whWyoOnsw11gc6am/ByhjVS3V5CCNbQ1xvhq/RbRPBkc7n/za1GqfKt9aNV20FNKkCPqYD+IUbHlM+YXvBaQBzN5cM87vHOFbsJsjaMMx8mQ2Pv1C4r1x6MEem6Hg1yJphROFhMixB77Zxy0ArfwUcZXQi02VuyGKntnyTEvhaJa9IQtO7S7zx+iV9wbJ61txjm8e6T0CXhlLMduw0+XKY1q+vOteLTE4nF5DY6YKvssAVvWofQT4/PSFlKGc0epQAAA=='
const image17 = 'data:image/webp;base64,UklGRsYCAABXRUJQVlA4ILoCAADwEACdASpBAIwAPwl4s1KrpySvrNY5yfAhCWMnABTYAL9ALFjR/vPdC4QHJchjrX2ZQwP//zWy60AuBafQkCbsKP4znK1T8IFERmHbtKGK2bBrsRNz02Szqy/WOlQ7WaEwZQ4tCbSAt3SYrfmdds4ZMhgt3CEj+8IeuFEwzmsyfQV8i3+BR/JW6zmDuJF/M8AA/qy+UK5dzw4t09+jHgCKZIliNk0U2hhZAXh/Jt258hOJ9+ewTDOw4hnu+qKl9KHveRs+UjMocbHIj9heofZUMOn+dDqE+o+AbU3NlngfXS71ctelSPJIFP/zg++RbHTW4fyj0IP6z3VPb9EuHDrgJL5VyBVYXkiOLQbs6m8AkcuwwgdOK1mqvQg/Vhlz5qQT0JVI53EqeHBvnf5UXtO9GwvHvSan7ZrsUWi6yYM0pW+Slpu4gOjHWUK1qYeQM6ngJHzL7x7NJaApkV76w8krBeHvIcmLy4RfTTpmnn2YNKkG3NXmSdXENUkKE+U20gl2FhpaUfWU5i9btVVH8vdOI9o9nTjmVY0PgVPtrwtu98N/I2YIRMARBvzmLIZisJcR3ZT3HlVMdZS/EfvlVcC0RHUyzaeVFzQJjvTFoTOq+70bhjaTxUAzC1+yAQDpzGNPOZX7uo9lS8gPTKVV1RInf2PvXIn/+Yvax8uzE7N2NfqZI8+NYMZ0D6dXjlwNhVWf7OCIkqAqnl8uZWs9UankY6hNEyVSM7hJJQFflOW3wSUrlkaiQn8iL5cu0YFasmoXSgeaFOgY42GCym6uVUALvP61Q4PK+/i1I9zq4zIwtglO2T51gbAhfYopAy0/IO1WkwR8zSyFQynIKOjcAj9gpZdd2iuWzOx2WcsXiqacQOc5J/Xh1Lduy78skLlgvwEDCPwclmykofd+E4GPBpHjdLhWvkr79NAAAA=='

const photos: PhotoMemory[] = [
  {
    id: 'adventure-015',
    thumbSrc: image15,
    displaySrc: image15,
    blurDataUrl: image15,
    width: 65,
    height: 140,
    alt: 'Emily — The enchanted tree found its main character',
    caption: 'The enchanted tree found its main character',
    orientation: 'portrait',
    position: '50% 46%',
    chapter: 'adventures',
    fallbackThumbSrc: 'https://ujdkepevbkjwwotcmnvr.supabase.co/storage/v1/object/public/emily-birthday-media/Photos/adventures/adventure-015-480.webp',
    fallbackDisplaySrc: 'https://ujdkepevbkjwwotcmnvr.supabase.co/storage/v1/object/public/emily-birthday-media/Photos/adventures/adventure-015-1280.webp',
    source: 'github',
  },
  {
    id: 'adventure-016',
    thumbSrc: image16,
    displaySrc: image16,
    blurDataUrl: image16,
    width: 65,
    height: 140,
    alt: 'Emily — Defying gravity in the pink kitchen',
    caption: 'Defying gravity in the pink kitchen',
    orientation: 'portrait',
    position: '50% 46%',
    chapter: 'adventures',
    fallbackThumbSrc: 'https://ujdkepevbkjwwotcmnvr.supabase.co/storage/v1/object/public/emily-birthday-media/Photos/adventures/adventure-016-480.webp',
    fallbackDisplaySrc: 'https://ujdkepevbkjwwotcmnvr.supabase.co/storage/v1/object/public/emily-birthday-media/Photos/adventures/adventure-016-1280.webp',
    source: 'github',
  },
  {
    id: 'adventure-017',
    thumbSrc: image17,
    displaySrc: image17,
    blurDataUrl: image17,
    width: 65,
    height: 140,
    alt: 'Emily — When the room turned upside down and she still looked perfect',
    caption: 'When the room turned upside down and she still looked perfect',
    orientation: 'portrait',
    position: '50% 46%',
    chapter: 'adventures',
    fallbackThumbSrc: 'https://ujdkepevbkjwwotcmnvr.supabase.co/storage/v1/object/public/emily-birthday-media/Photos/adventures/adventure-017-480.webp',
    fallbackDisplaySrc: 'https://ujdkepevbkjwwotcmnvr.supabase.co/storage/v1/object/public/emily-birthday-media/Photos/adventures/adventure-017-1280.webp',
    source: 'github',
  },
]

export default photos
