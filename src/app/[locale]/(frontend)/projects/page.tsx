import { setRequestLocale } from 'next-intl/server'
import { getProjects } from '@/lib/payload'
import { ProjectsScroll } from '@/components/projects/ProjectsScroll'

export default async function ProjectsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const projects = await getProjects(locale as 'fr' | 'en')
  return <ProjectsScroll projects={projects} locale={locale} />
}
