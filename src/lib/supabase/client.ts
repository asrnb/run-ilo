import { createBrowserClient } from '@supabase/ssr'

// Returns a new browser client on each call — auth state is stored in cookies,
// not localStorage, so it's readable by the server.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}
