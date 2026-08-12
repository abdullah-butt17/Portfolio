import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { TechnologyBadge, StatusBadge } from '@/components/ui/badges'
import type { Project } from '@/lib/types'

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface/40 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-surface-2">
        <Image
          src={project.image || '/placeholder.svg'}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/10 to-transparent" />
        <div className="absolute left-4 top-4">
          <StatusBadge status={project.status} />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold tracking-tight">
              {project.title}
            </h3>
            <p className="text-sm text-muted-foreground">{project.category}</p>
          </div>
          <span className="mt-1 grid size-8 shrink-0 place-items-center rounded-full border border-border text-muted-foreground transition-all duration-300 group-hover:border-primary/50 group-hover:text-foreground">
            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>

        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {project.description}
        </p>

        <div className="mt-auto flex flex-wrap gap-2 pt-2">
          {project.technologies.slice(0, 4).map((tech) => (
            <TechnologyBadge key={tech}>{tech}</TechnologyBadge>
          ))}
        </div>
      </div>
    </Link>
  )
}
