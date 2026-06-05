'use client'

import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'

export default function ServicesPage() {
  const { t } = useTranslation()

  const services = [
    { key: 'emi', color: 'bg-blue-100 text-blue-600', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { key: 'delivery', color: 'bg-green-100 text-green-600', icon: 'M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2-1m4 0l2 1m0 0l2-1m-2 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1v-1m12-2V9l4-1v6M5 18h14a2 2 0 002-2v-2M5 18H3' },
    { key: 'installation', color: 'bg-purple-100 text-purple-600', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
    { key: 'exchange', color: 'bg-orange-100 text-orange-600', icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' },
    { key: 'warranty', color: 'bg-teal-100 text-teal-600', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
  ]

  return (
    <>
      <section className="bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 py-16 md:py-24">
        <div className="container-custom text-center">
          <span className="inline-block px-4 py-1.5 bg-accent-500/20 text-accent-400 text-xs md:text-sm font-semibold rounded-full mb-4">
            {t('tagline')}
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">{t('services.heading')}</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">{t('services.subheading')}</p>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div key={service.key} className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow group">
                <div className={`w-14 h-14 ${service.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={service.icon} />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{t(`services.${service.key}`)}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{t(`services.${service.key}Desc`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-white">
        <div className="container-custom text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-brand-800 mb-4">Need Assistance?</h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            Our customer service team is here to help. Call, WhatsApp, or visit any of our stores.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/contact" className="btn-primary">{t('contact.heading')}</Link>
            <a href="tel:+919876543210" className="btn-outline">{t('contact.call')}</a>
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-accent"
            >
              {t('contact.whatsapp')}
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
