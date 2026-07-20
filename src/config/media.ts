const defaultMediaBaseUrl = 'https://ujdkepevbkjwwotcmnvr.supabase.co/storage/v1/object/public/emily-birthday-media'

export const MEDIA_BASE_URL = (
  import.meta.env.VITE_MEDIA_BASE_URL || defaultMediaBaseUrl
).replace(/\/$/, '')

export function normaliseMediaPath(path: string) {
  const cleanPath = path.replace(/^\//, '')
  const fileName = cleanPath.split('/').pop() || cleanPath

  if (/^photos\/us\//i.test(cleanPath)) {
    return `Photos/us/${fileName}`
  }

  if (/^photos\/quiet-days\//i.test(cleanPath)) {
    return `Photos/quiet-days/${fileName}`
  }

  if (/^photos\/training\//i.test(cleanPath)) {
    return `Photos/training/${fileName}`
  }

  if (/^photos\/many-sides\//i.test(cleanPath)) {
    return `Photos/many-sides/${fileName}`
  }

  if (/^(?:photos\/adventures\/|adventure-)/i.test(cleanPath)) {
    return `Photos/adventures/${fileName}`
  }

  if (/^photos\/(?:trips\/)?alicante\//i.test(cleanPath)) {
    return `Photos/alicante/${fileName}`
  }

  if (/^photos\/birthday\//i.test(cleanPath)) {
    return `Photos/birthday/${fileName}`
  }

  return cleanPath
}

export function mediaUrl(path: string) {
  return `${MEDIA_BASE_URL}/${normaliseMediaPath(path)}`
}
