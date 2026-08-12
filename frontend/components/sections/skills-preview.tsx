import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Container } from '@/components/ui/container'
import { SectionHeading } from '@/components/ui/section-heading'
import { Reveal } from '@/components/ui/reveal'
import { getSkillsGrouped } from '@/lib/api'

export async function SkillsPreview() {
  const grouped = await getSkillsGrouped()
  const categories = Object.entries(grouped)

  if (categories.length === 0) return null

  return (
    <section
      className="border-y border-border bg-surface/20 py-20 sm:py-28"
      aria-labelledby="skills-preview-heading"
    >
      <Container>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Technology"
            title={<span id="skills-preview-heading">The tools I build with</span>}
            description="A modern, production-oriented stack across the full spectrum — frontend, backend, data, and AI."
          />
          <Link
            href="/skills"
            className="group inline-flex shrink-0 items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-primary"
          >
            Explore all skills
            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map(([category, skills], i) => (
            <Reveal
              key={category}
              delay={i * 80}
              className="rounded-2xl border border-border bg-background/60 p-6 transition-colors hover:border-primary/30"
            >
              <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {category}
              </h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <li
                    key={skill.id}
                    className="rounded-lg border border-border bg-surface/60 px-3 py-1.5 text-sm text-foreground/90 transition-all hover:-translate-y-0.5 hover:border-primary/40"
                  >
                    {skill.name}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}
