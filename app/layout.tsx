import type { Metadata } from 'next'
import { Poppins, Cairo } from 'next/font/google'
import './globals.css'
import AppProviders from '@/providers/AppProviders'
import { NotesProvider } from '@/@core/context/NotesContext'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/@core/context/AuthContext'
import { Logout } from '@/components/Logout'


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
  title: 'Shortcut Nextjs Template',
  description: 'Stop starting projects from scratch, start in the middle and save time!'
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
          <AuthProvider>
          <NotesProvider>
          <Logout/>
          {children}
          <Toaster position="top-center" reverseOrder={false} />
          </NotesProvider>
          </AuthProvider>
        </AppProviders>
      </body>
    </html>
  )
}
