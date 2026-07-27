/** Default blade count (keep in sync with constants.IRIS_BLADE_COUNT). */
const DEFAULT_BLADES = 8

/**
 * Build SVG path data for one diaphragm blade.
 * viewBox is 0 0 100 100, center at 50,50.
 * Each blade is a triangle from center covering 360/n degrees, oversized to cover corners.
 */
export function irisBladePath(index: number, count: number = DEFAULT_BLADES): string {
  const cx = 50
  const cy = 50
  // Radius large enough to cover viewport corners when rotated (diagonal ~70.7 in unit square * margin)
  const r = 78
  const slice = (Math.PI * 2) / count
  // Overlap slightly so no gaps between blades
  const overlap = slice * 0.08
  const a0 = index * slice - Math.PI / 2 - overlap
  const a1 = (index + 1) * slice - Math.PI / 2 + overlap

  const x0 = cx + r * Math.cos(a0)
  const y0 = cy + r * Math.sin(a0)
  const x1 = cx + r * Math.cos(a1)
  const y1 = cy + r * Math.sin(a1)

  return `M ${cx} ${cy} L ${x0.toFixed(3)} ${y0.toFixed(3)} L ${x1.toFixed(3)} ${y1.toFixed(3)} Z`
}

export function irisBladePaths(count: number = DEFAULT_BLADES): string[] {
  return Array.from({ length: count }, (_, i) => irisBladePath(i, count))
}

/** Rotation (degrees) for closed state — blades fan shut toward center */
export function irisBladeClosedRotation(index: number, count: number = DEFAULT_BLADES): number {
  // Each blade rotates toward the next to collapse the aperture
  const slice = 360 / count
  return slice * 0.42
}
