import { Hero } from '@/components/hero/hero'
import { AboutPreview } from '@/components/sections/about-preview'
import { SkillsPreview } from '@/components/sections/skills-preview'
import { FeaturedProjects } from '@/components/sections/featured-projects'
import { CTA } from '@/components/sections/cta'

export default function HomePage() {
  return (
    <>
      <Hero />
      <AboutPreview />
      <SkillsPreview />
      <FeaturedProjects />
      <CTA />
    </>
  )
}
