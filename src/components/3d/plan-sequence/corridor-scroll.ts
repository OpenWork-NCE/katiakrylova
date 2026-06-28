export type CorridorScrollHandle = {
  goToStart: () => void
  goToEnd: () => void
}

export function bindCorridorScroll(el: HTMLDivElement): CorridorScrollHandle {
  const scrollTo = (top: number) => {
    el.scrollTo({ top, behavior: 'smooth' })
  }

  return {
    goToStart: () => scrollTo(0),
    goToEnd: () => scrollTo(Math.max(0, el.scrollHeight - el.clientHeight)),
  }
}