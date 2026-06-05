import './globals.css'
import { LanguageProvider } from '@/contexts/LanguageContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'

export const metadata = {
  title: 'Hariom Electronics | Trusted Since 1988 | Electronics Store in Alandi',
  description: 'Your trusted multi-brand electronics and home appliance store in Alandi, Maharashtra. Serving since 1988. Samsung, LG, Sony, and more. EMI, home delivery, and expert installation.',
  keywords: 'Electronics Store in Alandi, Mobile Store in Alandi, Samsung Dealer Alandi, Haier Dealer Alandi, TV Store Alandi, Laptop Store Alandi, Home Appliances Alandi',
  openGraph: {
    title: 'Hariom Electronics | Trusted Since 1988',
    description: 'Your trusted multi-brand electronics and home appliance store in Alandi.',
    type: 'website',
    locale: 'en_IN',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Hanken Grotesk — Stitch design system font */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/logo-icon.png" />
        <link rel="apple-touch-icon" href="/logo-icon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ElectronicsStore',
              name: 'Hariom Electronics',
              description: 'Multi-brand electronics and home appliance retailer serving Alandi since 1988.',
              foundingDate: '1988',
              areaServed: 'Alandi, Maharashtra, India',
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'Shree Krishna Complex, Alandi Road',
                addressLocality: 'Alandi',
                addressRegion: 'Maharashtra',
                postalCode: '412105',
                addressCountry: 'IN',
              },
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: '+91-9876543210',
                contactType: 'customer service',
              },
              url: 'https://hariomwebsite.vercel.app',
            }),
          }}
        />
      </head>
      <body>
        <LanguageProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <WhatsAppButton />
        </LanguageProvider>
      </body>
    </html>
  )
}
