'use client'

import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'

export default function CommercialPage() {
  const { t } = useTranslation()

  const sectors = [
    { icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4', label: 'Hotels' },
    { icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4', label: 'Restaurants' },
    { icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', label: 'Offices' },
    { icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4', label: 'Institutions' },
    { icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', label: 'Builders' },
    { icon: 'M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z', label: 'Industrial Kitchens' },
  ]

  return (
    <>
      <section className="bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 py-16 md:py-24">
        <div className="container-custom text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">{t('commercial.heading')}</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">{t('commercial.subheading')}</p>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-100 text-accent-700 rounded-full text-sm font-semibold mb-6">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              {t('commercial.comingSoon')}
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-brand-800 mb-4">{t('commercial.heading')}</h2>
            <p className="text-gray-600 text-lg">{t('commercial.description')}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
            {sectors.map((sector) => (
              <div key={sector.label} className="bg-white rounded-xl p-6 text-center border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={sector.icon} />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700">{sector.label}</span>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-8 md:p-12 border border-gray-100 text-center max-w-3xl mx-auto">
            <h3 className="text-xl font-bold text-brand-800 mb-4">Interested in Bulk Procurement?</h3>
            <p className="text-gray-600 mb-6">
              We are currently building our commercial solutions division. If you&apos;re a business looking 
              for bulk electronics procurement, please reach out to us and we&apos;ll get back to you.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/contact" className="btn-primary">Contact Us</Link>
              <a
                href="https://wa.me/918177896218?text=Hi! I'm interested in commercial solutions for bulk procurement."
                target="_blank"
                rel="noopener noreferrer"
                className="btn-accent"
              >
                Enquire on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
