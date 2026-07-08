import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

const BUCKET = 'race-banners'

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData()
    const file = form.get('file') as File | null
    const slug = form.get('slug') as string | null
    if (!file || !slug) return NextResponse.json({ ok: false, error: 'file and slug required' }, { status: 400 })

    const ext = file.name.split('.').pop() ?? 'jpg'
    const path = `${slug}-${Date.now()}.${ext}`
    const bytes = await file.arrayBuffer()
    const supabase = createServiceClient()
    const { error } = await supabase.storage.from(BUCKET).upload(path, bytes, {
      contentType: file.type,
      upsert: true,
    })
    if (error) throw error
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
    return NextResponse.json({ ok: true, url: data.publicUrl })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : JSON.stringify(err)
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}
