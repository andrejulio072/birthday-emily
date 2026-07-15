const defaultMediaBaseUrl = 'https://fqivhobabbxxbtkjlnmq.supabase.co/storage/v1/object/public/emily-birthday-media'

export const MEDIA_BASE_URL = (
  import.meta.env.VITE_MEDIA_BASE_URL || defaultMediaBaseUrl
).replace(/\/$/, '')

export function mediaUrl(path: string) {
  return `${MEDIA_BASE_URL}/${path.replace(/^\//, '')}`
}
