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
          <h2 className="text-2xl font-bold text-brand-800 text-center mb-8">Our Location</h2>
          <div className="aspect-[21/9] max-h-[450px] rounded-xl overflow-hidden shadow-lg border border-gray-200">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3779.734984036247!2d73.89676947496694!3d18.675884682447997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c8831512374f%3A0x82bee502536ab580!2sHari%20Om%20Electronics-%20Best%20Electronics%20Shop%20in%20Alandi-%20Home%20Appliances%20Showroom%20in%20Alandi%2C%20Pune!5e0!3m2!1sen!2sin!4v1780745536804!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '300px' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Hari Om Electronics - Main Store Location"
            />
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
