'use client'

import Image from 'next/image'
import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import {
  INVIDIOUS_ORIGINS,
  invidiousEmbedUrl,
  isYouTubeEmbedBlockedError,
  parseVideoUrl,
  youtubeThumbnailUrl,
  youtubeWatchUrl,
} from '@/lib/video'
import '@/styles/video-embed.css'

type Props = {
  url: string
  platform?: string
  title?: string
  priority?: boolean
  /** full = edge-to-edge, contained = centered cinema embed (default) */
  layout?: 'full' | 'contained'
  className?: string
  /** Optional poster (e.g. project cover) for the age-restriction fallback card */
  posterUrl?: string | null
}

type Phase = 'youtube' | 'invidious' | 'fallback'

const INVIDIOUS_FAIL_MS = 2500

declare global {
  interface Window {
    YT?: {
      Player: new (
        el: HTMLElement | string,
        opts: {
          videoId: string
          width?: string | number
          height?: string | number
          playerVars?: Record<string, string | number>
          events?: {
            onReady?: (e: { target: YtPlayer }) => void
            onError?: (e: { data: number }) => void
          }
        },
      ) => YtPlayer
    }
    onYouTubeIframeAPIReady?: () => void
  }
}

type YtPlayer = {
  destroy: () => void
}

let ytApiPromise: Promise<void> | null = null

function loadYouTubeIframeApi(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve()
  if (window.YT?.Player) return Promise.resolve()
  if (ytApiPromise) return ytApiPromise

  ytApiPromise = new Promise((resolve) => {
    const prev = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      prev?.()
      resolve()
    }
    if (!document.querySelector('script[data-yt-iframe-api]')) {
      const script = document.createElement('script')
      script.src = 'https://www.youtube.com/iframe_api'
      script.async = true
      script.dataset.ytIframeApi = '1'
      document.head.appendChild(script)
    }
    if (window.YT?.Player) resolve()
  })

  return ytApiPromise
}

async function probeInvidiousVideo(origin: string, videoId: string, timeoutMs: number): Promise<boolean> {
  const controller = new AbortController()
  const timer = window.setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(`${origin.replace(/\/$/, '')}/api/v1/videos/${videoId}`, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    })
    if (!res.ok) return false
    const data = (await res.json()) as {
      videoId?: string
      adaptiveFormats?: unknown[]
      formatStreams?: unknown[]
      error?: string
    }
    if (data.error) return false
    const hasStreams =
      (Array.isArray(data.adaptiveFormats) && data.adaptiveFormats.length > 0) ||
      (Array.isArray(data.formatStreams) && data.formatStreams.length > 0)
    return Boolean(data.videoId || hasStreams)
  } catch {
    return false
  } finally {
    window.clearTimeout(timer)
  }
}

