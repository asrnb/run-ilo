import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  if (!process.env.XAI_API_KEY) {
    return NextResponse.json({ ok: false, error: 'XAI_API_KEY not set in .env.local' }, { status: 500 })
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
    if (!res.ok) throw new Error(`Could not fetch page (${res.status})`)
    pageText = await res.text()
    if (!pageText || pageText.length < 100) throw new Error('Page content too short — event may be private or require login')
  } catch (err: unknown) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : 'Failed to fetch page' },
      { status: 422 },
    )
  }

  // Extract race details with Grok
  const prompt = `Extract the race event details from this page text and return ONLY a JSON object — no explanation, no markdown, just raw JSON.

Rules:
- date: YYYY-MM-DD format. If year is missing assume 2026.
- gunStart: HH:MM in 24-hour format (e.g. "05:00"). null if not found.
- distances: array of integers in km. Map "5K"→5, "10K"→10, "half marathon"/"21K"→21, "full marathon"/"42K"→42. Empty array if unknown.
- location: the starting point or venue name only (short, no full address).
- registrationUrl: a separate registration link if present. null otherwise.
- description: 1-2 sentence summary. null if nothing useful.

Return exactly this shape:
{"name":"...","date":"...","gunStart":"...","distances":[...],"location":"...","description":"...","registrationUrl":"..."}

Page text:
${pageText.slice(0, 6000)}`

  try {
    const grokRes = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.XAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'grok-3-mini',
        max_tokens: 512,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    if (!grokRes.ok) {
      const err = await grokRes.text()
      throw new Error(`Grok API error: ${err}`)
    }

    const grokJson = await grokRes.json()
    const raw = grokJson.choices?.[0]?.message?.content?.trim() ?? ''

    // Strip markdown code fences if Grok wraps in ```json
    const cleaned = raw.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim()
    const extracted = JSON.parse(cleaned)
    return NextResponse.json({ ok: true, data: extracted })
  } catch (err: unknown) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : 'AI extraction failed' },
      { status: 422 },
    )
  }
}
