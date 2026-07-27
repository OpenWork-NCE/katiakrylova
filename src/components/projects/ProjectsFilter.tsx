'use client'

import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import type { ProjectListItem } from '@/lib/project-list'
import { projectListSearchHaystack } from '@/lib/project-list'
import '@/styles/projects-filter.css'

export type ProjectsFilterState = {
  query: string
  formats: string[]
  years: number[]
}

type Props = {
  projects: ProjectListItem[]
  value: ProjectsFilterState
  onChange: (next: ProjectsFilterState) => void
  resultCount: number
  visible?: boolean
}

/** Formats visibles sur une ligne (hors chip « Tous »). */
const FORMAT_COLLAPSED_COUNT = 5

function uniqueSortedFormats(projects: ProjectListItem[]): string[] {
  const counts = new Map<string, number>()
  for (const p of projects) {
    for (const f of p.format) {
      if (!f) continue
      counts.set(f, (counts.get(f) ?? 0) + 1)
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'fr'))
    .map(([f]) => f)
}

function uniqueSortedYears(projects: ProjectListItem[]): number[] {
  const years = new Set<number>()
  for (const p of projects) {
    if (typeof p.year === 'number') years.add(p.year)
  }
  return [...years].sort((a, b) => b - a)
}

export function filterProjects(
  projects: ProjectListItem[],
  state: ProjectsFilterState,
): ProjectListItem[] {
  const q = state.query.trim().toLowerCase()
  const formats = state.formats
  const years = state.years

  return projects.filter((p) => {
    if (formats.length > 0 && !formats.some((f) => p.format.includes(f))) {
      return false
    }
    if (years.length > 0 && !years.includes(p.year)) {
      return false
    }
    if (!q) return true
    return projectListSearchHaystack(p).includes(q)
  })
}

/** Une ligne : formats actifs d’abord, puis le reste jusqu’à la limite. */
function visibleFormats(formats: string[], selected: string[], expanded: boolean, limit: number) {
  if (expanded || formats.length <= limit) return formats
  const selectedSet = new Set(selected)
  const active = formats.filter((f) => selectedSet.has(f))
  const rest = formats.filter((f) => !selectedSet.has(f))
  const minKeep = Math.max(limit, active.length)
  return [...active, ...rest].slice(0, minKeep)
}

export function ProjectsFilter({ projects, value, onChange, resultCount, visible }: Props) {
  const t = useTranslations('projects')
  const formats = useMemo(() => uniqueSortedFormats(projects), [projects])
  const years = useMemo(() => uniqueSortedYears(projects), [projects])
  const [formatsExpanded, setFormatsExpanded] = useState(false)

  const hasActive =
    value.query.trim().length > 0 || value.formats.length > 0 || value.years.length > 0

  const formatsCanCollapse = formats.length > FORMAT_COLLAPSED_COUNT
  const formatsShown = useMemo(
    () => visibleFormats(formats, value.formats, formatsExpanded, FORMAT_COLLAPSED_COUNT),
    [formats, value.formats, formatsExpanded],
  )
  const formatsHiddenCount = Math.max(0, formats.length - formatsShown.length)

  const toggleFormat = (format: string) => {
    const next = value.formats.includes(format)
      ? value.formats.filter((f) => f !== format)
      : [...value.formats, format]
    onChange({ ...value, formats: next })
  }

  const toggleYear = (year: number) => {
    const next = value.years.includes(year)
      ? value.years.filter((y) => y !== year)
      : [...value.years, year]
    onChange({ ...value, years: next })
  }

  const reset = () => {
    setFormatsExpanded(false)
    onChange({ query: '', formats: [], years: [] })
  }

  return (
    <div className={`projects-filter${visible ? ' projects-filter--visible' : ''}`}>
      <div className="projects-filter__search">
        <svg
          className="projects-filter__search-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          aria-hidden
        >
          <circle cx="11" cy="11" r="6.5" />
          <path d="M16.2 16.2 21 21" strokeLinecap="round" />
        </svg>
        <input
          type="search"
          className="projects-filter__input"
          value={value.query}
          onChange={(e) => onChange({ ...value, query: e.target.value })}
          placeholder={t('searchPlaceholder')}
          aria-label={t('searchAria')}
          autoComplete="off"
          enterKeyHint="search"
        />
        {value.query ? (
          <button
            type="button"
            className="projects-filter__clear"
            onClick={() => onChange({ ...value, query: '' })}
            aria-label={t('searchClear')}
          >
            ×
          </button>
        ) : null}
      </div>

      {formats.length > 0 ? (
        <div className="projects-filter__group">
          <span className="projects-filter__group-label">{t('filterFormats')}</span>
          <div
            className={`projects-filter__chips projects-filter__chips--formats${
              formatsExpanded ? ' projects-filter__chips--expanded' : ' projects-filter__chips--collapsed'
            }`}
            role="group"
            aria-label={t('filterFormats')}
          >
            <button
              type="button"
              className={`projects-filter__chip${value.formats.length === 0 ? ' projects-filter__chip--active' : ''}`}
              onClick={() => onChange({ ...value, formats: [] })}
              aria-pressed={value.formats.length === 0}
            >
              {t('filterAll')}
            </button>
            {formatsShown.map((format) => {
              const active = value.formats.includes(format)
              return (
                <button
                  key={format}
                  type="button"
                  className={`projects-filter__chip${active ? ' projects-filter__chip--active' : ''}`}
                  onClick={() => toggleFormat(format)}
                  aria-pressed={active}
                >
                  {format}
                </button>
              )
            })}
            {formatsCanCollapse ? (
              <button
                type="button"
                className="projects-filter__chip projects-filter__chip--more"
                onClick={() => setFormatsExpanded((v) => !v)}
                aria-expanded={formatsExpanded}
              >
                {formatsExpanded
                  ? t('filterShowLess')
                  : t('filterShowMore', { count: formatsHiddenCount })}
              </button>
            ) : null}
          </div>
        </div>
      ) : null}

      {years.length > 1 ? (
        <div className="projects-filter__group">
          <span className="projects-filter__group-label">{t('filterYears')}</span>
          <div className="projects-filter__chips" role="group" aria-label={t('filterYears')}>
            <button
              type="button"
              className={`projects-filter__chip${value.years.length === 0 ? ' projects-filter__chip--active' : ''}`}
              onClick={() => onChange({ ...value, years: [] })}
              aria-pressed={value.years.length === 0}
            >
              {t('filterAll')}
            </button>
            {years.map((year) => {
              const active = value.years.includes(year)
              return (
                <button
                  key={year}
                  type="button"
                  className={`projects-filter__chip${active ? ' projects-filter__chip--active' : ''}`}
                  onClick={() => toggleYear(year)}
                  aria-pressed={active}
                >
                  {year}
                </button>
              )
            })}
          </div>
        </div>
      ) : null}

      <div className="projects-filter__meta">
        <p className="projects-filter__results">
          <strong>{String(resultCount).padStart(2, '0')}</strong>
          {' · '}
          {resultCount === 1 ? t('filterResultOne') : t('filterResultMany')}
          {hasActive ? ` / ${String(projects.length).padStart(2, '0')}` : null}
        </p>
        {hasActive ? (
          <button type="button" className="projects-filter__reset" onClick={reset}>
            {t('filterReset')}
          </button>
        ) : null}
      </div>
    </div>
  )
}

