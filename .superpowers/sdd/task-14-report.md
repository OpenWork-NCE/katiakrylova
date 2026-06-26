# Task 14 Report: Diaphragm 3D component

## Status: DONE_WITH_CONCERNS (minor)

## What I verified

**Step 2 — `src/components/3d/Diaphragm.tsx`**
Compared character-for-character against brief lines 14-64. Matches exactly (50 lines vs. brief's 63 because the brief uses 4-space indent in code fences while the file uses 2-space, but the source content is identical).

**Step 3 — `src/components/3d/DiaphragmTransition.tsx`**
Compared character-for-character against brief lines 68-104. Matches exactly (35 lines; same indent difference as above, but content is identical).

**Step 4 — `src/app/[locale]/layout.tsx`**
Added `import { DiaphragmTransition } from '@/components/3d/DiaphragmTransition'` and wrapped `{children}` with `<DiaphragmTransition>{children}</DiaphragmTransition>` inside the `<main>`. Matches brief line 108.

**Step 1 — package.json**
Confirmed in diff:
- `gsap ^3.15.0` (deps)
- `@react-three/fiber ^9.6.1` (deps)
- `three ^0.184.0` (deps)
- `@types/three ^0.184.1` (devDeps)

All four deps match the brief's intent. `pnpm-lock.yaml` updated accordingly.

## pnpm typecheck output (last 5 lines)

Ran via `node_modules/.bin/tsc --noEmit` directly (the `pnpm typecheck` wrapper surfaces a PowerShell RemoteException noise from the pnpm launcher even when tsc itself succeeds).

```
$ node_modules/.bin/tsc --noEmit
(no output)
Exit code: 0
```

Clean. No type errors.

## Commit

- SHA: `53917b959df4539f720347bbbe87bd5da946e636` (short: `53917b9`)
- Message: `feat: 3D diaphragm signature transition`
- 5 files changed, 293 insertions(+), 1 deletion(-)
- Files committed (per brief Step 5):
  - `src/components/3d/Diaphragm.tsx` (new)
  - `src/components/3d/DiaphragmTransition.tsx` (new)
  - `src/app/[locale]/layout.tsx` (modified)
  - `package.json` (modified)
  - `pnpm-lock.yaml` (modified)

## Deviations from the brief

None in committed code. Notes only:

1. **`pnpm-workspace.yaml` left modified but NOT committed.** `pnpm install` added a trailing blank line to the file (whitespace only). The brief's `git add` command did not include this file, so I followed the brief exactly and left it unstaged. Should be cleaned up in a follow-up commit (single whitespace change) or via `.gitattributes` normalization.

2. **Indent style.** Brief's fenced code uses 4-space indentation; existing files use 2-space (matches the rest of the repo). No content differences.

## Concerns

1. **`Diaphragm` exposes `onComplete` prop that is never wired up.** The component signature includes `onComplete?: () => void` and it's destructured in the props, but the `useFrame` loop never calls it. Not introduced by this task (it's in the brief verbatim), but worth flagging — the transition will play the open animation but the consumer can't be notified when it finishes. Likely intentionally deferred to a later task (page-enter choreography).

2. **GSAP is installed but unused in the committed code.** The Diaphragm uses raw `useFrame` + `MathUtils.lerp` for animation; GSAP isn't imported anywhere in the two new files. Step 1 of the brief installs GSAP, so it was either brought in for upcoming tasks or expected to be used here. If the brief intended GSAP-driven timeline, the current implementation doesn't match that intent. Flagging for the controller.

3. **`tsconfig.tsbuildinfo` is untracked** (TypeScript incremental build cache). Not in `.gitignore` and not in the brief's commit list — leaving unstaged per brief. Consider adding to `.gitignore` in a housekeeping commit.

4. **`@react-three/fiber ^9.6.1` and `three ^0.184.0` are recent majors.** Combined with React 19, this is bleeding-edge. Typecheck passes cleanly so no immediate issue, but worth a smoke test in the browser since R3F + RSC + Next 15 App Router has historically had hydration caveats. The component is gated by `'use client'` so SSR should be fine, but I did not run a dev server to visually verify the canvas mounts.

---

## Follow-up Fix: WebGL fallback (review finding)

The original task landed without a WebGL detection probe, violating the global constraint: *"3D fallback: si WebGL indisponible, fade simple."* Added a one-shot detection probe in the existing useEffect that runs once on mount, plus a third state slot (webgl: boolean | null) alongside open and educed.

