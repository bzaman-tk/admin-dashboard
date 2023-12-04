import { Inter } from 'next/font/google'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { ModalProvider } from '@/providers/modal-provider'
import { TosterProvider } from '@/providers/toast-provider'
import { ThemeProvider } from '@/providers/ThemeProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Anime Dashboard',
  description: 'Admin Dashboard -  Anime',
}

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <TosterProvider />
            <ModalProvider />
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
