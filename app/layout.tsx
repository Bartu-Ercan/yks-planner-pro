import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'YKS Planner - Haftalık Program',
  description: 'YKS çalışma programı planlayıcı',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" className="dark">
      <body>{children}</body>
    </html>
  )
}
