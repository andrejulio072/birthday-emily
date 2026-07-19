const projectUrl = 'https://ujdkepevbkjwwotcmnvr.supabase.co'
const bucket = 'emily-birthday-media'

export default async function handler(request, response) {
  const prefix = String(request.query?.prefix || 'Photos/adventures')
  try {
    const result = await fetch(`${projectUrl}/storage/v1/object/list/${bucket}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prefix, limit: 1000, offset: 0, sortBy: { column: 'name', order: 'asc' } }),
    })
    const text = await result.text()
    response.setHeader('Cache-Control', 'no-store')
    response.status(200).json({ upstreamStatus: result.status, prefix, body: text.slice(0, 20000) })
  } catch (error) {
    response.status(500).json({ error: error instanceof Error ? error.message : String(error) })
  }
}
