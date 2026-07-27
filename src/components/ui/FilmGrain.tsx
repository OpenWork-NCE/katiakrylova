/**
 * Subtle film grain overlay. Uses a static SVG data tile (no JS).
 * Hidden when the user prefers reduced motion to cut GPU cost.
 */
export function FilmGrain() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[90] opacity-[0.05] mix-blend-overlay motion-reduce:hidden"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.85'/></svg>\")",
        backgroundSize: '200px 200px',
      }}
    />
  )
}
