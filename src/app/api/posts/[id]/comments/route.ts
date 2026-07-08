import { NextRequest, NextResponse } from 'next/server'
import { getComments, addComment } from '@/lib/posts'

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const comments = await getComments(params.id)
  return NextResponse.json({ ok: true, comments })
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const body = await req.json()
    if (!body.authorName?.trim() || !body.content?.trim()) {
      return NextResponse.json({ ok: false, error: 'Name and content required' }, { status: 400 })
    }
    const comment = await addComment(params.id, body.authorName.trim(), body.content.trim())
    return NextResponse.json({ ok: true, comment })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : JSON.stringify(err)
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}
