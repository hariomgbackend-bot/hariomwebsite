'use client'

import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'
import Timeline from '@/components/Timeline'

export default function AboutPage() {
  const { t } = useTranslation()

  return (
    <>
      <section className="bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 py-16 md:py-24">
        <div className="container-custom text-center">
          <span className="inline-block px-4 py-1.5 bg-accent-500/20 text-accent-400 text-xs md:text-sm font-semibold rounded-full mb-4">
            {t('tagline')}
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">{t('about.heading')}</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">{t('about.subheading')}</p>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <h2 className="section-title text-center mb-8">{t('about.heading')}</h2>
            <p className="text-gray-700 text-center mb-12 text-lg leading-relaxed">
              From J.K. Electronics in 1988 to Hari Om Electronics today, we have been serving the 
              people of Alandi with genuine products, competitive prices, and exceptional service. 
              What started as a small electronics shop has grown into a trusted multi-brand retail 
              destination with three stores.
            </p>
          </div>

          <Timeline />

          <div className="max-w-2xl mx-auto mt-12 bg-white rounded-xl p-8 shadow-sm text-center border border-gray-100">
            <h3 className="text-xl font-bold text-brand-800 mb-3">{t('about.mission')}</h3>
            <p className="text-gray-600 leading-relaxed">{t('about.missionText')}</p>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-white">
        <div className="container-custom text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-brand-800 mb-6">Our Commitment</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { title: 'Genuine Products', desc: '100% authentic products directly from brands and authorized distributors.' },
              { title: 'Best Prices', desc: 'Competitive pricing with price match guarantee and special offers.' },
              { title: 'Customer First', desc: 'Personalized service, expert advice, and ongoing support for every customer.' },
            ].map((item) => (
              <div key={item.title} className="p-6 rounded-xl bg-gray-50 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-brand-700 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-brand-600">
        <div className="container-custom text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Ready to find the perfect product?</h2>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/products" className="btn-accent">Explore Products</Link>
            <Link href="/stores" className="btn-outline-light">Visit Our Stores</Link>
          </div>
        </div>
      </section>
    </>
  )
}
