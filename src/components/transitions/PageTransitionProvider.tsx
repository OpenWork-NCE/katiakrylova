'use client'
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { TransitionOverlay } from './TransitionOverlay'
import { PageTransitionContext, type TransitionPhase } from './PageTransitionContext'
import {
  TRANSITION_IN_MS,
  TRANSITION_OUT_MS,
  TRANSITION_POPSTATE_OUT_MS,
} from './constants'
import { isTransitionableHref, normalizePath } from './transition-utils'
import '@/styles/page-transition.css'

type Props = {
  children: ReactNode
}

export function PageTransitionProvider({ children }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const [phase, setPhase] = useState<TransitionPhase>('closed')
  const [reduced, setReduced] = useState(false)

  const pathnameRef = useRef(pathname)
  const initiatedRef = useRef(false)
  const busyRef = useRef(false)
  const initialOpenDoneRef = useRef(false)
  const timersRef = useRef<number[]>([])

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id))
    timersRef.current = []
  }, [])

  const schedule = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms)
    timersRef.current.push(id)
  }, [])

  const startOpening = useCallback(() => {
    setPhase('opening')
    schedule(() => setPhase('open'), TRANSITION_IN_MS)
  }, [schedule])

  const navigate = useCallback(
    (href: string) => {
      if (!isTransitionableHref(href)) {
        router.push(href)
        return
      }

      const target = normalizePath(href)
      const current = normalizePath(pathname)

      if (target === current || busyRef.current) return

      if (reduced) {
        router.push(href)
        return
      }

      busyRef.current = true
      initiatedRef.current = true
      clearTimers()

      setPhase('closing')

      schedule(() => {
        setPhase('closed')
        router.push(href)
      }, TRANSITION_OUT_MS)
    },
    [clearTimers, pathname, reduced, router, schedule],
  )

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => setReduced(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  useEffect(() => {
    if (initialOpenDoneRef.current) return

    if (reduced) {
      initialOpenDoneRef.current = true
      setPhase('open')
      return
    }

    initialOpenDoneRef.current = true
    schedule(() => startOpening(), 60)
  }, [reduced, schedule, startOpening])

  useEffect(() => {
    if (pathname === pathnameRef.current) return

    pathnameRef.current = pathname
    clearTimers()

    if (initiatedRef.current) {
      initiatedRef.current = false
      busyRef.current = false
      startOpening()
      return
    }

    if (reduced) return

    busyRef.current = true
    setPhase('closing')

    schedule(() => {
      startOpening()
      busyRef.current = false
    }, TRANSITION_POPSTATE_OUT_MS)
  }, [clearTimers, pathname, reduced, schedule, startOpening])

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

      event.preventDefault()
      event.stopPropagation()
      navigate(href)
    }

    document.addEventListener('click', onClick, { capture: true })
    return () => document.removeEventListener('click', onClick, { capture: true })
  }, [navigate])

  useEffect(() => () => clearTimers(), [clearTimers])

  return (
    <PageTransitionContext.Provider value={{ phase, navigate }}>
      <div
        className={`page-transition-content ${phase === 'closing' ? 'page-transition-content--closing' : ''} ${
          phase === 'opening' ? 'page-transition-content--opening' : ''
        }`}
      >
        {children}
      </div>
      {!reduced && <TransitionOverlay phase={phase} />}
    </PageTransitionContext.Provider>
  )
}