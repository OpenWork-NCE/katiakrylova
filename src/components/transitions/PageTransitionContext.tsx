'use client'
import { createContext } from 'react'

export type TransitionPhase = 'open' | 'closing' | 'closed' | 'opening'

export type PageTransitionContextValue = {
  phase: TransitionPhase
  navigate: (href: string) => void
}

export const PageTransitionContext = createContext<PageTransitionContextValue | null>(null)