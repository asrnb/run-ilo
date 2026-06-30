// Server-only. Never import this in Client Components.
// Service-role key must not be exposed to the browser.
import { createClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const url = () => process.env.NEXT_PUBLIC_SUPABASE_URL!

export function createAnonClient() {
  return createClient(url(), process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
}

export function createServiceClient() {
  return createClient(url(), process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

// Cookie-based client for reading the logged-in user's session.
// Use this (not the anon or service client) whenever you need auth.getUser().
export function createAuthClient() {
  const cookieStore = cookies()
  return createServerClient(url(), process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          )
        } catch {
          // Server component — cannot set cookies, safe to ignore
        }
      },
    },
  })
}
