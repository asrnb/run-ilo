import type { Metadata } from 'next'
import { Archivo, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google'
import { siteUrl } from '@/lib/site'
import './globals.css'

const archivo = Archivo({
  subsets: ['latin'],
  variable: '--font-archivo',
})

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
})

const description =
  'Community directory of fun runs and marathons in Iloilo City, Philippines.'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: 'run.ilo — Iloilo Race Directory',
  description,
  openGraph: {
    title: 'run.ilo — Iloilo Race Directory',
    description,
    siteName: 'run.ilo',
    locale: 'en_PH',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={`${archivo.variable} ${jakarta.variable} ${jetbrains.variable} bg-predawn-900 text-white font-body min-h-screen antialiased`}
      >
        {children}
      </body>
    </html>
  )
}
