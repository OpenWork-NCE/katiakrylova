/** Lexical text format flag: bold (matches Payload / Lexical). */
const FORMAT_BOLD = 1

type LexicalNode = {
  type?: string
  text?: string
  format?: number
  style?: string
  children?: LexicalNode[]
  [key: string]: unknown
}

type LexicalDoc = {
  root?: LexicalNode
  [key: string]: unknown
}

/**
 * Split plain text nodes so exact phrases become bold Lexical text
 * (rendered as <strong> by Payload RichText).
 */
function splitTextWithPhrases(node: LexicalNode, phrases: string[]): LexicalNode[] {
  const text = node.text ?? ''
  if (!text || node.type !== 'text') return [node]

  // Prefer longer phrases first to avoid partial overlaps
  const ordered = [...phrases].sort((a, b) => b.length - a.length)
  let earliest: { index: number; phrase: string } | null = null

  for (const phrase of ordered) {
    const index = text.indexOf(phrase)
    if (index === -1) continue
    if (!earliest || index < earliest.index) {
      earliest = { index, phrase }
    }
  }

  if (!earliest) return [node]

  const { index, phrase } = earliest
  const before = text.slice(0, index)
  const after = text.slice(index + phrase.length)
  const nodes: LexicalNode[] = []

  if (before) {
    nodes.push({ ...node, text: before, format: node.format ?? 0 })
  }
  nodes.push({
    ...node,
    text: phrase,
    format: (node.format ?? 0) | FORMAT_BOLD,
  })
  if (after) {
    nodes.push(...splitTextWithPhrases({ ...node, text: after, format: node.format ?? 0 }, phrases))
  }

  return nodes
}

function processChildren(children: LexicalNode[], phrases: string[]): LexicalNode[] {
  const out: LexicalNode[] = []
  for (const child of children) {
    if (child.type === 'text') {
      out.push(...splitTextWithPhrases(child, phrases))
      continue
    }
    if (Array.isArray(child.children)) {
      out.push({ ...child, children: processChildren(child.children, phrases) })
      continue
    }
    out.push(child)
  }
  return out
}

/**
 * Clone a Lexical document and mark given phrases as bold for RichText.
 * Safe no-op if data is missing or already formatted.
 */
export function emphasizePhrasesInLexical<T extends LexicalDoc | null | undefined>(
  data: T,
  phrases: readonly string[],
): T {
  if (!data?.root || phrases.length === 0) return data
  const clone = structuredClone(data) as LexicalDoc
  if (!clone.root) return data
  if (Array.isArray(clone.root.children)) {
    clone.root = {
      ...clone.root,
      children: processChildren(clone.root.children, [...phrases]),
    }
  }
  return clone as T
}

/** Named creations highlighted in the About bio. */
export const ABOUT_BIO_EMPHASIS = ['LE TAROT DÉCRYPTÉ', "L'EGO du MOI"] as const
