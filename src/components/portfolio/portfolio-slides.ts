import type { Portfolio, PortfolioCategory, Media } from '@/payload-types'
import { getMediaDimensions, getMediaUrl, isAnimatedMedia } from '@/lib/utils'

export type PortfolioSlide = {
  key: string
  /** Full original — used only by the portfolio liseuse (must never be recompressed). */
  src: string
  /** Smaller derivative for grid / strip when available. */
  thumbSrc: string
  alt: string
  width?: number
  height?: number
  thumbWidth?: number
  thumbHeight?: number
  /** True for GIF / animated media — must bypass Next image optimizer. */
  unoptimized: boolean
  workId: number
  workSlug: string
  title: string
  categoryName: string
  categorySlug: string
  workIndex: number
  imageIndex: number
  imageCount: number
}

function mediaEntry(media: number | Media | null | undefined) {
  if (!media || typeof media === 'number') return null
  // Liseuse always uses master bytes
  const src = getMediaUrl(media, 'original')
  if (!src) return null
  const thumbSrc = getMediaUrl(media, 'card') ?? src
  const originalDims = getMediaDimensions(media, 'original')
  const cardDims = getMediaDimensions(media, 'card')
  return {
    src,
    thumbSrc,
    alt: media.alt ?? '',
    width: originalDims.width,
    height: originalDims.height,
    thumbWidth: cardDims.width ?? originalDims.width,
    thumbHeight: cardDims.height ?? originalDims.height,
    unoptimized: isAnimatedMedia(media, src),
    id: media.id,
  }
}

function categoryMeta(category: number | PortfolioCategory) {
  if (typeof category === 'object') {
    return { name: category.name, slug: category.slug }
  }
  return { name: '', slug: '' }
}

/** Flatten cover + gallery images per work into a navigable slide list. */
export function buildPortfolioSlides(items: Portfolio[]): PortfolioSlide[] {
  const slides: PortfolioSlide[] = []

  items.forEach((item, workIndex) => {
    const entries: NonNullable<ReturnType<typeof mediaEntry>>[] = []
    const seen = new Set<number | string>()
    const cat = categoryMeta(item.category)

    const cover = mediaEntry(item.coverImage)
    if (cover) {
      entries.push(cover)
      seen.add(cover.id)
    }

    for (const row of item.images ?? []) {
      const img = mediaEntry(row.image)
      if (img && !seen.has(img.id)) {
        entries.push(img)
        seen.add(img.id)
      }
    }

    entries.forEach((entry, imageIndex) => {
      slides.push({
        key: `${item.id}-${imageIndex}`,
        src: entry.src,
        thumbSrc: entry.thumbSrc,
        alt: entry.alt || item.title,
        width: entry.width,
        height: entry.height,
        thumbWidth: entry.thumbWidth,
        thumbHeight: entry.thumbHeight,
        unoptimized: entry.unoptimized,
        workId: item.id,
        workSlug: item.slug,
        title: item.title,
        categoryName: cat.name,
        categorySlug: cat.slug,
        workIndex,
        imageIndex,
        imageCount: entries.length,
      })
    })
  })

  return slides
}

export type WorkThumb = {
  workIndex: number
  slideIndex: number
  cover: string
  title: string
  categoryName: string
  unoptimized: boolean
}

/** First slide index for each portfolio work (for thumbnail strip). */
export function workThumbIndices(slides: PortfolioSlide[]): WorkThumb[] {
  const map = new Map<number, WorkThumb>()
  slides.forEach((slide, slideIndex) => {
    if (!map.has(slide.workIndex)) {
      map.set(slide.workIndex, {
        workIndex: slide.workIndex,
        slideIndex,
        // Strip uses card derivative when available
        cover: slide.thumbSrc,
        title: slide.title,
        categoryName: slide.categoryName,
        unoptimized: slide.unoptimized,
      })
    }
  })
  return [...map.values()].sort((a, b) => a.workIndex - b.workIndex)
}

/** Preload original master (liseuse navigation). */
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new window.Image()
    img.onload = () => resolve()
    img.onerror = () => resolve()
    img.src = src
  })
}
