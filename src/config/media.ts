const defaultMediaBaseUrl = 'https://ujdkepevbkjwwotcmnvr.supabase.co/storage/v1/object/public/emily-birthday-media'

export const MEDIA_BASE_URL = (
  import.meta.env.VITE_MEDIA_BASE_URL || defaultMediaBaseUrl
).replace(/\/$/, '')

function numberedFile(fileName: string, offset: number) {
  const match = fileName.match(/^(?:quiet|training|many-sides)-(\d{3})(-.+)$/i)
  if (!match) return fileName
  const number = Number(match[1]) + offset
  return `us-${String(number).padStart(3, '0')}${match[2]}`
}

export function normaliseMediaPath(path: string) {
  const cleanPath = path.replace(/^\//, '')
  const fileName = cleanPath.split('/').pop() || cleanPath

  if (/^photos\/us\//i.test(cleanPath)) {
    return `Photos/us/${fileName}`
  }

  if (/^photos\/quiet-days\//i.test(cleanPath)) {
    return `Photos/us/${numberedFile(fileName, 4)}`
  }

  if (/^photos\/training\//i.test(cleanPath)) {
    return `Photos/us/${numberedFile(fileName, 12)}`
  }

  if (/^photos\/many-sides\//i.test(cleanPath)) {
    return `Photos/us/${numberedFile(fileName, 15)}`
  }

  if (/^(?:photos\/adventures\/|adventure-)/i.test(cleanPath)) {
    return `Photos/adventures/${fileName}`
  }

  if (/^photos\/alicante\//i.test(cleanPath)) {
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