export function VideoEmbed({
  url,
  platform,
  title,
  priority = false,
  layout = 'contained',
  className = '',
  posterUrl,
}: Props) {
  const parsed = parseVideoUrl(url, platform)
  const t = useTranslations('videoEmbed')
  const reactId = useId().replace(/:/g, '')

  const [phase, setPhase] = useState<Phase>('youtube')
  const [invidiousOriginIndex, setInvidiousOriginIndex] = useState(0)
  const [ytReady, setYtReady] = useState(false)

  const hostRef = useRef<HTMLDivElement | null>(null)
  const playerRef = useRef<YtPlayer | null>(null)
  const invidiousOkRef = useRef(false)

  const isYouTube = parsed?.platform === 'YouTube' && Boolean(parsed.videoId)
  const videoId = parsed?.videoId
  const watchUrl =
    parsed?.watchUrl ?? (videoId && isYouTube ? youtubeWatchUrl(videoId) : url)
  const poster =
    posterUrl ||
    parsed?.thumbnailUrl ||
    (videoId && isYouTube ? youtubeThumbnailUrl(videoId) : null)

  const goInvidious = useCallback(() => {
    try {
      playerRef.current?.destroy()
    } catch {
      /* ignore */
    }
    playerRef.current = null
    setYtReady(false)
    setPhase('invidious')
  }, [])

  const goFallback = useCallback(() => {
    try {
      playerRef.current?.destroy()
    } catch {
      /* ignore */
    }
    playerRef.current = null
    setPhase('fallback')
  }, [])

  // YouTube IFrame API — detect embed / age blocks (errors 101, 150, …)
  useEffect(() => {
    if (!isYouTube || !videoId || phase !== 'youtube') return

    let cancelled = false

    const mount = async () => {
      try {
        await loadYouTubeIframeApi()
      } catch {
        if (!cancelled) goInvidious()
        return
      }
      if (cancelled || !window.YT?.Player || !hostRef.current) return

      hostRef.current.innerHTML = ''

      try {
        playerRef.current = new window.YT.Player(hostRef.current, {
          videoId,
          width: '100%',
          height: '100%',
          playerVars: {
            rel: 0,
            modestbranding: 1,
            playsinline: 1,
            origin: window.location.origin,
          },
          events: {
            onReady: () => {
              if (!cancelled) setYtReady(true)
            },
            onError: (e) => {
              if (cancelled) return
              if (isYouTubeEmbedBlockedError(e.data)) {
                goInvidious()
              }
            },
          },
        })
      } catch {
        if (!cancelled) goInvidious()
      }
    }

    void mount()

    return () => {
      cancelled = true
      try {
        playerRef.current?.destroy()
      } catch {
        /* ignore */
      }
      playerRef.current = null
    }
  }, [goInvidious, isYouTube, phase, videoId])

  // Server probe: age-restricted embeds often show a gate without firing onError
  useEffect(() => {
    if (!isYouTube || !videoId || phase !== 'youtube') return

    let cancelled = false
    const controller = new AbortController()

    void fetch(`/api/youtube-embed-status?id=${encodeURIComponent(videoId)}`, {
      signal: controller.signal,
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { blocked?: boolean } | null) => {
        if (cancelled || !data?.blocked) return
        goInvidious()
      })
      .catch(() => {
        /* keep YouTube; onError path remains */
      })

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [goInvidious, isYouTube, phase, videoId])

  /**
   * Invidious phase:
   * - Probe API for up to 2.5s (streams available?)
   * - If OK → keep embed (cancel fail path)
   * - If fail → try next instance, or show age-restriction card
   */
  useEffect(() => {
    if (phase !== 'invidious' || !videoId) return

    let cancelled = false
    invidiousOkRef.current = false
    const origin = INVIDIOUS_ORIGINS[invidiousOriginIndex] ?? INVIDIOUS_ORIGINS[0]

    const failTimer = window.setTimeout(() => {
      if (cancelled || invidiousOkRef.current) return
      if (invidiousOriginIndex < INVIDIOUS_ORIGINS.length - 1) {
        setInvidiousOriginIndex((i) => i + 1)
      } else {
        goFallback()
      }
    }, INVIDIOUS_FAIL_MS)

    void probeInvidiousVideo(origin, videoId, INVIDIOUS_FAIL_MS - 100).then((ok) => {
      if (cancelled) return
      if (ok) {
        invidiousOkRef.current = true
        window.clearTimeout(failTimer)
      }
      // if not ok, failTimer (or next origin) handles it
    })

    return () => {
      cancelled = true
      window.clearTimeout(failTimer)
    }
  }, [goFallback, invidiousOriginIndex, phase, videoId])

  if (!parsed) return null

  const shell =
    layout === 'full'
      ? 'w-full'
      : 'mx-auto w-full max-w-[min(100%,42rem)] md:max-w-[min(100%,48rem)]'

  // Vimeo / non-YouTube: simple iframe (no cascade)
  if (parsed.platform === 'Vimeo' || !isYouTube || !videoId) {
    return (
      <div className={`${shell} ${className}`}>
        <div className="video-embed relative aspect-video w-full overflow-hidden border border-white/10 bg-bg-secondary shadow-[0_16px_48px_rgba(0,0,0,0.45)]">
          <iframe
            src={parsed.embedUrl}
            title={title ?? t('defaultTitle')}
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
            allowFullScreen
            loading={priority ? 'eager' : 'lazy'}
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      </div>
    )
  }

  const invidiousSrc = invidiousEmbedUrl(
    videoId,
    INVIDIOUS_ORIGINS[invidiousOriginIndex] ?? INVIDIOUS_ORIGINS[0],
  )

  return (
    <div className={`video-embed-root ${shell} ${className}`} data-phase={phase}>
      <div className="video-embed relative aspect-video w-full overflow-hidden border border-white/10 bg-bg-secondary shadow-[0_16px_48px_rgba(0,0,0,0.45)]">
        {phase === 'youtube' ? (
          <>
            {!ytReady && poster ? (
              <Image
                src={poster}
                alt=""
                fill
                className="object-cover opacity-60"
                sizes="(max-width: 768px) 100vw, 768px"
                quality={80}
                unoptimized={poster.includes('i.ytimg.com')}
                priority={priority}
              />
            ) : null}
            <div
              ref={hostRef}
              id={`yt-host-${reactId}`}
              className="video-embed__yt absolute inset-0 h-full w-full"
              data-yt-id={videoId}
            />
          </>
        ) : null}

        {phase === 'invidious' ? (
          <iframe
            key={invidiousSrc}
            src={invidiousSrc}
            title={title ?? t('defaultTitle')}
            className="absolute inset-0 h-full w-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
            allowFullScreen
            loading="eager"
            referrerPolicy="strict-origin-when-cross-origin"
            onError={() => {
              if (invidiousOriginIndex < INVIDIOUS_ORIGINS.length - 1) {
                setInvidiousOriginIndex((i) => i + 1)
              } else {
                goFallback()
              }
            }}
          />
        ) : null}

        {phase === 'fallback' ? (
          <div className="video-embed__fallback">
            {poster ? (
              <Image
                src={poster}
                alt=""
                fill
                className="video-embed__fallback-img object-cover"
                sizes="(max-width: 768px) 100vw, 768px"
                quality={85}
                unoptimized={poster.includes('i.ytimg.com')}
                priority={priority}
              />
            ) : (
              <div className="video-embed__fallback-img video-embed__fallback-img--empty" />
            )}
            <div className="video-embed__fallback-veil" aria-hidden />
            <div className="video-embed__fallback-content">
              <p className="video-embed__fallback-kicker">{t('restrictedKicker')}</p>
              <p className="video-embed__fallback-msg">{t('restrictedMessage')}</p>
              <a
                href={watchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="video-embed__fallback-cta"
              >
                {t('openOnYoutube')}
              </a>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
