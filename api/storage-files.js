const projectUrl = 'https://ujdkepevbkjwwotcmnvr.supabase.co'
const bucket = 'emily-birthday-media'
const imagePattern = /\.(avif|gif|jpe?g|png|webp)$/i

function storageHeaders() {
  const key = (
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    ''
  ).trim()

  const headers = { 'Content-Type': 'application/json' }
  if (key) {
    headers.apikey = key
    if (key.startsWith('eyJ')) headers.Authorization = `Bearer ${key}`
  }
  return headers
}

async function listFolder(prefix) {
  const result = await fetch(`${projectUrl}/storage/v1/object/list/${bucket}`, {
    method: 'POST',
    headers: storageHeaders(),
    body: JSON.stringify({
      prefix,
      limit: 1000,
      offset: 0,
      sortBy: { column: 'name', order: 'asc' },
    }),
  })

  if (!result.ok) {
    const body = await result.text()
    throw new Error(`Storage list failed (${result.status}): ${body.slice(0, 400)}`)
  }

  const items = await result.json()
  const files = []

  for (const item of items) {
    const itemPath = prefix ? `${prefix}/${item.name}` : item.name
    const looksLikeFolder = !item.id && !item.metadata && !imagePattern.test(item.name)

    if (looksLikeFolder) {
      files.push(...await listFolder(itemPath))
      continue
    }

    const isImage = imagePattern.test(item.name) || item.metadata?.mimetype?.startsWith('image/')
    if (isImage) files.push(itemPath)
  }

  return files
}

export default async function handler(request, response) {
  const prefix = String(request.query?.prefix || 'Photos')

  try {
    const files = await listFolder(prefix)
    response.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=86400')
    response.status(200).json({ prefix, count: files.length, files })
  } catch (error) {
    response.setHeader('Cache-Control', 'no-store')
    response.status(500).json({
      prefix,
      error: error instanceof Error ? error.message : String(error),
    })
  }
}
