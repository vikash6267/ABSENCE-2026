import './globals.css'
import { Toaster } from 'react-hot-toast'
import AppShell from '@/components/AppShell'
import CookieConsent from '@/components/CookieConsent'

export const metadata = {
  title: 'ABSENCE - Premium Streetwear | Oversized T-Shirts & Streetwear Fashion',
  description: 'Shop premium streetwear at ABSENCE. Discover oversized t-shirts, graphic tees, and unique designs. Free shipping on orders above ₹999. 7-day easy returns.',
  keywords: 'streetwear, oversized t-shirts, graphic tees, premium clothing, fashion, ABSENCE, Indian streetwear',
  authors: [{ name: 'ABSENCE' }],
  openGraph: {
    title: 'ABSENCE - Premium Streetwear',
    description: 'Premium streetwear for those who speak through silence',
    url: 'https://wearabsence.com',
    siteName: 'ABSENCE',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'ABSENCE Streetwear',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ABSENCE - Premium Streetwear',
    description: 'Premium streetwear for those who speak through silence',
    images: ['/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://wearabsence.com" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body>
        <AppShell>{children}</AppShell>
        <Toaster position="top-right" />
        <CookieConsent />
      </body>
    </html>
  )
}
