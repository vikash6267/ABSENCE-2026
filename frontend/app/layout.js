import './globals.css'
import { Toaster } from 'react-hot-toast'
import AppShell from '@/components/AppShell'

export const metadata = {
  title: 'ABSENCE - Premium T-Shirts',
  description: 'Discover premium quality t-shirts at wearabsence.com',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
        <Toaster position="top-right" />
      </body>
    </html>
  )
}
