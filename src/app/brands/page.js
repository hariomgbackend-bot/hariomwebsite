'use client'

import { useState } from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import brands from '@/data/brands'

function BrandCard({ brand }) {
  const [failed, setFailed] = useState(false)

  return (
    <div className="bg-white rounded-xl p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-200 border border-gray-100 group">
      <div className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-4 bg-gray-50 p-3">
        {failed ? (
          <span className="text-xl font-bold text-brand-600">{brand.name.slice(0, 2).toUpperCase()}</span>
        ) : (
          <img
            src={`https://logo.clearbit.com/${brand.domain}`}
            alt={brand.name}
            className="max-w-full max-h-full object-contain"
            onError={() => setFailed(true)}
          />
        )}
      </div>
      <h3 className="font-semibold text-gray-800">{brand.name}</h3>
      <p className="text-xs text-gray-500 mt-1">{brand.description}</p>
    </div>
  )
}

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
              <BrandCard key={brand.id} brand={brand} />
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
