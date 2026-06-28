/** Direct scroll binding — no extra camera lag */
export const FOCUS_PLANE_OFFSET = 2.8

/** Schmitt-trigger band — prevents index flip-flop at segment boundaries */
export const ACTIVE_SCROLL_FORWARD = 0.58
export const ACTIVE_SCROLL_BACK = 0.42

/** Subtle forward nudge — stays gallery-like, not in-your-face */
export const PRESENT_CENTER_Z = 0.08
/** How much of the way toward corridor center (0 = wall, 1 = full center) */
export const PRESENT_X_PULL = 0.26
export const PRESENT_X_PULL_MOBILE = 0.62
/** Half rotation toward camera when presented */
export const PRESENT_ROT_PULL = 0.5
export const PRESENT_ROT_PULL_MOBILE = 0.72

/** MathUtils.damp lambda — lower = slower; gentle arrive */
export const PRESENT_DAMP_IN = 4.2
/** Return to wall — slow glide back to original hang position */
export const PRESENT_DAMP_OUT = 2.8
export const FRAME_DAMP_ACTIVE = 5
export const FRAME_DAMP_IDLE = 2.6
export const HINT_DISMISS_OFFSET = 0.03

/** Fluid deceleration — premium glide, stable at segment boundaries */
export const SCROLL_DAMPING = 0.3
export const SCROLL_PAGES_PER_PROJECT = 0.68

/** Corridor vertical layout */
export const FLOOR_Y = -1.02
export const CEILING_Y = 2.4

/** Wall hang height — raised for better framing in viewport */
export const FRAME_CENTER_Y = 0.14

/** Camera eye height — aligned with raised hang line */
export const CAMERA_EYE_Y = 0.28

/** Fixed camera attitude — horizon locked, zero roll */
export const CAMERA_PITCH = 0.036

/** Gallery palette — warm dark luxury */
export const FRAME_COLOR = '#141010'
export const FRAME_EDGE = '#4a3228'
export const FRAME_LIP = '#6b4a38'
export const MATTE_COLOR = '#0c0b0b'
export const WALL_COLOR = '#0e0d0d'
export const WALL_NICHE = '#0a0a0a'
/** Flush with wall plane when idle */
export const WALL_EMBED_DEPTH = 0
/** Image sits on wall surface */
export const WALL_RECESS_Z = 0.004
export const FLOOR_COLOR = '#070707'
export const RUNNER_COLOR = '#0f0c0c'
export const ACCENT_LIGHT = '#a84848'
export const AMBIENT_WARM = '#8b5a4a'
export const FOG_COLOR = '#080808'
export const GUIDE_LINE = '#6b3030'
export const GUIDE_LINE_DIM = '#2a1515'