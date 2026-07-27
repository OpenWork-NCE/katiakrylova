'use client'
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { PageTransitionContext, type NavigateOptions, type TransitionPhase } from './PageTransitionContext'
import { CLOSE_MS, OPEN_MS, REDUCED_FADE_MS, type TransitionIntent } from './constants'
import { isTransitionableHref, normalizePath } from './transition-utils'
import { IrisWipe, type IrisPhase } from './IrisWipe'
import { useSound } from '@/components/sound/SoundProvider'
import { closeCueForIntent, openCueForIntent, unlockSound } from '@/lib/sound-design'
import '@/styles/iris-wipe.css'

type Props = {
  children: ReactNode
}

export function PageTransitionProvider({ children }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const { play } = useSound()
  const [phase, setPhase] = useState<TransitionPhase>('idle')
  const [irisPhase, setIrisPhase] = useState<IrisPhase>('idle')
  const [intent, setIntent] = useState<TransitionIntent>('default')
  const [reduced, setReduced] = useState(false)

  const pathnameRef = useRef(pathname)
  const busyRef = useRef(false)
  const intentRef = useRef<TransitionIntent>('default')
  const closeTimerRef = useRef<number | null>(null)
  const openTimerRef = useRef<number | null>(null)
  const pendingHrefRef = useRef<string | null>(null)

  const clearTimers = useCallback(() => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
    if (openTimerRef.current !== null) {
      window.clearTimeout(openTimerRef.current)
      openTimerRef.current = null
    }
  }, [])

  const navigate = useCallback(
    (href: string, options?: NavigateOptions) => {
      if (!isTransitionableHref(href)) {
        router.push(href)
        return
      }

      const target = normalizePath(href)
      const current = normalizePath(pathname)
      if (target === current || busyRef.current) return

      const nextIntent = options?.intent ?? 'default'
      intentRef.current = nextIntent
      setIntent(nextIntent)

      // Gesture path — unlock audio (autoplay policy)
      void unlockSound()

      // Reduced motion: short fade or instant (soft click only)
      if (reduced) {
        busyRef.current = true
        setPhase('closing')
        setIrisPhase('idle')
        play(closeCueForIntent(nextIntent))
        closeTimerRef.current = window.setTimeout(() => {
          router.push(href)
        }, REDUCED_FADE_MS)
        return
      }

      busyRef.current = true
      pendingHrefRef.current = href
      setPhase('closing')
      setIrisPhase('closing')
      play(closeCueForIntent(nextIntent))

      const closeMs = CLOSE_MS[nextIntent]
      closeTimerRef.current = window.setTimeout(() => {
        closeTimerRef.current = null
        setIrisPhase('closed')
        // push at full blackout
        router.push(href)
      }, closeMs)
    },
    [pathname, play, reduced, router],
  )

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => setReduced(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  // Pathname changed → open iris
  useEffect(() => {
    if (pathname === pathnameRef.current) return

    pathnameRef.current = pathname
    clearTimers()
    pendingHrefRef.current = null

    const currentIntent = intentRef.current

    if (reduced) {
      setPhase('idle')
      setIrisPhase('idle')
      busyRef.current = false
      return
    }

    // If we weren't mid-transition (browser back/forward), still play open
    setPhase('opening')
    setIrisPhase('opening')
    play(openCueForIntent(currentIntent))

    const openMs = OPEN_MS[currentIntent]
    openTimerRef.current = window.setTimeout(() => {
      openTimerRef.current = null
      setPhase('idle')
      setIrisPhase('idle')
      busyRef.current = false
      intentRef.current = 'default'
      setIntent('default')
    }, openMs)
  }, [clearTimers, pathname, play, reduced])

  // Capture internal link clicks
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      if (busyRef.current) {
        event.preventDefault()
        event.stopPropagation()
        return
      }

      const target = event.target
      if (!(target instanceof Element)) return

      const anchor = target.closest('a[href]')
      if (!anchor || anchor.getAttribute('target') === '_blank') return

      const href = anchor.getAttribute('href')
      if (!isTransitionableHref(href)) return

      const dataIntent = anchor.getAttribute('data-transition-intent')
      const nextIntent: TransitionIntent =
        dataIntent === 'signature' || dataIntent === 'locale' || dataIntent === 'default'
          ? dataIntent
          : 'default'

      event.preventDefault()
      event.stopPropagation()
      navigate(href, { intent: nextIntent })
    }

    document.addEventListener('click', onClick, { capture: true })
    return () => document.removeEventListener('click', onClick, { capture: true })
  }, [navigate])

  useEffect(() => () => clearTimers(), [clearTimers])

  const contentPhase =
    phase === 'closing' ? 'closing' : phase === 'opening' ? 'opening' : 'idle'

  return (
    <PageTransitionContext.Provider value={{ phase, intent, navigate }}>
      <div
        className="page-transition-content"
        data-iris-phase={contentPhase === 'idle' ? undefined : contentPhase}
      >
        {children}
      </div>
      <IrisWipe phase={irisPhase} intent={intent} />
    </PageTransitionContext.Provider>
  )
}
