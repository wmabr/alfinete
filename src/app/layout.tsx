import type { Metadata } from 'next'
import { Nunito_Sans } from 'next/font/google'
import './globals.css'

const geistSans = Nunito_Sans({
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Alfinete',
  description: 'Manage notices',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${geistSans.className} antialiased`}>{children}</body>
    </html>
  )
}
