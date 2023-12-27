import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import localFont from 'next/font/local'
import './globals.css'
import { Favicon } from './common/Favicon'
import nightwind from "nightwind/helper"

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
  title: 'Quantize',
  description: 'Explore your Spotify extended streaming history',
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
        <script dangerouslySetInnerHTML={{ __html: nightwind.init() }} />
      </head>
      <body className={`text-lg/6 font-sans text-neutral-900 bg-white dark:bg-neutral-50`}>{children}</body>
    </html>
  )
}
