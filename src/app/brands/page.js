'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import { getAllBrands } from '@/lib/brands'
import staticBrands from '@/data/brands'

function BrandCard({ brand }) {
  var [failed, setFailed] = useState(false)

  var card = (
    <div className="bg-white rounded-xl p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-200 border border-gray-100 group cursor-default">
      <div className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-4 bg-gray-50 p-3">
        {failed ? (
          <span className="text-xl font-bold text-[#FF5E1A]">{brand.name.slice(0, 2).toUpperCase()}</span>
        ) : (
          <img
            src={brand.image || ('https://cdn.brandfetch.io/' + (brand.domain || brand.name.toLowerCase() + '.com'))}
            alt={brand.name}
            className="max-w-full max-h-full object-contain"
            onError={function () { setFailed(true) }}
          />
        )}
      </div>
      <h3 className="font-semibold text-gray-800">{brand.name}</h3>
      {brand.description && <p className="text-xs text-gray-500 mt-1">{brand.description}</p>}
    </div>
  )

  if (brand.link) {
    return <a href={brand.link} target="_blank" rel="noopener noreferrer">{card}</a>
  }

  return card
}

export default function BrandsPage() {
  var { t } = useTranslation()
  var [brands, setBrands] = useState(staticBrands)

  useEffect(function () {
    getAllBrands().then(function (data) {
      if (data && data.length) setBrands(data)
    })
  }, [])

  return (
    <>
      <section className="bg-gradient-to-br from-[#0B1F4B] via-[#0B1F4B] to-[#071035] py-16 md:py-24">
        <div className="container-custom text-center">
          <span className="inline-block px-4 py-1.5 bg-[#FF5E1A]/20 text-[#FF5E1A] text-xs md:text-sm font-semibold rounded-full mb-4">
            {t('brands.heading')}
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">{t('brands.heading')}</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">{t('brands.subheading')}</p>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container-custom">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {brands.map(function (brand) {
              return <BrandCard key={brand.id || brand.name} brand={brand} />
            })}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-white">
        <div className="container-custom text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-[#0B1F4B] mb-4">Authorized Dealer & Service Partner</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Hari Om Electronics is an authorized dealer for all major brands. We source directly from 
            manufacturers and authorized distributors, ensuring you get 100% genuine products with 
            full warranty coverage.
          </p>
          <p className="text-sm text-[#FF5E1A] font-medium">
            * Not all brands may be available at all store locations. Please contact your nearest store for availability.
          </p>
        </div>
      </section>
    </>
  )
}
