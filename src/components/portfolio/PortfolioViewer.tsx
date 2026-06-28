'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import type { PortfolioSlide } from './portfolio-slides'
import { preloadImage, workThumbIndices } from './portfolio-slides'

type Props = {
  open: boolean
  slides: PortfolioSlide[]
  index: number
  onClose: () => void
  onIndexChange: (index: number) => void
}

const FADE_MS = 280
const MIN_ZOOM = 1
const MAX_ZOOM = 4
const ZOOM_STEP = 0.35

export function PortfolioViewer({ open, slides, index, onClose, onIndexChange }: Props) {
  const [visible, setVisible] = useState(false)
  const [activeIndex, setActiveIndex] = useState(index)
  const [contentVisible, setContentVisible] = useState(true)
  const [loading, setLoading] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)

  const touchStart = useRef<{ x: number; y: number } | null>(null)
  const pinchStart = useRef<{ distance: number; zoom: number } | null>(null)
  const dragOrigin = useRef({ x: 0, y: 0, panX: 0, panY: 0 })
  const thumbsRef = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const navigating = useRef(false)

  const slide = slides[activeIndex]
  const thumbs = workThumbIndices(slides)
  const total = slides.length

  const resetZoom = useCallback(() => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }, [])

  const clampZoom = (z: number) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z))

  const zoomIn = useCallback(() => {
    setZoom((z) => clampZoom(z + ZOOM_STEP))
  }, [])

  const zoomOut = useCallback(() => {
    setZoom((z) => {
      const next = clampZoom(z - ZOOM_STEP)
      if (next <= 1) setPan({ x: 0, y: 0 })
      return next
    })
  }, [])

  const prefetchNeighbors = useCallback(
    (center: number) => {
      ;[center - 1, center + 1, center + 2].forEach((i) => {
        const src = slides[i]?.src
        if (src) preloadImage(src)
      })
    },
    [slides],
  )

  const go = useCallback(
    async (next: number) => {
      if (slides.length === 0 || navigating.current) return
      const clamped = ((next % slides.length) + slides.length) % slides.length
      if (clamped === activeIndex) return

      navigating.current = true
      resetZoom()
      setLoading(true)
      setContentVisible(false)

      await new Promise((r) => window.setTimeout(r, FADE_MS))
      await preloadImage(slides[clamped].src)

      setActiveIndex(clamped)
      onIndexChange(clamped)
      prefetchNeighbors(clamped)

      setContentVisible(true)
      setLoading(false)
      navigating.current = false
    },
    [activeIndex, onIndexChange, prefetchNeighbors, resetZoom, slides],
  )

  const goPrev = useCallback(() => go(activeIndex - 1), [activeIndex, go])
  const goNext = useCallback(() => go(activeIndex + 1), [activeIndex, go])

  useEffect(() => {
    if (!open) {
      setVisible(false)
      document.body.style.overflow = ''
      return
    }
    setActiveIndex(index)
    setVisible(true)
    setContentVisible(true)
    setLoading(false)
    resetZoom()
    document.body.style.overflow = 'hidden'
    prefetchNeighbors(index)
    if (slides[index]?.src) preloadImage(slides[index].src)
    return () => {
      document.body.style.overflow = ''
    }
  }, [open, index, prefetchNeighbors, resetZoom, slides])

  useEffect(() => {
    const el = viewportRef.current
    if (!open || !el) return
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      if (e.deltaY < 0) zoomIn()
      else zoomOut()
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [open, zoomIn, zoomOut])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (zoom > 1) resetZoom()
        else onClose()
      }
      if (zoom <= 1 && e.key === 'ArrowLeft') goPrev()
      if (zoom <= 1 && e.key === 'ArrowRight') goNext()
      if (e.key === '+' || e.key === '=') zoomIn()
      if (e.key === '-') zoomOut()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose, goPrev, goNext, zoom, zoomIn, zoomOut, resetZoom])

  useEffect(() => {
    if (!open || !thumbsRef.current || !slide) return
    const active = thumbsRef.current.querySelector('[data-active="true"]')
    active?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }, [open, activeIndex, slide, thumbs])

  const handlePointerDown = (e: React.PointerEvent) => {
    if (zoom <= 1) return
    setDragging(true)
    dragOrigin.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y }
    ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragging || zoom <= 1) return
    setPan({
      x: dragOrigin.current.panX + (e.clientX - dragOrigin.current.x),
      y: dragOrigin.current.panY + (e.clientY - dragOrigin.current.y),
    })
  }

  const handlePointerUp = () => setDragging(false)

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const [a, b] = [e.touches[0], e.touches[1]]
      const distance = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY)
      pinchStart.current = { distance, zoom }
      touchStart.current = null
      return
    }
    if (zoom <= 1 && e.touches.length === 1) {
      touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && pinchStart.current) {
      const [a, b] = [e.touches[0], e.touches[1]]
      const distance = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY)
      const ratio = distance / pinchStart.current.distance
      setZoom(clampZoom(pinchStart.current.zoom * ratio))
    }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    pinchStart.current = null
    if (zoom > 1 || !touchStart.current) return
    const touch = e.changedTouches[0]
    if (!touch) return
    const dx = touch.clientX - touchStart.current.x
    if (Math.abs(dx) > 48) dx > 0 ? goPrev() : goNext()
    touchStart.current = null
  }

  const handleDoubleClick = () => {
    if (zoom > 1) resetZoom()
    else setZoom(2)
  }

  if (!open || !slide) return null

  return (
    <div
      className={`fixed inset-0 z-[120] transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}
      role="dialog"
      aria-modal="true"
      aria-label={`Visionneuse — ${slide.title}`}
      aria-busy={loading}
    >
      <div className="absolute inset-0 bg-[#050505]" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 70% 60% at 50% 45%, transparent 0%, rgba(0,0,0,0.55) 100%)',
        }}
      />

      <div className="absolute left-md top-[calc(4rem+0.5rem)] z-20">
        <span className="inline-block border border-accent/40 bg-accent/15 px-sm py-xs text-[10px] uppercase tracking-[0.25em] text-accent backdrop-blur-sm">
          {slide.categoryName}
        </span>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="absolute right-md top-[calc(4rem+0.5rem)] z-20 flex h-10 w-10 items-center justify-center border border-white/10 bg-bg-primary/40 text-sm uppercase tracking-widest text-text-primary backdrop-blur-md transition hover:border-accent/50 hover:text-accent"
        aria-label="Fermer"
      >
        ×
      </button>

      <div className="absolute right-md top-[calc(4rem+3.5rem)] z-20 font-body text-xs tracking-widest text-text-muted">
        {String(activeIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </div>

      <div className="absolute right-md top-[calc(4rem+5.5rem)] z-20 flex flex-col gap-xs">
        <button
          type="button"
          onClick={zoomIn}
          disabled={zoom >= MAX_ZOOM}
          className="flex h-9 w-9 items-center justify-center border border-white/10 bg-bg-primary/40 text-text-primary backdrop-blur-md transition hover:border-accent/40 disabled:opacity-30"
          aria-label="Zoomer"
        >
          +
        </button>
        <button
          type="button"
          onClick={zoomOut}
          disabled={zoom <= MIN_ZOOM}
          className="flex h-9 w-9 items-center justify-center border border-white/10 bg-bg-primary/40 text-text-primary backdrop-blur-md transition hover:border-accent/40 disabled:opacity-30"
          aria-label="Dézoomer"
        >
          −
        </button>
        {zoom > 1 && (
          <button
            type="button"
            onClick={resetZoom}
            className="border border-white/10 bg-bg-primary/40 px-xs py-xs text-[9px] uppercase tracking-widest text-text-muted backdrop-blur-md transition hover:text-accent"
          >
            1:1
          </button>
        )}
      </div>

      {zoom <= 1 && (
        <>
          <button
            type="button"
            onClick={goPrev}
            className="absolute left-md top-1/2 z-20 hidden -translate-y-1/2 border border-white/10 bg-bg-primary/30 px-sm py-lg text-text-primary backdrop-blur-md transition hover:border-accent/40 hover:text-accent md:block"
            aria-label="Précédent"
          >
            ←
          </button>
          <button
            type="button"
            onClick={goNext}
            className="absolute right-md top-1/2 z-20 hidden -translate-y-1/2 border border-white/10 bg-bg-primary/30 px-sm py-lg text-text-primary backdrop-blur-md transition hover:border-accent/40 hover:text-accent md:block"
            aria-label="Suivant"
          >
            →
          </button>
        </>
      )}

      <div
        ref={viewportRef}
        className="absolute inset-x-0 top-16 bottom-[10rem] flex items-center justify-center overflow-hidden px-md md:px-xl"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {loading && (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/15 border-t-accent" />
          </div>
        )}

        <div
          className={`relative flex max-h-full max-w-full items-center justify-center transition-opacity duration-[280ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${
            contentVisible ? 'opacity-100' : 'opacity-0'
          } ${zoom > 1 ? (dragging ? 'cursor-grabbing' : 'cursor-grab') : ''}`}
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transition: dragging ? 'none' : 'transform 0.35s cubic-bezier(0.4,0,0.2,1), opacity 280ms',
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onDoubleClick={handleDoubleClick}
        >
          <Image
            key={slide.key}
            src={slide.src}
            alt={slide.alt}
            width={slide.width ?? 1600}
            height={slide.height ?? 1200}
            className="max-h-[calc(100vh-15rem)] w-auto max-w-full select-none object-contain shadow-[0_24px_80px_rgba(0,0,0,0.65)]"
            priority
            draggable={false}
          />
        </div>
      </div>

      <div
        className={`pointer-events-none absolute bottom-[6.5rem] left-md right-md z-20 transition-opacity duration-[280ms] md:left-xl md:max-w-lg ${
          contentVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <p className="font-hand text-[clamp(1.6rem,4vw,3rem)] leading-none text-text-primary">{slide.title}</p>
        <p className="mt-xs text-xs uppercase tracking-[0.2em] text-text-muted">
          {slide.categoryName} · {slide.year}
          {slide.imageCount > 1 && (
            <span className="ml-sm text-accent">
              {slide.imageIndex + 1}/{slide.imageCount}
            </span>
          )}
        </p>
      </div>

      <div
        ref={thumbsRef}
        className="absolute bottom-0 left-0 right-0 z-20 flex gap-sm overflow-x-auto border-t border-white/8 bg-bg-primary/55 px-md py-md backdrop-blur-lg md:px-xl"
      >
        {thumbs.map((thumb) => {
          const active = slide.workIndex === thumb.workIndex
          return (
            <button
              key={thumb.workIndex}
              type="button"
              data-active={active}
              onClick={() => go(thumb.slideIndex)}
              className={`relative shrink-0 overflow-hidden border transition duration-500 ${
                active ? 'border-accent opacity-100' : 'border-white/10 opacity-45 hover:opacity-80'
              }`}
              aria-label={`${thumb.title} — ${thumb.categoryName}`}
              aria-current={active}
            >
              <div className="relative h-14 w-20">
                <Image src={thumb.cover} alt="" fill className="object-cover" sizes="80px" />
              </div>
              <span className="block max-w-20 truncate px-xs py-[2px] text-[8px] uppercase tracking-wider text-text-muted">
                {thumb.categoryName}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}