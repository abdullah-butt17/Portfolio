import type { Metadata } from 'next'
import { Container } from '@/components/ui/container'
import { PageHeader } from '@/components/layout/page-header'
import { Reveal } from '@/components/ui/reveal'
import { SkillCard } from '@/components/skills/skill-card'
import { getSkillsGrouped, getProfile } from '@/lib/api'

export const metadata: Metadata = {
  title: 'Skills',
  description:
    'Technical skills across the MERN stack, AI/ML, and cloud deployment.',
}

export default async function SkillsPage() {
  const [byCategory, profile] = await Promise.all([getSkillsGrouped(), getProfile()])
  const categories = Object.keys(byCategory)

  return (
    <>
      <PageHeader
        eyebrow="// capabilities"
        title="Skills & technologies"
        description="The tools and disciplines I reach for when turning ideas into production software — from pixel-level frontends to resilient backends and applied AI."
      />

      <section className="py-16 sm:py-20">
        <Container className="flex flex-col gap-16">
          {categories.length === 0 && (
            <p className="text-muted-foreground">Skills will appear here soon.</p>
          )}
          {categories.map((category, ci) => (
            <div key={category} className="flex flex-col gap-6">
              <Reveal className="flex items-baseline justify-between gap-4 border-b border-border pb-4">
                <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
                  {category}
                </h2>
                <span className="font-mono text-sm text-muted-foreground">
                  {String(ci + 1).padStart(2, '0')}
                </span>
              </Reveal>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {byCategory[category].map((skill, i) => (
                  <Reveal key={skill.id} delay={i * 60}>
                    <SkillCard skill={skill} />
                  </Reveal>
                ))}
              </div>
            </div>
          ))}
        </Container>
      </section>

      {profile.email && (
        <section className="border-t border-border py-16 sm:py-20">
          <Container>
            <Reveal className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-surface/50 p-8 text-center sm:p-12">
              <h2 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
                Always learning something new
              </h2>
              <p className="max-w-xl text-pretty leading-relaxed text-muted-foreground">
                I&apos;m currently deepening my work in applied AI and
                retrieval-augmented systems while sharpening full-stack
                fundamentals. If you want to build something together, my inbox is
                open.
              </p>
              <a
                href={`mailto:${profile.email}`}
                className="mt-2 font-mono text-sm text-primary underline-offset-4 hover:underline"
              >
                {profile.email}
              </a>
            </Reveal>
          </Container>
        </section>
      )}
    </>
  )
}
