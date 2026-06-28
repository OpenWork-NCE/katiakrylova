import type { Portfolio, PortfolioCategory, Media } from '@/payload-types'
import { getMediaUrl } from '@/lib/utils'

export type PortfolioSlide = {
  key: string
  src: string
  alt: string
  width?: number
  height?: number
  workId: number
  workSlug: string
  title: string
  year: number
  categoryName: string
  categorySlug: string
  workIndex: number
  imageIndex: number
  imageCount: number
}

function mediaEntry(media: number | Media | null | undefined) {
  if (!media || typeof media === 'number') return null
  const src = getMediaUrl(media)
  if (!src) return null
  return {
    src,
    alt: media.alt ?? '',
    width: media.width ?? undefined,
    height: media.height ?? undefined,
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
        alt: entry.alt || item.title,
        width: entry.width,
        height: entry.height,
        workId: item.id,
        workSlug: item.slug,
        title: item.title,
        year: item.year,
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
}

/** First slide index for each portfolio work (for thumbnail strip). */
export function workThumbIndices(slides: PortfolioSlide[]): WorkThumb[] {
  const map = new Map<number, WorkThumb>()
  slides.forEach((slide, slideIndex) => {
    if (!map.has(slide.workIndex)) {
      map.set(slide.workIndex, {
        workIndex: slide.workIndex,
        slideIndex,
        cover: slide.src,
        title: slide.title,
        categoryName: slide.categoryName,
      })
    }
  })
  return [...map.values()].sort((a, b) => a.workIndex - b.workIndex)
}

export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new window.Image()
    img.onload = () => resolve()
    img.onerror = () => resolve()
    img.src = src
  })
}