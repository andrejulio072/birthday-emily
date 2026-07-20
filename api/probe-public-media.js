const baseUrl = 'https://ujdkepevbkjwwotcmnvr.supabase.co/storage/v1/object/public/emily-birthday-media'

function encodePath(path) {
  return String(path || '')
    .split('/')
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))
    .join('/')
}

export default async function handler(request, response) {
  const path = String(request.query?.path || '')
  if (!path) {
    response.status(400).json({ error: 'Missing path' })
    return
  }

  const url = `${baseUrl}/${encodePath(path)}`

  try {
    const result = await fetch(url, {
      method: 'GET',
      headers: { Range: 'bytes=0-0' },
      redirect: 'follow',
    })

    response.setHeader('Cache-Control', 'no-store')
    response.status(200).json({
      path,
      url,
      ok: result.ok,
      status: result.status,
      contentType: result.headers.get('content-type'),
      contentLength: result.headers.get('content-length'),
      contentRange: result.headers.get('content-range'),
    })
  } catch (error) {
    response.setHeader('Cache-Control', 'no-store')
    response.status(500).json({
      path,
      url,
      error: error instanceof Error ? error.message : String(error),
    })
  }
}
