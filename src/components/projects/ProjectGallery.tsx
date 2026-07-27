'use client'
import { useState } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { getMediaDimensions, getMediaUrl, isAnimatedMedia } from '@/lib/utils'

const ImageLightbox = dynamic(
  () => import('@/components/ui/Lightbox').then((m) => m.ImageLightbox),
  { ssr: false },
)

type Item = {
  image: {
    url?: string | null
    alt?: string | null
    width?: number | null
    height?: number | null
    mimeType?: string | null
    sizes?: {
      card?: { url?: string | null; width?: number | null; height?: number | null } | null
    } | null
  }
}

export function ProjectGallery({ images }: { images: Item[] }) {
  const [open, setOpen] = useState(false)
  const [idx, setIdx] = useState(0)

  // Lightbox slides: always original master (liseuse quality constraint).
  const slides = images
    .map((i) => {
      const original = getMediaUrl(i.image, 'original')
      if (!original) return null
      const dims = getMediaDimensions(i.image, 'original')
      return {
        src: original,
        alt: i.image?.alt ?? undefined,
        width: dims.width ?? i.image?.width ?? undefined,
        height: dims.height ?? i.image?.height ?? undefined,
      }
    })
    .filter((s): s is NonNullable<typeof s> => !!s)

  if (slides.length === 0) return null

  return (
    <>
      <div className="columns-1 gap-sm md:columns-2 md:gap-md lg:columns-3">
        {images.map((item, i) => {
          const thumb = getMediaUrl(item.image, 'card')
          if (!thumb) return null
          const dims = getMediaDimensions(item.image, 'card')
          const animated = isAnimatedMedia(item.image, thumb)
          return (
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
                src={thumb}
                alt={item.image?.alt ?? ''}
                width={dims.width ?? item.image?.width ?? 800}
                height={dims.height ?? item.image?.height ?? 600}
                className="h-auto w-full"
                sizes="(max-width: 768px) 100vw, 33vw"
                quality={85}
                unoptimized={animated}
              />
            </button>
          )
        })}
      </div>
      {open ? (
        <ImageLightbox open={open} onClose={() => setOpen(false)} slides={slides} index={idx} />
      ) : null}
    </>
  )
}
