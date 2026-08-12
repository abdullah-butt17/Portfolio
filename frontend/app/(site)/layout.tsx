import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'

// This app has no mock data — every page here fetches the live backend.
// Force dynamic rendering so a build-time prerender pass never depends on
// the backend being reachable during `next build` (e.g. before it's deployed).
export const dynamic = 'force-dynamic'

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      <main id="main">{children}</main>
      <Footer />
    </>
  )
}
