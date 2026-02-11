import type { Metadata } from 'next'
import { Poppins, Cairo } from 'next/font/google'
import './globals.css'
import AppProviders from '@/providers/AppProviders'
import { Toaster } from 'react-hot-toast'

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  weight: ['300', '400', '500', '600', '700']
})

const cairo = Cairo({
  subsets: ['arabic'],
  variable: '--font-cairo',
  weight: ['300', '400', '500', '600', '700']
})
export const metadata: Metadata = {
  title: 'Team Note-Board',
  description: 'Team Note Board'
}

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' dir='ltr'>
      <body className={`${poppins.variable} ${cairo.variable} antialiased`}>
        <AppProviders>
          {children}
          <Toaster position='top-center' reverseOrder={false} />
        </AppProviders>
      </body>
    </html>
  )
}
