// app/layout.tsx

import './globals.css'
import Link from 'next/link'
import type { Metadata } from 'next'
import ConsentBanner from '../components/ConsentBanner'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'PocketTool — Quick Swiss-Army Web Tools',
  description: 'Fast, private, ad-light tools that run in your browser.',
  manifest: '/manifest.json',
  themeColor: '#B22222',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-neutral-950 text-white">
        <header className="sticky top-0 z-40 backdrop-blur border-b border-neutral-800 bg-neutral-950/80">
          <div className="container flex items-center gap-4 py-3">
            <Link href="/" className="font-semibold tracking-tight text-lg">🛠️ PocketTool</Link>
            <nav className="ml-auto flex gap-4 text-sm">
              <Link href="/qr" className="hover:underline">QR</Link>
              <Link href="/image-converter" className="hover:underline">Images</Link>
              <Link href="/pdf" className="hover:underline">PDF Editor</Link>
            </nav>
          </div>
        </header>

        <main className="container py-6">
          <ConsentBanner />
          {children}
        </main>

        <footer className="container py-6 text-sm text-neutral-400">
          <div className="flex flex-wrap gap-4">
            <Suspense fallback={<span>© PocketTool</span>}>
              <DynamicCopyright />
            </Suspense>
            <Link href="/privacy" className="hover:underline">Privacy</Link>
            <Link href="/terms" className="hover:underline">Terms</Link>
            <Link href="/cookies" className="hover:underline">Cookies</Link>
          </div>
        </footer>
      </body>
    </html>
  )
}

// This must be a client-only component
function DynamicCopyright() {
  if (typeof window === 'undefined') return null
  return <span>© {new Date().getFullYear()} PocketTool</span>
}
// This component is used to dynamically render the current year in the footer
// It ensures that the copyright year is always up-to-date without needing a server-side render