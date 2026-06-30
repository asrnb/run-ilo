import { isSupabaseConfigured } from './events'
import { createAuthClient, createServiceClient } from './supabase/server'

export async function getSessionUser() {
  if (!isSupabaseConfigured()) return null
  const {
    data: { user },
  } = await createAuthClient().auth.getUser()
  return user
}

export async function checkIsAdmin(userId: string): Promise<boolean> {
  const { data } = await createServiceClient()
    .from('admins')
    .select('user_id')
    .eq('user_id', userId)
    .single()
  return !!data
}