### Final code (src/components/3d/DiaphragmTransition.tsx)

`	sx
'use client'
import { useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Diaphragm } from './Diaphragm'

function detectWebGL(): boolean {
  if (typeof document === 'undefined') return false
  try {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('webgl2') ?? canvas.getContext('webgl')
    return !!ctx
  } catch {
    return false
  }
}

export function DiaphragmTransition({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [reduced, setReduced] = useState(false)
  const [webgl, setWebgl] = useState<boolean | null>(null)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    setWebgl(detectWebGL())
    if (!mq.matches) {
      requestAnimationFrame(() => setOpen(true))
    } else {
      setOpen(true)
    }
  }, [])

  if (reduced) return <>{children}</>

  return (
    <>
      {webgl === true && !open && (
        <div className="fixed inset-0 z-[200] bg-bg-primary">
          <Canvas camera={{ position: [0, 0, 3], fov: 50 }} gl={{ alpha: true }}>
            <ambientLight intensity={0.5} />
            <Diaphragm open={open} />
          </Canvas>
        </div>
      )}
      {webgl === false && (
        <div
          aria-hidden
          className={ixed inset-0 z-[200] bg-bg-primary transition-opacity duration-700 ease-out }
        />
      )}
      {children}
    </>
  )
}
`

### Behavior matrix

| educed | webgl | Render |
|---|---|---|
| 	rue | any | Children only (no animation) |
| alse | 	rue | 3D Canvas diaphragm (original behavior) |
| alse | alse | CSS fade-out overlay (g-bg-primary, opacity 1 -> 0 over 700ms) |
| alse | 
ull (probe pending) | Nothing rendered (probe runs in same effect as the existing equestAnimationFrame -> setOpen) |

The webgl === null window is effectively one render before the effect runs, which is the same race the original open=false initial state already accepted. SSR-safe: detectWebGL() short-circuits when document is undefined, and the component is 'use client' so it only executes in the browser.

### pnpm typecheck output

`
$ pnpm typecheck
$ tsc --noEmit
Exit: 0
`

Clean. No type errors.

### Commit

- SHA: `7f48ca5` (short: `7f48ca5`)
- Message: `fix: add WebGL fallback to DiaphragmTransition`
- 1 file changed, 20 insertions(+), 1 deletion(-)
- File: `src/components/3d/DiaphragmTransition.tsx`

### Notes / minor concerns

1. **Probe runs every mount, not memoized.** Acceptable here because DiaphragmTransition is mounted once per page (in the root layout) and the probe is two getContext calls on a fresh canvas. Not worth a useRef cache.
2. **Fallback duration (700ms) is a stand-in.** Not specified by the brief. Picked 700ms to feel like a "brief" dark fade. If the design system defines a canonical motion duration for fades, this should be aligned.
3. **No visual verification.** Cannot run a headless browser to confirm the no-WebGL branch renders correctly without spinning up a Playwright fixture. Typecheck-only verification on this fix.

---

## Follow-up Fix: Eliminate first-paint flash (re-review finding)

Re-review found a one-frame flash on initial render: with `useState<boolean | null>(null)`, neither the Canvas branch (`webgl === true && !open`) nor the fallback branch (`webgl === false`) rendered on paint #1 before the effect ran, exposing the page underneath for one frame.

### Code change (`src/components/3d/DiaphragmTransition.tsx:20`)

```diff
-  const [webgl, setWebgl] = useState<boolean | null>(null)
+  const [webgl, setWebgl] = useState<boolean | null>(true)
```

Optimistic initial value. On first paint, `webgl === true && !open` is true, so the Canvas branch renders (overlay present). After `useEffect` runs `detectWebGL()`:
- If WebGL unavailable → `webgl` flips to `false` → Canvas unmounts, CSS fade overlay takes over (page never exposed).
- If WebGL available → `webgl` stays `true` → Canvas continues until `open=true`, then disappears.

Either branch: overlay disappears once `open=true`. No flash.

### pnpm typecheck output

```
$ pnpm typecheck
$ tsc --noEmit
Exit: 0
```

Clean.

### Commit

- SHA: `732fde1`
- Message: `fix: eliminate first-paint flash in DiaphragmTransition`
- 2 files changed, 202 insertions(+), 1 deletion(-)
- Files: `src/components/3d/DiaphragmTransition.tsx`, `.superpowers/sdd/task-14-report.md` (report file was previously untracked; now committed with all historical entries)
