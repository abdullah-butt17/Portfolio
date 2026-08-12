import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Container } from '@/components/ui/container'
import { SectionHeading } from '@/components/ui/section-heading'
import { Reveal } from '@/components/ui/reveal'
import { ProjectShowcase } from '@/components/projects/project-showcase'
import { getFeaturedProjects } from '@/lib/api'

export async function FeaturedProjects() {
  const featured = await getFeaturedProjects()

  if (featured.length === 0) return null

  const [primary, ...rest] = featured

  return (
    <section className="py-20 sm:py-28" aria-labelledby="featured-heading">
      <Container>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Selected Work"
            title={<span id="featured-heading">Featured projects</span>}
            description="Real applications built for real use — from e-commerce to business operations software."
          />
          <Link
            href="/projects"
            className="group inline-flex shrink-0 items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-primary"
          >
            View all projects
            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="mt-14 flex flex-col gap-8">
          {primary && (
            <Reveal>
              <ProjectShowcase project={primary} variant="primary" />
            </Reveal>
          )}

          {rest.map((project, i) => (
            <Reveal key={project.slug}>
              <ProjectShowcase project={project} reverse={i % 2 === 1} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}
