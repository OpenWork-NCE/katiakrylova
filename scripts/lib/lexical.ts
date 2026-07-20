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

function textNode(text: string): LexicalTextNode {
  return {
    mode: 'normal',
    text,
    type: 'text',
    version: 1,
    detail: 0,
    style: '',
  }
}

/** Parse markdown-style links: [label](url) */
function parseInline(paragraph: string): LexicalInline[] {
  const flat = paragraph.replace(/\n/g, ' ')
  const re = /\[([^\]]+)\]\(([^)]+)\)/g
  const children: LexicalInline[] = []
  let last = 0
  let match: RegExpExecArray | null
  let linkIndex = 0

  while ((match = re.exec(flat)) !== null) {
    if (match.index > last) {
      children.push(textNode(flat.slice(last, match.index)))
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
      children: [textNode(match[1])],
    })
    last = match.index + match[0].length
  }

  if (last < flat.length) {
    children.push(textNode(flat.slice(last)))
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