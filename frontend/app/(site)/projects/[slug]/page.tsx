import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, CheckCircle2, ExternalLink, Github } from 'lucide-react'
import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import { StatusBadge, TechnologyBadge } from '@/components/ui/badges'
import { ProjectGallery } from '@/components/projects/project-gallery'
import { getProject, getProjects } from '@/lib/api'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  try {
    const { projects } = await getProjects({ limit: 100 })
    return projects.map((p) => ({ slug: p.slug }))
  } catch {
    // Backend not reachable at build time — routes will render on-demand instead.
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const project = await getProject(slug)
  if (!project) return { title: 'Project not found' }
  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      images: project.image ? [project.image] : undefined,
    },
  }
}

export default async function ProjectDetailsPage({ params }: Props) {
  const { slug } = await params
  const project = await getProject(slug)

  if (!project || !project.published) notFound()

  const linkIcon = { demo: ExternalLink, github: Github } as const

  return (
    <>
      <section className="relative overflow-hidden border-b border-border pt-32 pb-14 sm:pt-40 sm:pb-20">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 grid-bg opacity-30 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]" />
          <div className="absolute left-1/2 top-0 h-64 w-[700px] -translate-x-1/2 rounded-full bg-primary/15 blur-[110px]" />
        </div>
        <Container>
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" /> All projects
          </Link>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <StatusBadge status={project.status} />
            <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              {project.category}
            </span>
          </div>

          <h1 className="mt-4 max-w-3xl text-balance text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl">
            {project.title}
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
            {project.description}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {project.links.map((link) => {
              const Icon = linkIcon[link.type]
              return (
                <Button key={link.label} href={link.href} size="md" variant={link.type === 'demo' ? 'primary' : 'outline'}>
                  <Icon />
                  {link.label}
                </Button>
              )
            })}
          </div>
        </Container>
      </section>

      {(project.video?.url || project.image) && (
        <section className="py-14 sm:py-20">
          <Container>
            {project.video?.url ? (
              <div className="overflow-hidden rounded-2xl border border-border bg-black">
                {/* eslint-disable-next-line jsx-a11y/media-has-caption -- walkthrough video, no captioned track available */}
                <video
                  controls
                  preload="none"
                  poster={project.image ?? undefined}
                  className="aspect-video w-full"
                >
                  <source src={project.video.url} />
                </video>
              </div>
            ) : (
              <div className="relative aspect-video overflow-hidden rounded-2xl border border-border bg-surface-2">
                <Image src={project.image!} alt={project.title} fill className="object-cover" priority />
              </div>
            )}
          </Container>
        </section>
      )}

      <section className="pb-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr] lg:gap-16">
            <div className="flex flex-col gap-12">
              {project.fullDescription && (
                <div>
                  <h2 className="text-xl font-semibold tracking-tight">Overview</h2>
                  <p className="mt-4 whitespace-pre-line leading-relaxed text-muted-foreground">
                    {project.fullDescription}
                  </p>
                </div>
              )}

              {project.features.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold tracking-tight">Key Features</h2>
                  <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                    {project.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {project.gallery.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold tracking-tight">Gallery</h2>
                  <div className="mt-5">
                    <ProjectGallery images={project.gallery} />
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-8">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Technologies
                </h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {project.technologies.map((t) => (
                    <TechnologyBadge key={t}>{t}</TechnologyBadge>
                  ))}
                </div>
              </div>

              {(project.startDate || project.completionDate) && (
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Timeline
                  </h3>
                  <div className="mt-3 space-y-1 text-sm text-muted-foreground">
                    {project.startDate && (
                      <p>Started: {new Date(project.startDate).toLocaleDateString()}</p>
                    )}
                    {project.completionDate && (
                      <p>Completed: {new Date(project.completionDate).toLocaleDateString()}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
