'use client'

import { useTranslation } from '@/hooks/useTranslation'
import brands from '@/data/brands'

export default function BrandsPage() {
  const { t } = useTranslation()

  return (
    <>
      <section className="bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 py-16 md:py-24">
        <div className="container-custom text-center">
          <span className="inline-block px-4 py-1.5 bg-accent-500/20 text-accent-400 text-xs md:text-sm font-semibold rounded-full mb-4">
            {t('brands.heading')}
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">{t('brands.heading')}</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">{t('brands.subheading')}</p>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container-custom">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {brands.map((brand) => (
              <div
                key={brand.id}
                className="bg-white rounded-xl p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-200 border border-gray-100 group"
              >
                <div className="w-16 h-16 mx-auto bg-brand-50 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-brand-600 transition-colors">
                  <span className="text-xl font-bold text-brand-600 group-hover:text-white transition-colors">
                    {brand.name.slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-800 group-hover:text-brand-600 transition-colors">{brand.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{brand.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-white">
        <div className="container-custom text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-brand-800 mb-4">Authorized Dealer & Service Partner</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Hari Om Electronics is an authorized dealer for all major brands. We source directly from 
            manufacturers and authorized distributors, ensuring you get 100% genuine products with 
            full warranty coverage.
          </p>
          <p className="text-sm text-accent-500 font-medium">
            * Not all brands may be available at all store locations. Please contact your nearest store for availability.
          </p>
        </div>
      </section>
    </>
  )
}
