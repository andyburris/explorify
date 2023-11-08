import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import localFont from 'next/font/local'
import './globals.css'
import { Favicon } from './common/Favicon'

const inter = Inter({ 
  subsets: ['latin'],
  variable: "--inter"
 })
const libreCaslonCondensed = localFont({
  src: './theme/fonts/LibreCaslonCondensed.ttf',
  display: 'swap',
  variable: "--libre-caslon-condensed",
})

export const metadata: Metadata = {
  title: 'Data Explorer',
  description: 'Spotify Data Explorer',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${libreCaslonCondensed.variable}`}>
      <head>
        <Favicon />
      </head>
      <body className={`text-lg/6 font-sans text-stone-900 dark:bg-stone-50`}>{children}</body>
    </html>
  )
}
