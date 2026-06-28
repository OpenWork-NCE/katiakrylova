import { setRequestLocale } from 'next-intl/server'
import { getProjects } from '@/lib/payload'
import { PlanSequence } from '@/components/3d/PlanSequence'

export default async function ProjectsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const projects = await getProjects(locale as 'fr' | 'en')
  return <PlanSequence projects={projects} locale={locale} />
}