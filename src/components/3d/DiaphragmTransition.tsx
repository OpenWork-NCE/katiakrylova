'use client'
import { PageTransitionProvider } from '@/components/transitions/PageTransitionProvider'

/** @deprecated Use PageTransitionProvider directly */
export function DiaphragmTransition({ children }: { children: React.ReactNode }) {
  return <PageTransitionProvider>{children}</PageTransitionProvider>
}