'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'
import { getAllBrands } from '@/lib/brands'
import staticBrands from '@/data/brands'

const palette = [
  'bg-blue-50 text-blue-700 border-blue-100',
  'bg-rose-50 text-rose-700 border-rose-100',
  'bg-violet-50 text-violet-700 border-violet-100',
  'bg-amber-50 text-amber-700 border-amber-100',
  'bg-teal-50 text-teal-700 border-teal-100',
  'bg-orange-50 text-orange-700 border-orange-100',
  'bg-cyan-50 text-cyan-700 border-cyan-100',
  'bg-emerald-50 text-emerald-700 border-emerald-100',
  'bg-pink-50 text-pink-700 border-pink-100',
]

function BrandLogo({ brand, color }) {
  var [src, setSrc] = useState(brand.image || ('https://cdn.brandfetch.io/' + (brand.domain || brand.name.toLowerCase().replace(/\s+/g, '') + '.com')))
  var [failed, setFailed] = useState(false)
  var [usedFallback, setUsedFallback] = useState(false)

  function handleError() {
    if (!usedFallback) {
      setUsedFallback(true)
      setSrc('https://cdn.brandfetch.io/' + (brand.domain || brand.name.toLowerCase().replace(/\s+/g, '') + '.com'))
    } else {
      setFailed(true)
    }
  }

  var content = (
    <div className={'rounded-2xl border p-4 flex flex-col items-center justify-center text-center hover:shadow-md transition-all duration-200 group cursor-default ' + (failed ? color : 'bg-white border-gray-100 hover:border-gray-200')}>
      {failed ? (
        <>
          <div className="w-11 h-11 rounded-full border-2 border-current border-opacity-20 flex items-center justify-center mb-2 text-lg font-bold">
            {brand.name.slice(0, 2).toUpperCase()}
          </div>
          <span className="text-[11px] font-bold leading-tight">{brand.name}</span>
        </>
      ) : (
        <>
          <div className="w-full aspect-[3/2] flex items-center justify-center p-2">
            <img src={src} alt={brand.name} className="max-w-full max-h-full object-contain" onError={handleError} />
          </div>
          <span className="text-[11px] font-bold text-gray-700 leading-tight mt-1">{brand.name}</span>
        </>
      )}
    </div>
  )

  if (brand.link) {
    return <a href={brand.link} target="_blank" rel="noopener noreferrer">{content}</a>
  }
  return content
}

export default function BrandShowcase() {
  var { t } = useTranslation()
  var [brands, setBrands] = useState(staticBrands)

  useEffect(function () {
    getAllBrands().then(function (data) {
      if (data && data.length) setBrands(data)
    })
  }, [])

  return (
    <section className="py-14 md:py-20 bg-white">
      <div className="container-custom">
        <div className="text-center mb-10 md:mb-12">
          <span className="section-badge">Brands</span>
          <h2 className="section-title font-heading">{t('brands.heading')}</h2>
          <p className="section-subtitle">{t('brands.subheading')}</p>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-3 md:gap-4">
          {brands.map(function (brand, i) {
            return <BrandLogo key={brand.id || brand.name} brand={brand} color={palette[i % palette.length]} />
          })}
        </div>

        <div className="text-center mt-10">
          <Link href="/brands" className="text-sm font-semibold text-[#0B1F4B] hover:text-[#FF5E1A] transition-colors inline-flex items-center gap-1.5">
            {t('brands.heading')}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
