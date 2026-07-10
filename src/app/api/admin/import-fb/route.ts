import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ ok: false, error: 'ANTHROPIC_API_KEY not set' }, { status: 500 })
  }

  const { url } = await req.json()
  if (!url) return NextResponse.json({ ok: false, error: 'url required' }, { status: 400 })

  // Fetch via Jina Reader — converts any URL to clean text, bypasses FB bot blocks
  let pageText: string
  try {
    const jinaUrl = `https://r.jina.ai/${encodeURIComponent(url)}`
    const res = await fetch(jinaUrl, {
      headers: { Accept: 'text/plain', 'X-Return-Format': 'text' },
    })
    if (!res.ok) throw new Error(`Jina fetch failed: ${res.status}`)
    pageText = await res.text()
    if (!pageText || pageText.length < 100) throw new Error('Page content too short — event may be private')
  } catch (err: unknown) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : 'Failed to fetch page' },
      { status: 422 },
    )
  }

  // Extract race details with Claude
  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 512,
    messages: [
      {
        role: 'user',
        content: `Extract the race event details from this page text and return ONLY a JSON object — no explanation, no markdown, just raw JSON.

Rules:
- date: YYYY-MM-DD format. If year is missing assume 2026.
- gunStart: HH:MM in 24-hour format (e.g. "05:00"). null if not found.
- distances: array of integers in km. Map "5K"→5, "10K"→10, "half marathon"/"21K"→21, "full marathon"/"42K"→42. Empty array if unknown.
- location: the starting point or venue name only (no full address).
- registrationUrl: if a separate registration link exists. null otherwise.
- description: 1-2 sentence summary of the event. null if nothing useful.

Return exactly this shape:
{"name":"...","date":"...","gunStart":"...","distances":[...],"location":"...","description":"...","registrationUrl":"..."}

Page text:
${pageText.slice(0, 6000)}`,
      },
    ],
  })

  const raw = message.content[0].type === 'text' ? message.content[0].text.trim() : ''
  try {
    const extracted = JSON.parse(raw)
    return NextResponse.json({ ok: true, data: extracted })
  } catch {
    return NextResponse.json({ ok: false, error: 'AI could not parse event details', raw }, { status: 422 })
  }
}
