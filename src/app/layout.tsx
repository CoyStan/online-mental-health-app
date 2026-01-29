import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import AuthProvider from '@/components/providers/AuthProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Maternal Wellness | Support for Your Journey',
  description: 'A supportive mental health app for mothers during pregnancy and early parenthood',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen animated-gradient">
            {/* Floating orbs for visual depth */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
              <div
                className="floating-orb w-96 h-96 bg-lavender-200"
                style={{ top: '10%', left: '5%', animationDelay: '0s' }}
              />
              <div
                className="floating-orb w-80 h-80 bg-rose-100"
                style={{ top: '60%', right: '10%', animationDelay: '-5s' }}
              />
              <div
                className="floating-orb w-64 h-64 bg-sky-100"
                style={{ bottom: '10%', left: '30%', animationDelay: '-10s' }}
              />
              <div
                className="floating-orb w-72 h-72 bg-peach-100"
                style={{ top: '30%', right: '25%', animationDelay: '-15s' }}
              />
            </div>
            {/* Main content */}
            <div className="relative z-10">
              {children}
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
