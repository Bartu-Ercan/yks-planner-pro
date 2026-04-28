import type { Metadata } from 'next'
import { DM_Mono, Geist_Mono, IBM_Plex_Mono, JetBrains_Mono, Manrope, Space_Grotesk } from 'next/font/google'
import './globals.css'

export const metadata: Metadata = {
  title: 'YKS Planner Pro - Haftalık Program',
  description: 'YKS çalışma programı planlayıcı',
}

const dmMono = DM_Mono({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500'],
  display: 'swap',
  variable: '--font-dm-mono',
})

const geistMono = Geist_Mono({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-geist-mono',
})

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500', '600'],
  display: 'swap',
  variable: '--font-ibm-plex-mono',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-space-grotesk',
})

const manrope = Manrope({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-manrope',
})

const fontVariables = [
  dmMono.variable,
  geistMono.variable,
  jetBrainsMono.variable,
  ibmPlexMono.variable,
  spaceGrotesk.variable,
  manrope.variable,
].join(' ')

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" className={`dark ${fontVariables}`}>
      <body>{children}</body>
    </html>
  )
}
