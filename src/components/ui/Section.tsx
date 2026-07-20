import { Container } from './Container'

export function Section({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={`py-xl md:py-2xl ${className}`}>
      <Container>{children}</Container>
    </section>
  )
}