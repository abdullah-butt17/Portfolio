import { Container } from '@/components/ui/container'

export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description: string
}) {
  return (
    <section className="relative overflow-hidden border-b border-border pt-32 pb-14 sm:pt-40 sm:pb-20">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 grid-bg opacity-30 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]" />
        <div className="absolute left-1/2 top-0 h-64 w-[700px] -translate-x-1/2 rounded-full bg-primary/15 blur-[110px]" />
      </div>
      <Container>
        <p className="fade-up font-mono text-sm tracking-wide text-primary">
          {eyebrow}
        </p>
        <h1 className="fade-up mt-4 max-w-3xl text-balance text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl">
          {title}
        </h1>
        <p
          className="fade-up mt-6 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg"
          style={{ animationDelay: '120ms' }}
        >
          {description}
        </p>
      </Container>
    </section>
  )
}
