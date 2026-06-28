'use client'
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { PageTransitionContext } from './PageTransitionContext'
import { FADE_MS } from './constants'
import { isImmersiveRoute, isTransitionableHref, normalizePath } from './transition-utils'
import '@/styles/page-transition.css'

type Props = {
  children: ReactNode
}

export function PageTransitionProvider({ children }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const [fading, setFading] = useState(false)
  const [reduced, setReduced] = useState(false)

  const pathnameRef = useRef(pathname)
  const initiatedRef = useRef(false)
  const busyRef = useRef(false)
  const timerRef = useRef<number | null>(null)

  const immersive = isImmersiveRoute(pathname)
  const animate = !immersive && !reduced

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const navigate = useCallback(
    (href: string) => {
      if (!isTransitionableHref(href)) {
        router.push(href)
        return
      }

      const target = normalizePath(href)
      const current = normalizePath(pathname)

      if (target === current || busyRef.current) return

      const targetPath = target.split('?')[0].split('#')[0]

      if (reduced || isImmersiveRoute(targetPath)) {
        router.push(href)
        return
      }

      busyRef.current = true
      initiatedRef.current = true
      clearTimer()
      setFading(true)

      timerRef.current = window.setTimeout(() => {
        timerRef.current = null
        router.push(href)
      }, FADE_MS)
    },
    [clearTimer, pathname, reduced, router],
  )

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => setReduced(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  useEffect(() => {
    if (pathname === pathnameRef.current) return

    pathnameRef.current = pathname
    clearTimer()
    busyRef.current = false
    initiatedRef.current = false
    setFading(false)
  }, [clearTimer, pathname])

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

  useEffect(() => () => clearTimer(), [clearTimer])

  return (
    <PageTransitionContext.Provider value={{ phase: fading ? 'closing' : 'open', navigate }}>
      <div className={`page-transition-content${animate && fading ? ' page-transition-content--fade-out' : ''}`}>
        {children}
      </div>
    </PageTransitionContext.Provider>
  )
}