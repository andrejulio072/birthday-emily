const projectUrl = 'https://ujdkepevbkjwwotcmnvr.supabase.co'
const bucket = 'emily-birthday-media'
const publishableKey = 'sb_publishable_Wron3ni9wWjQ5OR7x8gOAA_uJd2dcd4'

const folders = [
  '',
  'Photos',
  'photos',
  'Photos/birthday',
  'photos/birthday',
  'Photos/us',
  'photos/us',
  'Photos/adventures',
  'photos/adventures',
  'Photos/alicante',
  'photos/alicante',
]

async function listFolder(prefix) {
  const result = await fetch(`${projectUrl}/storage/v1/object/list/${bucket}`, {
    method: 'POST',
    headers: {
      apikey: publishableKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prefix,
      limit: 1000,
      offset: 0,
      sortBy: { column: 'name', order: 'asc' },
    }),
  })

  const body = await result.json().catch(() => null)
  return {
    prefix: prefix || '(root)',
    ok: result.ok,
    status: result.status,
    count: Array.isArray(body) ? body.length : 0,
    items: Array.isArray(body)
      ? body.slice(0, 12).map((item) => ({ name: item.name, id: item.id || null, metadata: item.metadata || null }))
      : [],
    error: result.ok ? null : body,
  }
}

export default async function handler(_request, response) {
  const results = []
  for (const folder of folders) results.push(await listFolder(folder))
  response.setHeader('Cache-Control', 'no-store')
  response.status(results.every((item) => item.ok) ? 200 : 502).json({ results })
}
