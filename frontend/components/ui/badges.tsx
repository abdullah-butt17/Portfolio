import { cn } from '@/lib/utils'
import type { ProjectStatus } from '@/lib/types'

export function TechnologyBadge({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-border bg-surface/60 px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground',
        className,
      )}
    >
      {children}
    </span>
  )
}

const statusLabels: Record<ProjectStatus, string> = {
  completed: 'Completed',
  'in-progress': 'In Progress',
  archived: 'Archived',
}

const statusStyles: Record<ProjectStatus, string> = {
  completed: 'border-accent/30 bg-accent/10 text-accent [&_.dot]:bg-accent',
  'in-progress':
    'border-primary/40 bg-primary/10 text-primary [&_.dot]:bg-primary [&_.dot]:animate-pulse',
  archived: 'border-border-strong bg-surface text-muted-foreground [&_.dot]:bg-muted-foreground',
}

export function StatusBadge({
  status,
  className,
}: {
  status: ProjectStatus
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium',
        statusStyles[status],
        className,
      )}
    >
      <span className="dot size-1.5 rounded-full" aria-hidden />
      {statusLabels[status]}
    </span>
  )
}
