'use client'
import { useState } from 'react'
import Image from 'next/image'
import { ImageLightbox } from '@/components/ui/Lightbox'
import { getMediaUrl } from '@/lib/utils'

type Item = { image: { url?: string; alt?: string; width?: number; height?: number } }

export function ProjectGallery({ images }: { images: Item[] }) {
  const [open, setOpen] = useState(false)
  const [idx, setIdx] = useState(0)

  const slides = images
    .map((i) => getMediaUrl(i.image))
    .filter((u): u is string => !!u)
    .map((url, i) => ({ src: url, alt: images[i]?.image?.alt, width: images[i]?.image?.width, height: images[i]?.image?.height }))

  if (slides.length === 0) return null

  return (
    <>
      <div className="columns-1 gap-sm md:columns-2 md:gap-md lg:columns-3">
        {slides.map((s, i) => (
          <button
            key={i}
            type="button"
            onClick={() => {
              setIdx(i)
              setOpen(true)
            }}
            className="mb-sm block w-full break-inside-avoid border border-white/10 transition hover:opacity-90 md:mb-md"
          >
            <Image
              src={s.src}
              alt={s.alt ?? ''}
              width={s.width ?? 1200}
              height={s.height ?? 800}
              className="h-auto w-full"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </button>
        ))}
      </div>
      <ImageLightbox open={open} onClose={() => setOpen(false)} slides={slides} index={idx} />
    </>
  )
}