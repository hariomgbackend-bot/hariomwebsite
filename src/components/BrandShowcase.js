'use client'

import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'
import brands from '@/data/brands'

export default function BrandShowcase() {
  const { t } = useTranslation()

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container-custom">
        <div className="text-center mb-8 md:mb-10">
          <h2 className="section-title">{t('brands.heading')}</h2>
          <p className="section-subtitle">{t('brands.subheading')}</p>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-3 md:gap-4">
          {brands.map((brand) => (
            <div
              key={brand.id}
              className="bg-gray-50 rounded-xl p-4 flex flex-col items-center justify-center text-center hover:shadow-md hover:bg-white transition-all duration-200 group border border-gray-100"
            >
              <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center mb-2 group-hover:bg-brand-600 transition-colors">
                <span className="text-brand-600 font-bold text-xs group-hover:text-white transition-colors">
                  {brand.name.slice(0, 2).toUpperCase()}
                </span>
              </div>
              <span className="text-xs font-semibold text-gray-700 group-hover:text-brand-600 transition-colors">{brand.name}</span>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link href="/brands" className="text-sm text-brand-600 hover:text-accent-500 font-medium transition-colors">
            {t('brands.heading')} &rarr;
          </Link>
        </div>
      </div>
    </section>
  )
}
