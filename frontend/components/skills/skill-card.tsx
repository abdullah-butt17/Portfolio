import type { Skill } from '@/lib/types'

const levelLabels: Record<Skill['level'], string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
  expert: 'Expert',
}

export function SkillCard({ skill }: { skill: Skill }) {
  const hasCertificate = !!skill.certificate?.url

  return (
    <div className="group flex items-center gap-3 rounded-xl border border-border bg-background/60 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40">
      <span
        className="grid size-9 shrink-0 place-items-center rounded-lg border border-border bg-surface font-mono text-sm font-semibold text-primary"
        aria-hidden
      >
        {skill.name.slice(0, 2)}
      </span>

      <div className="min-w-0 flex-1">
        <h3 className="text-base font-semibold tracking-tight">
          {skill.name}
        </h3>

        <p className="text-sm leading-relaxed text-muted-foreground">
          {levelLabels[skill.level]}
        </p>

        {hasCertificate && (
          <a
            href={skill.certificate!.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary underline-offset-4 transition-colors hover:underline"
          >
            View Certificate
            <span aria-hidden>↗</span>
          </a>
        )}
      </div>
    </div>
  )
}