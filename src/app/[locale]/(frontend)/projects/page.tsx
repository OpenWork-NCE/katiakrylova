import { setRequestLocale } from 'next-intl/server'
import { getProjectsList } from '@/lib/payload'
import { ProjectsScroll } from '@/components/projects/ProjectsScroll'

export const revalidate = 600

export default async function ProjectsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const projects = await getProjectsList(locale as 'fr' | 'en')
  return <ProjectsScroll projects={projects} locale={locale} />
}
