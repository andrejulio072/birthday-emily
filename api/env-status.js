export default function handler(_request, response) {
  const names = [
    'SUPABASE_SERVICE_ROLE_KEY',
    'SUPABASE_ANON_KEY',
    'SUPABASE_PUBLISHABLE_KEY',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY',
    'VITE_SUPABASE_ANON_KEY',
    'VITE_SUPABASE_PUBLISHABLE_KEY',
  ]

  response.setHeader('Cache-Control', 'no-store')
  response.status(200).json(Object.fromEntries(names.map((name) => [name, Boolean(process.env[name]?.trim())])))
}
