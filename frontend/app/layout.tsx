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
  metadataBase: new URL('https://abdullahbutt.dev'),
  title: {
    default: 'Abdullah Butt — Full-Stack Developer & AI Engineer',
    template: '%s · Abdullah Butt',
  },
  description:
    'Abdullah Butt is a Full-Stack Developer & AI Engineer building modern web applications, business management systems, and intelligent software solutions.',
  keywords: [
    'Abdullah Butt',
    'Full-Stack Developer',
    'AI Engineer',
    'MERN',
    'React',
    'Node.js',
    'MongoDB',
    'Machine Learning',
  ],
  authors: [{ name: 'Abdullah Butt' }],
  openGraph: {
    title: 'Abdullah Butt — Full-Stack Developer & AI Engineer',
    description:
      'Building modern web applications, business systems, and intelligent software solutions.',
    type: 'website',
    siteName: 'Abdullah Butt',
  },
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#0d0d12',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} bg-background`}
    >
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
