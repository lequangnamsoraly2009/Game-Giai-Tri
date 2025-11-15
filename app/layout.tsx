import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Game Ngu - Kiểm tra trí nhớ',
  description: 'Game kiểm tra trí nhớ và khả năng quan sát',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  )
}

