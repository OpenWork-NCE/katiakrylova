import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const YT_ID = /^[a-zA-Z0-9_-]{11}$/

/**
 * Lightweight server probe: fetch the public YouTube embed page and look for
 * age-gate / login-required markers that break third-party playback.
 *
 * GET /api/youtube-embed-status?id=VIDEO_ID
 * → { id, blocked: boolean, reason?: string }
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')?.trim() ?? ''

  if (!YT_ID.test(id)) {
    return NextResponse.json({ error: 'invalid_id' }, { status: 400 })
  }

  try {
    const res = await fetch(`https://www.youtube.com/embed/${id}`, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (compatible; KatiaKrylovaBot/1.0; +https://katiakrylova.com)',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      // Avoid caching a “blocked” result forever if YouTube changes policy
      next: { revalidate: 3600 },
    })

    const html = await res.text()
    const lower = html.toLowerCase()

    const ageRestricted =
      lower.includes('age-restricted') ||
      lower.includes('age restricted') ||
      lower.includes(' agerestricted') ||
      lower.includes('login_required') ||
      lower.includes('sign in to confirm your age') ||
      lower.includes('this video is age-restricted') ||
      lower.includes('only available on youtube') ||
      // playabilityStatus in embedded ytInitialPlayerResponse
      /"status"\s*:\s*"login_required"/i.test(html) ||
      /"reason"\s*:\s*"[^"]*age[^"]*"/i.test(html)

    return NextResponse.json({
      id,
      blocked: ageRestricted,
      reason: ageRestricted ? 'age_restricted' : undefined,
    })
  } catch {
    // Probe failure → do not force fallback; client keeps YouTube / onError path
    return NextResponse.json({ id, blocked: false, reason: 'probe_failed' })
  }
}
