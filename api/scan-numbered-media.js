const baseUrl = 'https://ujdkepevbkjwwotcmnvr.supabase.co/storage/v1/object/public/emily-birthday-media'

const presets = {
  birthday: { folders: ['Photos/birthday', 'birthday'], prefixes: ['birthday'] },
  us: { folders: ['Photos/us', 'couple'], prefixes: ['us', 'quiet', 'training', 'many-sides', 'couple'] },
  adventures: { folders: ['Photos/adventures', 'dublin', ''], prefixes: ['adventure', 'dublin', 'london'] },
  alicante: { folders: ['Photos/alicante', 'alicante'], prefixes: ['alicante'] },
}

function encodePath(path) {
  return path.split('/').filter(Boolean).map(encodeURIComponent).join('/')
}

async function check(path) {
  try {
    const result = await fetch(`${baseUrl}/${encodePath(path)}`, {
      method: 'GET',
      headers: { Range: 'bytes=0-0' },
      redirect: 'follow',
    })
    return result.ok ? {
      path,
      status: result.status,
      type: result.headers.get('content-type'),
      size: result.headers.get('content-range') || result.headers.get('content-length'),
    } : null
  } catch {
    return null
  }
}

export default async function handler(request, response) {
  const presetName = String(request.query?.preset || 'birthday')
  const preset = presets[presetName] || presets.birthday
  const max = Math.min(Math.max(Number(request.query?.max || 60), 1), 100)
  const paths = []

  for (const folder of preset.folders) {
    for (const prefix of preset.prefixes) {
      for (let index = 1; index <= max; index += 1) {
        const number = String(index).padStart(3, '0')
        for (const name of [
          `${prefix}-${number}-1280.webp`,
          `${prefix}-${number}-480.webp`,
          `${prefix}-${number}.webp`,
          `${prefix}-${number}.jpg`,
          `${prefix}-${number}.jpeg`,
          `${prefix}-${number}.png`,
        ]) {
          paths.push(folder ? `${folder}/${name}` : name)
        }
      }
    }
  }

  const available = []
  for (let index = 0; index < paths.length; index += 24) {
    const chunk = await Promise.all(paths.slice(index, index + 24).map(check))
    available.push(...chunk.filter(Boolean))
  }

  response.setHeader('Cache-Control', 'no-store')
  response.status(200).json({ preset: presetName, checked: paths.length, availableCount: available.length, available })
}
