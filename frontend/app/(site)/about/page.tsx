import type { Metadata } from 'next'
import { ArrowUpRight, Code2, BrainCircuit, Building2 } from 'lucide-react'
import { Container } from '@/components/ui/container'
import { PageHeader } from '@/components/layout/page-header'
import { Reveal } from '@/components/ui/reveal'
import { Button } from '@/components/ui/button'
import { getProfile } from '@/lib/api'

export const metadata: Metadata = {
  title: 'About',
  description:
    'About Abdullah Butt — a Full-Stack Developer & AI Engineer building modern web applications, business systems, and intelligent software.',
}

const whatIDo = [
  {
    icon: Code2,
    title: 'Full-Stack Development',
    body: 'I build complete web applications on the MERN stack — designing data models, engineering REST APIs with Node.js and Express, and crafting responsive React interfaces. I care about clean architecture that stays maintainable as products grow.',
  },
  {
    icon: BrainCircuit,
    title: 'AI / ML Engineering',
    body: 'I bring intelligence into software with applied machine learning, natural language processing, and retrieval-augmented generation. My focus is practical AI features that are grounded, reliable, and genuinely useful — not novelty.',
  },
  {
    icon: Building2,
    title: 'Real-World Systems',
    body: 'I have built production business software that runs real operations — including a sales management system for a company operating 25 stores. I enjoy translating messy, real-world processes into structured, dependable systems.',
  },
]

const philosophy = [
  {
    n: '01',
    title: 'Build for production, not demos',
    body: 'Software should hold up under real usage. I design with validation, error handling, and maintainability in mind from the start.',
  },
  {
    n: '02',
    title: 'Usability is a feature',
    body: 'The best backend is worthless if the interface confuses people. I sweat the UX details so the software feels effortless.',
  },
  {
    n: '03',
    title: 'Simple beats clever',
    body: 'I favor clear, readable solutions over clever ones. Future-me (and every teammate) should be able to understand the code.',
  },
]

export default async function AboutPage() {
  const profile = await getProfile()

  return (
    <>
      <PageHeader
        eyebrow="About Abdullah"
        title="A developer who builds real software people actually use."
        description="Full-Stack Developer & AI Engineer with a focus on modern web applications, business management systems, and intelligent digital solutions."
      />

      {/* Who I Am */}
      <section className="py-20 sm:py-28" aria-labelledby="who-heading">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
            <Reveal>
              <h2
                id="who-heading"
                className="text-2xl font-semibold tracking-tight sm:text-3xl"
              >
                Who I am
              </h2>
              <div className="mt-6 flex flex-col gap-3 text-sm text-muted-foreground">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <span>Name</span>
                  <span className="text-foreground">{profile.name}</span>
                </div>
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <span>Role</span>
                  <span className="text-foreground">{profile.title}</span>
                </div>
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <span>Location</span>
                  <span className="text-foreground">{profile.location}</span>
                </div>
                <div className="flex items-center justify-between pb-3">
                  <span>Status</span>
                  <span className="text-accent">Available</span>
                </div>
              </div>
            </Reveal>

            <Reveal delay={100} className="flex flex-col gap-6 text-pretty text-lg leading-relaxed text-muted-foreground">
              <p>
                I&apos;m{' '}
                <span className="text-foreground">Abdullah Butt</span>, a
                Full-Stack Developer &amp; AI Engineer who enjoys turning ideas
                into software that works in the real world. My work spans the
                full stack — from database design and backend APIs to the
                interfaces people interact with every day.
              </p>
              <p>
                Over time I&apos;ve built an e-commerce platform, a business
                operations system managing 25 stores, and I&apos;m currently
                developing a real estate marketplace. Alongside web development,
                I work with machine learning, NLP, and retrieval-augmented
                generation to build smarter, more capable products.
              </p>
              <p>
                What drives me is impact: I want the things I build to solve
                genuine problems, perform well, and feel great to use.
              </p>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* What I Do */}
      <section
        className="border-y border-border bg-surface/20 py-20 sm:py-28"
        aria-labelledby="what-heading"
      >
        <Container>
          <Reveal>
            <h2
              id="what-heading"
              className="max-w-2xl text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl"
            >
              What I do
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {whatIDo.map((item, i) => (
              <Reveal
                key={item.title}
                delay={i * 100}
                className="flex flex-col gap-4 rounded-2xl border border-border bg-background/60 p-7"
              >
                <span className="grid size-11 place-items-center rounded-xl border border-border bg-surface text-primary">
                  <item.icon className="size-5" />
                </span>
                <h3 className="text-lg font-semibold tracking-tight">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {item.body}
                </p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Philosophy */}
      <section className="py-20 sm:py-28" aria-labelledby="philosophy-heading">
        <Container>
          <Reveal>
            <span className="inline-flex items-center gap-2 text-sm font-medium text-primary">
              <span className="h-px w-6 bg-primary/60" aria-hidden />
              Development Philosophy
            </span>
            <h2
              id="philosophy-heading"
              className="mt-4 max-w-2xl text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl"
            >
              How I approach building software
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {philosophy.map((item, i) => (
              <Reveal key={item.n} delay={i * 100} className="border-t border-border pt-6">
                <span className="font-mono text-sm text-primary">{item.n}</span>
                <h3 className="mt-4 text-lg font-semibold tracking-tight">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {item.body}
                </p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Current Focus */}
      <section className="pb-24" aria-labelledby="focus-heading">
        <Container>
          <Reveal className="relative overflow-hidden rounded-3xl border border-border-strong bg-surface/50 p-8 sm:p-12">
            <div className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-primary/15 blur-3xl" />
            <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="max-w-xl">
                <h2
                  id="focus-heading"
                  className="text-2xl font-semibold tracking-tight sm:text-3xl"
                >
                  Current focus
                </h2>
                <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
                  Deepening my AI engineering work — building RAG-powered
                  features and NLP tooling — while shipping the real estate
                  platform and taking on full-stack freelance projects.
                </p>
              </div>
              <Button href="/contact" size="lg">
                Work with me
                <ArrowUpRight />
              </Button>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  )
}
