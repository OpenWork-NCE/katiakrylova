'use client'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

type Cat = { id: string; name: string; slug: string }

export function CategoryFilter({ categories }: { categories: Cat[] }) {
  const router = useRouter()
  const params = useSearchParams()
  const [active, setActive] = useState(params.get('cat') || 'all')

  const select = (slug: string) => {
    setActive(slug)
    const q = slug === 'all' ? '' : `?cat=${slug}`
    router.push(q)
  }

  return (
    <div className="flex flex-wrap gap-md text-sm">
      <button onClick={() => select('all')} className={active === 'all' ? 'text-accent' : 'text-text-muted hover:text-text-primary'}>
        Tous
      </button>
      {categories.map((c) => (
        <button key={c.id} onClick={() => select(c.slug)} className={active === c.slug ? 'text-accent' : 'text-text-muted hover:text-text-primary'}>
          {c.name}
        </button>
      ))}
    </div>
  )
}
