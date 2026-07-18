const base = 'https://ujdkepevbkjwwotcmnvr.supabase.co/storage/v1/object/public/emily-birthday-media'

function pathsFor(id, rendition) {
  const file = `${id}-${rendition}.webp`
  return [
    file,
    `Photos/adventures/${file}`,
    `photos/adventures/${file}`,
    `Photos/adventures/optimized/${file}`,
    `photos/adventures/block-01/${file}`,
  ]
}

async function check(path) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 5000)
  try {
    const response = await fetch(`${base}/${path}`, {
      method: 'HEAD',
      signal: controller.signal,
      redirect: 'follow',
    })
    return {
      path,
      ok: response.ok,
      status: response.status,
      type: response.headers.get('content-type'),
      size: response.headers.get('content-length'),
    }
  } catch (error) {
    return { path, ok: false, status: 0, error: error instanceof Error ? error.message : String(error) }
  } finally {
    clearTimeout(timeout)
  }
}

export default async function handler(_request, response) {
  const paths = []
  for (let number = 1; number <= 13; number += 1) {
    const id = `adventure-${String(number).padStart(3, '0')}`
    paths.push(...pathsFor(id, '480'), ...pathsFor(id, '1280'))
    paths.push(`Photos/adventures/raw/${id}.jpg`)
  }

  const results = []
  for (let index = 0; index < paths.length; index += 10) {
    results.push(...await Promise.all(paths.slice(index, index + 10).map(check)))
  }

  const available = results.filter((item) => item.ok)
  response.setHeader('Cache-Control', 'no-store')
  response.status(200).json({ checked: results.length, available: available.length, files: available, missing: results.filter((item) => !item.ok) })
}
