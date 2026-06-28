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
        children: [{
          mode: 'normal' as const,
          text: paragraph.replace(/\n/g, ' '),
          type: 'text',
          version: 1,
          detail: 0,
          style: '',
        }],
      })),
    },
  }
}