const base = 'https://ujdkepevbkjwwotcmnvr.supabase.co/storage/v1/object/public/emily-birthday-media'

const samples = {
  'us-001': ['photos/us/block-01', 'Photos/us/block-01', 'photos/us', 'Photos/us', ''],
  'quiet-001': ['photos/quiet-days/block-01', 'Photos/quiet-days/block-01', 'photos/us/quiet-days/block-01', 'Photos/us/quiet-days/block-01', 'photos/us', 'Photos/us', ''],
  'training-001': ['photos/training/block-01', 'Photos/training/block-01', 'photos/us/training/block-01', 'Photos/us/training/block-01', 'photos/us', 'Photos/us', ''],
  'adventure-001': ['photos/adventures/block-01', 'Photos/adventures/block-01', 'photos/adventures', 'Photos/adventures', ''],
  'alicante-001': ['photos/alicante/block-01', 'Photos/alicante/block-01', 'photos/alicante', 'Photos/alicante', ''],
  'adventure-015': ['photos/adventures/block-01', 'Photos/adventures/block-01', 'photos/adventures', 'Photos/adventures', ''],
}

function pathsFor(id, folders) {
  const names = [`${id}-480.webp`, `${id}-1280.webp`, `${id}.webp`, `${id}.jpg`, `${id}.jpeg`, `${id}.png`]
  const paths = []
  for (const folder of folders) {
    for (const name of names) paths.push(folder ? `${folder}/${name}` : name)
    for (const ext of ['jpg', 'jpeg', 'png', 'webp']) {
      paths.push(folder ? `${folder}/raw/${id}.${ext}` : `raw/${id}.${ext}`)
    }
  }
  return [...new Set(paths)]
}

async function check(path) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 3500)
  try {
    const response = await fetch(`${base}/${path}`, {
      method: 'GET',
      headers: { Range: 'bytes=0-0' },
      signal: controller.signal,
      redirect: 'follow',
    })
    return {
      path,
      ok: response.ok,
      status: response.status,
      type: response.headers.get('content-type'),
      size: response.headers.get('content-range') || response.headers.get('content-length'),
    }
  } catch (error) {
    return { path, ok: false, status: 0, error: error instanceof Error ? error.message : String(error) }
  } finally {
    clearTimeout(timeout)
  }
}

export default async function handler(request, response) {
  const requested = String(request.query?.id || 'us-001')
  const id = Object.prototype.hasOwnProperty.call(samples, requested) ? requested : 'us-001'
  const paths = pathsFor(id, samples[id])
  const results = await Promise.all(paths.map(check))
  response.setHeader('Cache-Control', 'no-store')
  response.status(200).json({
    id,
    available: results.filter((item) => item.ok),
    checked: results.length,
    statuses: results.reduce((counts, item) => {
      counts[item.status] = (counts[item.status] || 0) + 1
      return counts
    }, {}),
  })
}
