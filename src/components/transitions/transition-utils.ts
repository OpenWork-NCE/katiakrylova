export function normalizePath(path: string): string {
  try {
    const url = new URL(path, window.location.origin)
    const normalized = url.pathname.replace(/\/$/, '') || '/'
    return normalized + url.search + url.hash
  } catch {
    return path
  }
}

/** Fullscreen 3D routes — skip transition overlay and content transforms */
export function isImmersiveRoute(pathname: string): boolean {
  return /\/projects$/.test(pathname.replace(/\/$/, ''))
}

export function isTransitionableHref(href: string | null): href is string {
  if (!href) return false
  if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return false
  if (href.startsWith('/api') || href.startsWith('/admin')) return false

  try {
    const url = new URL(href, window.location.origin)
    return url.origin === window.location.origin
  } catch {
    return false
  }
}