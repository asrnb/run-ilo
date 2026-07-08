import { NextRequest, NextResponse } from 'next/server'
import { addReaction } from '@/lib/posts'

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const body = await req.json()
    const emoji = body.emoji || '🔥'
    await addReaction(params.id, emoji)
    return NextResponse.json({ ok: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : JSON.stringify(err)
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}
