type Credit = { role: string; name: string }

export function ProjectCredits({ credits }: { credits?: Credit[] }) {
  if (!credits || credits.length === 0) return null
  return (
    <dl className="grid grid-cols-[auto_1fr] gap-x-md gap-y-sm text-sm">
      {credits.map((c, i) => (
        <div key={i} className="contents">
          <dt className="text-text-muted uppercase tracking-widest text-xs">{c.role}</dt>
          <dd>{c.name}</dd>
        </div>
      ))}
    </dl>
  )
}