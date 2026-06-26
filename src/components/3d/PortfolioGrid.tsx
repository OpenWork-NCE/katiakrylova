'use client'
import { useMemo } from 'react'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import type { Portfolio, PortfolioCategory } from '@/payload-types'

export function PortfolioGrid({ items, categories, locale }: { items: Portfolio[]; categories: PortfolioCategory[]; locale: string }) {
  const router = useRouter()
  const params = useSearchParams()
  const filter = params.get('cat')

  const filtered = useMemo(() => {
    if (!filter) return items
    return items.filter((p) => {
      const cat = typeof p.category === 'object' ? (p.category as any).slug : p.category
      return cat === filter
    })
  }, [items, filter])

  return (
    <div className="columns-1 md:columns-2 lg:columns-3 gap-md">
      {filtered.map((p) => {
        const cover = typeof p.coverImage === 'object' ? (p.coverImage as any).url : null
        return (
          <button
            key={p.id}
            onClick={() => router.push(`/${locale}/portfolio/${p.slug}`)}
            className="mb-md block w-full break-inside-avoid hover:opacity-90 transition"
          >
            {cover && <Image src={cover} alt={p.title} width={1200} height={800} className="w-full h-auto" />}
            <h3 className="font-hand text-xl mt-sm">{p.title}</h3>
            <p className="text-xs text-text-muted uppercase tracking-widest">{p.year}</p>
          </button>
        )
      })}
    </div>
  )
}
