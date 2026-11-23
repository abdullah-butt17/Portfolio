import type { Metadata } from 'next'
import { Container } from '@/components/ui/container'
import { PageHeader } from '@/components/layout/page-header'
import { ProjectsGrid } from '@/components/projects/projects-grid'
import { getProjects } from '@/lib/api'



const BASE_URL = 'https://www.abdullahbutt.dev'


export const metadata: Metadata = {
  title: 'Projects & Case Studies',
  description:
    'Explore full-stack development, MERN applications, business management systems, and AI/ML projects built by Abdullah Butt, with detailed case studies and technologies.',

  alternates: {
    canonical: `${BASE_URL}/projects`,
  },

  openGraph: {
    title: 'Projects & Case Studies | Abdullah Butt',
    description:
      'Explore full-stack applications, business systems, and AI-powered projects developed by Abdullah Butt.',
    url: `${BASE_URL}/projects`,
    type: 'website',
    siteName: 'Abdullah Butt',
    images: [
      {
        url: `${BASE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Abdullah Butt – Projects and Case Studies',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Projects & Case Studies | Abdullah Butt',
    description:
      'Explore full-stack applications, business systems, and AI-powered projects developed by Abdullah Butt.',
    images: [`${BASE_URL}/og-image.png`],
  },
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
