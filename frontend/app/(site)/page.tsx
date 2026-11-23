
import type { Metadata } from 'next'

import { Hero } from '@/components/hero/hero'
import { AboutPreview } from '@/components/sections/about-preview'
import { SkillsPreview } from '@/components/sections/skills-preview'
import { FeaturedProjects } from '@/components/sections/featured-projects'
import { CTA } from '@/components/sections/cta'


const BASE_URL = 'https://www.abdullahbutt.dev'

export const metadata: Metadata = {
  title: 'Abdullah Butt | Full-Stack Developer & AI Engineer',
  description:
    'Explore the portfolio of Abdullah Butt, a Full-Stack Developer and AI Engineer building modern web applications, scalable business systems, and intelligent AI solutions.',

  alternates: {
    canonical: BASE_URL,
  },

  openGraph: {
    title: 'Abdullah Butt | Full-Stack Developer & AI Engineer',
    description:
      'Discover my projects, technical skills, and experience in full-stack development and artificial intelligence.',
    url: BASE_URL,
    type: 'website',
    siteName: 'Abdullah Butt',
    images: [
      {
        url: `${BASE_URL}/og-image.png`,
        alt: 'Abdullah Butt – Full-Stack Developer and AI Engineer',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Abdullah Butt | Full-Stack Developer & AI Engineer',
    description:
      'Explore my portfolio, projects, technical skills, and experience in full-stack development and AI.',
    images: [`${BASE_URL}/og-image.png`],
  },
}


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
