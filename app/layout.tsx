import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { DatasetProvider } from '@/contexts/DatasetContext'

import './globals.css'

const _geist = Geist({ subsets: ['latin'] })
const _geistMono = Geist_Mono({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Energy Consumption Forecasting & Optimization Dashboard',
  description: 'Advanced AI-powered platform for energy forecasting, optimization, and smart grid management',
  generator: 'v0.app',
  keywords: 'energy management, forecasting, optimization, smart grid, ARIMA, LSTM, Prophet',
  authors: [{ name: 'Energy Analytics Team' }],
  openGraph: {
    title: 'Energy Dashboard',
    description: 'Intelligent energy management platform',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme') || 'dark';
                if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased dark">
        <DatasetProvider>{children}</DatasetProvider>
      </body>
    </html>
  )
}
