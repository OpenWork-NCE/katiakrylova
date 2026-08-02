type LexicalTextNode = {
  mode: 'normal'
  text: string
  type: 'text'
  version: 1
  detail: 0
  style: string
  format?: number
}

type LexicalLinkNode = {
  type: 'link'
  version: 3
  id: string
  fields: {
    linkType: 'custom'
    newTab: boolean
    url: string
  }
  format: ''
  indent: 0
  direction: 'ltr'
  children: LexicalTextNode[]
}

type LexicalInline = LexicalTextNode | LexicalLinkNode

/** Lexical text format flag: bold */
const FORMAT_BOLD = 1

function textNode(text: string, format = 0): LexicalTextNode {
  return {
    mode: 'normal',
    text,
    type: 'text',
    version: 1,
    detail: 0,
    style: '',
    ...(format ? { format } : {}),
  }
}

/** Parse markdown-style bold: **text** */
function parseBoldSegments(text: string): LexicalTextNode[] {
  if (!text) return []
  const re = /\*\*(.+?)\*\*/g
  const nodes: LexicalTextNode[] = []
  let last = 0
  let match: RegExpExecArray | null

  while ((match = re.exec(text)) !== null) {
    if (match.index > last) {
      nodes.push(textNode(text.slice(last, match.index)))
    }
    nodes.push(textNode(match[1], FORMAT_BOLD))
    last = match.index + match[0].length
  }

  if (last < text.length) {
    nodes.push(textNode(text.slice(last)))
  }

  return nodes.length > 0 ? nodes : [textNode(text)]
}

/** Parse markdown-style links [label](url) and bold **text**. */
function parseInline(paragraph: string): LexicalInline[] {
  const flat = paragraph.replace(/\n/g, ' ')
  const re = /\[([^\]]+)\]\(([^)]+)\)/g
  const children: LexicalInline[] = []
  let last = 0
  let match: RegExpExecArray | null
  let linkIndex = 0

  while ((match = re.exec(flat)) !== null) {
    if (match.index > last) {
      children.push(...parseBoldSegments(flat.slice(last, match.index)))
    }
    children.push({
      type: 'link',
      version: 3,
      id: `link-${linkIndex++}`,
      fields: {
        linkType: 'custom',
        newTab: false,
        url: match[2],
      },
      format: '',
      indent: 0,
      direction: 'ltr',
      children: parseBoldSegments(match[1]),
    })
    last = match.index + match[0].length
  }

  if (last < flat.length) {
    children.push(...parseBoldSegments(flat.slice(last)))
  }

  return children.length > 0 ? children : [textNode(flat)]
}

export function textToLexical(text: string) {
  const paragraphs = text.split(/\n\n+/).filter(Boolean)
  return {
    root: {
      type: 'root',
      format: '' as const,
      indent: 0,
      version: 1,
      direction: 'ltr' as const,
      children: paragraphs.map((paragraph) => ({
        type: 'paragraph',
        version: 1,
        direction: 'ltr' as const,
        format: '' as const,
        indent: 0,
        textFormat: 0,
        children: parseInline(paragraph),
      })),
    },
  }
}