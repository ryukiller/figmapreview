import './globals.css'

import AuthProvider from '@/lib/AuthProvider'

import { RgNav } from '@/rg-components/Nav'
import { Toaster } from "@/components/ui/toaster"

import { Unbounded, Kanit } from 'next/font/google'

const unbounded = Unbounded({
  variable: '--font-unbounded',
  subsets: ['latin'],
  weight: ["200", "300", "400", "500", "600", "700", "800"]
})

const kanit = Kanit({
  variable: '--font-kanit',
  subsets: ['latin'],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  display: 'swap'
})

export const metadata = {
  title: 'Contratti - SWI Agency',
  description: 'App per gestione contratti swi',
}

export default function RootLayout({ children }) {
  return (
    <html lang="it" className={unbounded.variable}>
      <body className={kanit.className}>
        <AuthProvider>
          <RgNav />
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
