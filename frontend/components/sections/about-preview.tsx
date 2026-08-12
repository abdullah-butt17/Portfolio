import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Container } from '@/components/ui/container'
import { Reveal } from '@/components/ui/reveal'

const focusAreas = [
  {
    title: 'Full-Stack Development',
    body: 'End-to-end MERN applications — from data modeling and APIs to polished, responsive interfaces.',
  },
  {
    title: 'AI / ML Engineering',
    body: 'Applied machine learning, NLP, and retrieval-augmented generation to build intelligent features.',
  },
  {
    title: 'Real-World Systems',
    body: 'Production business software that solves genuine operational problems at scale.',
  },
]

export function AboutPreview() {
  return (
    <section className="py-20 sm:py-28" aria-labelledby="about-preview-heading">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <Reveal>
            <span className="inline-flex items-center gap-2 text-sm font-medium text-primary">
              <span className="h-px w-6 bg-primary/60" aria-hidden />
              About
            </span>
            <h2
              id="about-preview-heading"
              className="mt-4 text-balance text-2xl font-semibold leading-snug tracking-tight sm:text-3xl md:text-4xl"
            >
              I&apos;m Abdullah Butt, a Full-Stack Developer &amp; AI Engineer
              focused on building modern web applications, business systems, and
              intelligent digital solutions.
            </h2>
            <Link
              href="/about"
              className="group mt-8 inline-flex items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-primary"
            >
              Read More About Me
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </Reveal>

          <div className="flex flex-col gap-4">
            {focusAreas.map((area, i) => (
              <Reveal
                key={area.title}
                delay={i * 100}
                className="rounded-2xl border border-border bg-surface/40 p-6 transition-colors hover:border-primary/30"
              >
                <div className="flex items-baseline gap-4">
                  <span className="font-mono text-sm text-primary">
                    0{i + 1}
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold tracking-tight">
                      {area.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {area.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
