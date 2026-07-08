import { NextRequest, NextResponse } from 'next/server'
import { addJoin, getJoinCount } from '@/lib/events'

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await addJoin(params.id)
    const count = await getJoinCount(params.id)
    return NextResponse.json({ ok: true, count })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : JSON.stringify(err)
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const count = await getJoinCount(params.id)
  return NextResponse.json({ ok: true, count })
}
