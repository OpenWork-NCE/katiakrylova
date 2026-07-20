'use client'
import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import type { Portfolio } from '@/payload-types'
import { getMediaUrl } from '@/lib/utils'
import { PortfolioViewer } from '@/components/portfolio/PortfolioViewer'
import { buildPortfolioSlides } from '@/components/portfolio/portfolio-slides'

export function PortfolioGrid({
  items,
  initialViewSlug,
}: {
  items: Portfolio[]
  /** Optional work slug to open the viewer immediately (legacy ?view=). */
  initialViewSlug?: string | null
}) {
  const params = useSearchParams()
  const viewSlug = initialViewSlug ?? params.get('view')

  const slides = useMemo(() => buildPortfolioSlides(items), [items])

  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)

  const openAt = (slideIndex: number) => {
    setIndex(slideIndex)
    setOpen(true)
  }

  const openWork = (workIndex: number) => {
    const slideIndex = slides.findIndex((s) => s.workIndex === workIndex)
    if (slideIndex >= 0) openAt(slideIndex)
  }

  useEffect(() => {
    if (!viewSlug || slides.length === 0) return
    const slideIndex = slides.findIndex((s) => s.workSlug === viewSlug)
    if (slideIndex >= 0) openAt(slideIndex)
  }, [viewSlug, slides])

  if (items.length === 0) {
    return null
  }

  return (
    <>
      <div className="columns-1 gap-md md:columns-2 lg:columns-3">
        {items.map((p, workIndex) => {
          const cover = getMediaUrl(p.coverImage)
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => openWork(workIndex)}
              className="group mb-md block w-full break-inside-avoid text-left transition duration-500 hover:opacity-95"
            >
              {cover && (
                <div className="relative overflow-hidden">
                  <Image
                    src={cover}
                    alt={p.title}
                    width={1200}
                    height={800}
                    className="h-auto w-full transition duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-[1.02]"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-accent/0 transition duration-500 group-hover:bg-accent/10" />
                </div>
              )}
              <h3 className="mt-sm font-hand text-xl text-text-primary">{p.title}</h3>
              <p className="text-xs uppercase tracking-widest text-text-muted">{p.year}</p>
            </button>
          )
        })}
      </div>

      <PortfolioViewer
        open={open}
        slides={slides}
        index={index}
        onClose={() => setOpen(false)}
        onIndexChange={setIndex}
      />
    </>
  )
}
