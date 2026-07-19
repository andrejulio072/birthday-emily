const base = 'https://ujdkepevbkjwwotcmnvr.supabase.co/storage/v1/object/public/emily-birthday-media'

const samples = [
  { id: 'us-001', folders: ['photos/us/block-01', 'Photos/us/block-01', 'photos/us', 'Photos/us', ''] },
  { id: 'quiet-001', folders: ['photos/quiet-days/block-01', 'Photos/quiet-days/block-01', 'photos/us/quiet-days/block-01', 'Photos/us/quiet-days/block-01', 'photos/us', 'Photos/us', ''] },
  { id: 'training-001', folders: ['photos/training/block-01', 'Photos/training/block-01', 'photos/us/training/block-01', 'Photos/us/training/block-01', 'photos/us', 'Photos/us', ''] },
  { id: 'adventure-001', folders: ['photos/adventures/block-01', 'Photos/adventures/block-01', 'photos/adventures', 'Photos/adventures', ''] },
  { id: 'alicante-001', folders: ['photos/alicante/block-01', 'Photos/alicante/block-01', 'photos/alicante', 'Photos/alicante', ''] },
  { id: 'adventure-015', folders: ['photos/adventures/block-01', 'Photos/adventures/block-01', 'photos/adventures', 'Photos/adventures', ''] },
]

function pathsFor(sample) {
  const names = [
    `${sample.id}-480.webp`,
    `${sample.id}-1280.webp`,
    `${sample.id}.webp`,
    `${sample.id}.jpg`,
    `${sample.id}.jpeg`,
    `${sample.id}.png`,
  ]
  const paths = []
  for (const folder of sample.folders) {
    for (const name of names) paths.push(folder ? `${folder}/${name}` : name)
    for (const ext of ['jpg', 'jpeg', 'png', 'webp']) {
      paths.push(folder ? `${folder}/raw/${sample.id}.${ext}` : `raw/${sample.id}.${ext}`)
    }
  }
  return [...new Set(paths)]
}

async function check(path) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 7000)
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

export default async function handler(_request, response) {
  const output = {}
  for (const sample of samples) {
    const paths = pathsFor(sample)
    const results = []
    for (let index = 0; index < paths.length; index += 12) {
      results.push(...await Promise.all(paths.slice(index, index + 12).map(check)))
    }
    output[sample.id] = {
      available: results.filter((item) => item.ok),
      checked: results.length,
      statuses: results.reduce((counts, item) => {
        counts[item.status] = (counts[item.status] || 0) + 1
        return counts
      }, {}),
    }
  }
  response.setHeader('Cache-Control', 'no-store')
  response.status(200).json(output)
}
