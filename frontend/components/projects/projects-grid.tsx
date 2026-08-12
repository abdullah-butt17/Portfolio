'use client'

import { useMemo, useState } from 'react'
import { ProjectCard } from '@/components/projects/project-card'
import { Reveal } from '@/components/ui/reveal'
import { cn } from '@/lib/utils'
import type { Project, ProjectCategory } from '@/lib/types'

const FILTERS: (ProjectCategory | 'All')[] = [
  'All',
  'Full Stack',
  'AI / ML',
  'University',
  'Personal',
  'Other',
]

export function ProjectsGrid({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<ProjectCategory | 'All'>('All')

  const available = useMemo(() => {
    const set = new Set(projects.map((p) => p.category))
    return FILTERS.filter((f) => f === 'All' || set.has(f))
  }, [projects])

  const filtered = useMemo(
    () =>
      active === 'All'
        ? projects
        : projects.filter((p) => p.category === active),
    [projects, active],
  )

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter projects by category">
        {available.map((filter) => {
          const isActive = active === filter
          return (
            <button
              key={filter}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(filter)}
              className={cn(
                'rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'border-primary/50 bg-primary/15 text-foreground'
                  : 'border-border bg-surface/40 text-muted-foreground hover:border-border-strong hover:text-foreground',
              )}
            >
              {filter}
            </button>
          )
        })}
      </div>

      {filtered.length === 0 ? (
        <p className="text-muted-foreground">
          {projects.length === 0
            ? 'No projects available yet.'
            : 'No projects match this filter.'}
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project, i) => (
            <Reveal key={project.slug} delay={i * 70}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  )
}
