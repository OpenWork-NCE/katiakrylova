# Task 15 Report: Plan-Sequence 3D corridor

## Status
DONE_WITH_CONCERNS (minor deviation: locale cast in page.tsx)

## What I implemented

### Dependencies (Step 1)
- `@react-three/fiber@^9.6.1` — already installed (Task 14)
- `@react-three/drei@10.7.7` — installed
- `three@^0.184.0` — already installed
- `@types/three@^0.184.1` (devDep) — already installed

### Files created
1. **`src/components/3d/ProjectCard3D.tsx`** — verbatim from brief. 3D project card with `Image` and `Text` from drei, hover Z-lerp animation.

2. **`src/components/3d/DollyRails.tsx`** — verbatim from brief. Two sinusoidal rail lines on either side of the corridor.

3. **`src/components/3d/DustParticles.tsx`** — verbatim from brief. 200 additive-blended dust particles with slow Y rotation.

4. **`src/components/3d/PlanSequence.tsx`** — verbatim from brief. Main client component with `Canvas`, `CameraRig`, WebGL detection fallback, scroll-driven camera dolly, mouse parallax, fog, project cards positioned in a 4×5 grid (ROW_Z × COL_X), and inline `FallbackGrid` for non-WebGL clients. Counter HUD `01 / NN` bottom-right.

5. **`src/app/[locale]/(frontend)/projects/page.tsx`** — **minor deviation from brief**: added `as 'fr' | 'en'` cast on the `locale` argument passed to `getProjects`, because `getProjects` expects the `Locale` type (`'fr' | 'en' | 'all'`) and a bare `string` fails typecheck. This matches the existing codebase convention used in `contact/page.tsx:9`, `about/page.tsx:7`, `[locale]/page.tsx:11`, and `Footer.tsx:7`.

### Files NOT created (intentional)
- **`src/components/projects/ProjectCard2DFallback.tsx`** — the brief's Step 1 file list mentions this file, but no code is provided for it and the inline `FallbackGrid` in `PlanSequence.tsx` is sufficient for the WebGL fallback path. Per the task instructions: "Treat this as optional and don't create it unless the brief's inline `FallbackGrid` is not sufficient."

## pnpm typecheck output (last 5 lines)
```
$ tsc --noEmit
ExitCode: 0
```
(Passes with exit 0. After the `as 'fr' | 'en'` cast was applied to satisfy `getProjects`'s `Locale` parameter type.)

## Commit
- SHA: `4addb70c64c97d48df89b3616184f2b8b346d02f`
- Message: `feat: 3D Plan-Sequence corridor for projects`
- Files: 7 changed, 535 insertions(+)

## Self-review against brief
- ✅ `'use client'` directives correct (all four 3D components; server page is async server component).
- ✅ Brief's `'use client'` for `DustParticles` and `DollyRails` preserved verbatim, even though they could technically be server components since they only contain JSX with no client hooks — but they import `useFrame`/`useMemo` which require it.
- ✅ All imports verbatim including the unused `Group` from three in `PlanSequence.tsx` (per brief instruction to follow verbatim).
- ✅ Tailwind tokens used where Tailwind classes apply (`bg-bg-primary`, `text-text-muted`, `font-body`, etc.). The brief's hex literals (`#8b2e2e`, `#f5f1ea`, `#0a0a0a`) are JS values passed to Three.js material color props — not Tailwind classes — so they cannot be replaced with design tokens.
- ✅ Array index fallback `?? 0` preserved on `COL_X[colIdx]` and `ROW_Z[rowIdx]` per brief.
- ✅ WebGL detection pattern matches the one established in `DiaphragmTransition.tsx` (Task 14).
- ✅ `scrollProgress = useRef({ current: 0 })` mutable ref container pattern preserved (the brief intentionally avoids re-renders during scroll).

## Issues / concerns
1. **Locale cast deviation**: Required for typecheck; documented above. Brief code would not pass `tsc --noEmit` without it.
2. **Inline hex colors**: `#8b2e2e`, `#f5f1ea`, `#0a0a0a` are inline JS values inside Three.js material props, not Tailwind classes. Not flagged as a token violation since design tokens apply only to Tailwind utility classes.
3. **No Playwright/visual verification**: I did not start the dev server or browser-test the 3D corridor — `pnpm typecheck` was the only verification per the brief's instructions.
4. **`ProjectCard2DFallback.tsx`**: Not created (intentional — inline `FallbackGrid` in `PlanSequence.tsx` is sufficient).

---

## Fix: prefers-reduced-motion support (Finding)

### Change
Added `prefers-reduced-motion` handling to `src/components/3d/PlanSequence.tsx`, mirroring the pattern established in `src/components/3d/DiaphragmTransition.tsx:22-33`.

### Code snippet
```tsx
const [supportsWebGL, setSupportsWebGL] = useState(true)
const [reduced, setReduced] = useState(false)
const scrollProgress = useRef({ current: 0 })

useEffect(() => {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
  setReduced(mq.matches)
  try {
    const c = document.createElement('canvas')
    setSupportsWebGL(!!(c.getContext('webgl') || c.getContext('experimental-webgl')))
  } catch { setSupportsWebGL(false) }
}, [])
```

```tsx
if (reduced || !supportsWebGL) return <FallbackGrid projects={projects} locale={locale} />
```

Reduced-motion takes precedence and short-circuits to `<FallbackGrid>` before the Canvas is mounted, regardless of WebGL availability.

### pnpm typecheck output
```
$ tsc --noEmit
ExitCode: 0
```

### Commit
- SHA: `ddca722`
- Message: `fix: respect prefers-reduced-motion in PlanSequence`