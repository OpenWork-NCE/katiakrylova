'use client'
import { createContext } from 'react'
import type { TransitionIntent } from './constants'

export type TransitionPhase = 'idle' | 'closing' | 'opening'

export type NavigateOptions = {
  intent?: TransitionIntent
}

export type PageTransitionContextValue = {
  phase: TransitionPhase
  intent: TransitionIntent
  navigate: (href: string, options?: NavigateOptions) => void
}

export const PageTransitionContext = createContext<PageTransitionContextValue | null>(null)
