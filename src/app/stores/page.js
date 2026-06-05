'use client'

import { useTranslation } from '@/hooks/useTranslation'
import stores from '@/data/stores'
import StoreCard from '@/components/StoreCard'

export default function StoresPage() {
  const { t } = useTranslation()

  return (
    <>
      <section className="bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 py-16 md:py-24">
        <div className="container-custom text-center">
          <span className="inline-block px-4 py-1.5 bg-accent-500/20 text-accent-400 text-xs md:text-sm font-semibold rounded-full mb-4">
            {t('tagline')}
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">{t('stores.heading')}</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">{t('stores.subheading')}</p>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {stores.map((store) => (
              <StoreCard key={store.id} store={store} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-white">
        <div className="container-custom">
          <h2 className="text-2xl font-bold text-brand-800 text-center mb-8">Store Locations</h2>
          <div className="aspect-[21/9] bg-gray-100 rounded-xl overflow-hidden">
            <div className="w-full h-full flex items-center justify-center bg-gray-50">
              <div className="text-center p-8">
                <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                <p className="text-gray-500">Google Maps integration will appear here</p>
                <p className="text-xs text-gray-400 mt-2">Add your Google Maps API key to display interactive maps</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-brand-600">
        <div className="container-custom text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Have Questions?</h2>
          <p className="text-gray-200 mb-6">Call or WhatsApp us for quick assistance</p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="tel:+919876543210" className="btn-accent">Call Now</a>
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline-light"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
