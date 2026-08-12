import type { Metadata } from 'next'
import { Container } from '@/components/ui/container'
import { PageHeader } from '@/components/layout/page-header'
import { ProjectsGrid } from '@/components/projects/projects-grid'
import { getProjects } from '@/lib/api'

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Selected full-stack, business systems, and AI/ML projects — with in-depth case studies.',
}

export default async function ProjectsPage() {
  const { projects } = await getProjects({ limit: 100 })

  return (
    <>
      <PageHeader
        eyebrow="// selected work"
        title="Projects & case studies"
        description="A selection of things I've designed and built — from production MERN platforms to real-world business systems. Each project links to a full case study."
      />

      <section className="py-16 sm:py-20">
        <Container>
          <ProjectsGrid projects={projects} />
        </Container>
      </section>
    </>
  )
}
