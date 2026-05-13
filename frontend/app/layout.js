import './globals.css'
import { Toaster } from 'react-hot-toast'
import AppShell from '@/components/AppShell'
import CookieConsent from '@/components/CookieConsent'

export const metadata = {
  metadataBase: new URL('https://www.wearabsence.com'),
  
  // Basic Meta Tags
  title: {
    default: 'ABSENCE - Premium Streetwear | Oversized T-Shirts & Graphic Tees',
    template: '%s | ABSENCE',
  },
  description: 'Shop premium streetwear at ABSENCE. Discover oversized t-shirts, graphic tees, and unique designs. Free shipping on orders above Rs. 999 with easy 7-day exchange.',
  keywords: [
    'streetwear',
    'oversized t-shirts',
    'graphic tees',
    'premium clothing',
    'fashion',
    'ABSENCE',
    'Indian streetwear',
    'unisex clothing',
    'trendy t-shirts',
    'online fashion store',
    'buy t-shirts online',
    'streetwear India',
  ],
  authors: [{ name: 'ABSENCE', url: 'https://www.wearabsence.com' }],
  creator: 'ABSENCE',
  publisher: 'ABSENCE',
  
  // Favicon and Icons
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
        color: '#D4AF37',
      },
    ],
  },
  
  // Manifest
  manifest: '/site.webmanifest',
  
  // Open Graph
  openGraph: {
    title: 'ABSENCE - Premium Streetwear',
    description: 'Premium streetwear for those who speak through silence. Shop oversized t-shirts, graphic tees, and unique designs.',
    url: 'https://www.wearabsence.com',
    siteName: 'ABSENCE',
    images: [
      {
        url: '/android-chrome-512x512.png',
        width: 1200,
        height: 630,
        alt: 'ABSENCE Premium Streetwear',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  
  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'ABSENCE - Premium Streetwear',
    description: 'Premium streetwear for those who speak through silence',
    images: ['/android-chrome-512x512.png'],
    creator: '@wearabsence_',
    site: '@wearabsence_',
  },
  
  // Robots
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  // Verification (add your verification codes here)
  verification: {
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
  
  // App Links
  appleWebApp: {
    capable: true,
    title: 'ABSENCE',
    statusBarStyle: 'black-translucent',
  },
  
  // Format Detection
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  
  // Category
  category: 'shopping',
  
  // Other
  other: {
    'msapplication-TileColor': '#0F0F0F',
    'msapplication-config': '/browserconfig.xml',
  },
}

export default function RootLayout({ children }) {
  // Structured Data for Organization
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ABSENCE',
    alternateName: 'ABSENCE Streetwear',
    url: 'https://www.wearabsence.com',
    logo: 'https://www.wearabsence.com/logo.png',
    description: 'Premium streetwear for those who speak through silence',
    email: 'absence.clothiers@gmail.com',
    sameAs: [
      'https://www.instagram.com/wearabsence_/',
    ],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IN',
    },
  };

  // Structured Data for Website
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'ABSENCE',
    url: 'https://www.wearabsence.com',
    description: 'Shop premium streetwear at ABSENCE',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://www.wearabsence.com/shop?search={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <html lang="en">
      <head>
        {/* Canonical URL */}
        <link rel="canonical" href="https://www.wearabsence.com" />
        
        {/* Viewport */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        
        {/* Theme Color */}
        <meta name="theme-color" content="#0F0F0F" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#FFFFFF" media="(prefers-color-scheme: light)" />
        
        {/* Apple Mobile Web App */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="ABSENCE" />
        
        {/* Microsoft */}
        <meta name="msapplication-TileColor" content="#0F0F0F" />
        <meta name="msapplication-tap-highlight" content="no" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body>
        <AppShell>{children}</AppShell>
        <Toaster position="top-right" />
        <CookieConsent />
      </body>
    </html>
  )
}
