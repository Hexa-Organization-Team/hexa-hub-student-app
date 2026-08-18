import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Manrope, Sora } from 'next/font/google'
import './globals.css'

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-sans',
})

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-display',
})

export const metadata = {
  title: 'Hexa Student Hub',
  description: 'App per lo studio',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Hexa Student Hub',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#181521',
  userScalable: false,
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="it" className={`dark ${manrope.variable} ${sora.variable}`}>
      <body className="bg-background font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
