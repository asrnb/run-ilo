import { createServiceClient } from './supabase/server'
import { isSupabaseConfigured } from './events'

const BUCKET = 'race-banners'

export async function uploadBanner(file: File, slug: string): Promise<string> {
  if (!isSupabaseConfigured()) throw new Error('Supabase not configured')
  const ext = file.name.split('.').pop() ?? 'jpg'
  const path = `${slug}-${Date.now()}.${ext}`
  const supabase = createServiceClient()
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: true })
  if (error) throw error
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return data.publicUrl
}
