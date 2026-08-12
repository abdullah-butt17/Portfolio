import Image from 'next/image'
import { ArrowUpRight, ExternalLink, Github } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { TechnologyBadge, StatusBadge } from '@/components/ui/badges'
import type { Project } from '@/lib/types'

const linkIcon = {
  demo: ExternalLink,
  github: Github,
} as const

export function ProjectShowcase({
  project,
  variant = 'default',
  reverse = false,
}: {
  project: Project
  variant?: 'primary' | 'default'
  reverse?: boolean
}) {
  const isPrimary = variant === 'primary'

  return (
    <article
      className={cn(
        'group relative overflow-hidden rounded-3xl border border-border bg-surface/40',
        isPrimary && 'lg:rounded-[2rem]',
      )}
    >
      <div
        className={cn(
          'grid gap-0 lg:grid-cols-2',
          reverse && 'lg:[direction:rtl]',
        )}
      >
        {/* Media */}
        <div
          className={cn(
            'relative overflow-hidden bg-surface-2 [direction:ltr]',
            isPrimary ? 'aspect-[16/11] lg:aspect-auto' : 'aspect-[16/10] lg:aspect-auto',
          )}
        >
          <Image
            src={project.image || '/placeholder.svg'}
            alt={project.title}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-left-top transition-transform duration-700 group-hover:scale-[1.04]"
            priority={isPrimary}
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-background/70 via-transparent to-transparent lg:bg-gradient-to-r" />
        </div>

        {/* Content */}
        <div
          className={cn(
            'flex flex-col justify-center gap-5 p-7 [direction:ltr] sm:p-10',
            isPrimary && 'lg:p-14',
          )}
        >
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status={project.status} />
            <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              {project.category}
            </span>
          </div>

          <div>
            <h3
              className={cn(
                'font-semibold tracking-tight',
                isPrimary
                  ? 'text-3xl sm:text-4xl md:text-5xl'
                  : 'text-2xl sm:text-3xl',
              )}
            >
              {project.title}
            </h3>
          </div>

          <p className="max-w-xl text-pretty leading-relaxed text-muted-foreground">
            {project.description}
          </p>

          {isPrimary && project.features.length > 0 && (
            <ul className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
              {project.features.slice(0, 6).map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                  {feature}
                </li>
              ))}
            </ul>
          )}

          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <TechnologyBadge key={tech}>{tech}</TechnologyBadge>
            ))}
          </div>

          <div className="mt-2 flex flex-wrap gap-3">
            <Button href={`/projects/${project.slug}`} size="sm">
              View Case Study
              <ArrowUpRight />
            </Button>
            {project.links.map((link) => {
              const Icon = linkIcon[link.type]
              return (
                <Button
                  key={link.label}
                  href={link.href}
                  size="sm"
                  variant="outline"
                >
                  <Icon />
                  {link.label}
                </Button>
              )
            })}
          </div>
        </div>
      </div>
    </article>
  )
}
