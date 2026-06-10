'use client'

import { useTranslation } from '@/hooks/useTranslation'
import stores from '@/data/stores'
import StoreCard from '@/components/StoreCard'

export default function StoresPage() {
  const { lang, t } = useTranslation()

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map(function (store) {
              var storeName = lang === 'hi' ? (store.nameHi || store.name) : lang === 'mr' ? (store.nameMr || store.name) : store.name
              return (
                <div key={store.id} className="flex flex-col h-full">
                  <h3 className="text-lg font-bold text-brand-800 mb-3">{storeName}</h3>
                  <div className="flex-1 rounded-xl overflow-hidden shadow-md border border-gray-200">
                    <iframe
                      src={`https://maps.google.com/maps?q=${store.coordinates.lat},${store.coordinates.lng}&z=15&output=embed`}
                      width="100%"
                      height="100%"
                      style={{ border: 0, minHeight: '220px' }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={storeName}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-12 bg-brand-600">
        <div className="container-custom text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Have Questions?</h2>
          <p className="text-gray-200 mb-6">Call or WhatsApp us for quick assistance</p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="tel:+918177896218" className="btn-accent">Call Now</a>
            <a
              href="https://wa.me/918177896218"
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
