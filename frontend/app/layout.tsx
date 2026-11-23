
import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://www.abdullahbutt.dev'),
  title: {
    default: 'Abdullah Butt | Full-Stack Developer & AI Engineer',
    template: '%s | Abdullah Butt',
  },
  description:
    'Abdullah Butt is a Full-Stack Developer and AI Engineer specializing in React, Next.js, Node.js, Python, AI applications, and modern business software solutions.',
  keywords: [
    'Abdullah Butt',
    'Abdullah Butt Developer',
    'Full-Stack Developer',
    'AI Engineer',
    'Software Engineer',
    'Next.js Developer',
    'React Developer',
    'Python Developer',
    'MERN Stack Developer',
    'Machine Learning',
  ],
  authors: [{ name: 'Abdullah Butt' }],
  creator: 'Abdullah Butt',
  publisher: 'Abdullah Butt',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Abdullah Butt',
    title: 'Abdullah Butt | Full-Stack Developer & AI Engineer',
    description:
      'Building modern web applications, business management systems, and intelligent AI-powered software solutions.',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#0d0d12',
}


const structuredData = [
  {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Abdullah Butt',
    url: 'https://www.abdullahbutt.dev',
    jobTitle: 'Full-Stack Developer & AI Engineer',
    description:
      'Full-Stack Developer and AI Engineer specializing in React, Next.js, Node.js, Python, and AI applications.',
    knowsAbout: [
      'Full-Stack Development',
      'React',
      'Next.js',
      'Node.js',
      'Python',
      'Artificial Intelligence',
      'Machine Learning',
      'MERN Stack',
    ],
    sameAs: [
      'https://github.com/abdullah-butt17',
      'https://www.linkedin.com/in/abdullah-butt-92939436a/',
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Abdullah Butt',
    url: 'https://www.abdullahbutt.dev',
    description:
      'Personal portfolio showcasing full-stack development, software engineering, and AI projects by Abdullah Butt.',
    author: {
      '@type': 'Person',
      name: 'Abdullah Butt',
    },
  },
]



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${jetbrainsMono.variable} bg-background`}
    >
      <head>
        {structuredData.map((data, index) => (
          <script
            key={index}
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(data).replace(/</g, '\\u003c'),
            }}
          />
        ))}
      </head>

      <body className="min-h-dvh font-sans antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:text-primary-foreground"
        >
          Skip to content
        </a>

        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}

