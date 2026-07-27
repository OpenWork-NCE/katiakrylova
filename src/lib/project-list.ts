import type { Project } from '@/payload-types'
import { formatProjectFormats, getMediaDimensions, getMediaUrl } from '@/lib/utils'

/** Slim client-safe project card for the filmography list. */
export type ProjectListItem = {
  id: number
  slug: string
  title: string
  year: number
  format: string[]
  description?: string | null
  order: number
  coverUrl: string | null
  coverWidth?: number
  coverHeight?: number
}

export function toProjectListItem(project: Project): ProjectListItem {
  const cover = project.coverImage
  const coverUrl = getMediaUrl(cover, 'card')
  const dims = getMediaDimensions(cover, 'card')
  const formats = Array.isArray(project.format)
    ? project.format
    : project.format
      ? [String(project.format)]
      : []

  return {
    id: project.id,
    slug: project.slug,
    title: project.title,
    year: project.year,
    format: formats,
    description: project.description ?? null,
    order: project.order,
    coverUrl,
    coverWidth: dims.width,
    coverHeight: dims.height,
  }
}

export function projectListSearchHaystack(p: ProjectListItem): string {
  return [p.title, p.slug, p.description ?? '', formatProjectFormats(p.format), String(p.year)]
    .join(' ')
    .toLowerCase()
}
