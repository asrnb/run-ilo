// Server-only. Never import this in Client Components.
// Service-role key must not be exposed to the browser.
import { createClient } from '@supabase/supabase-js'

const url = () => process.env.NEXT_PUBLIC_SUPABASE_URL!

export function createAnonClient() {
  return createClient(url(), process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
}

export function createServiceClient() {
  return createClient(url(), process.env.SUPABASE_SERVICE_ROLE_KEY!)
}
