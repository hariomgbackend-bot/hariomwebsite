'use client'

import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'
import categories from '@/data/categories'

const icons = {
  tv: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  ac: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4',
  fridge: 'M5 5a2 2 0 012-2h10a2 2 0 012 2v16a2 2 0 01-2 2H7a2 2 0 01-2-2V5zm5 4h4m-4 4h4',
  washing: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2zm0 0l2 3h14l2-3M8 17a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z',
  mobile: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z',
  tablet: 'M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z',
  laptop: 'M10 6h4v4h-4V6zm0 6h4v4h-4v-4zm-2 6h12a2 2 0 002-2V8a2 2 0 00-2-2H8a2 2 0 00-2 2v8a2 2 0 002 2z',
  audio: 'M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z',
  kitchen: 'M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12',
  industrial: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
  flour: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4',
  small: 'M12 6v6m0 0v6m0-6h6m-6 0H6',
}

export default function CategoryGrid() {
  const { lang, t } = useTranslation()

  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-8 md:mb-10">
          <h2 className="section-title">{t('categories.heading')}</h2>
          <p className="section-subtitle">{t('categories.subheading')}</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
          {categories.slice(0, 12).map((cat) => {
            const catName = lang === 'hi' ? cat.nameHi : lang === 'mr' ? cat.nameMr : cat.name
            const catDesc = lang === 'hi' ? cat.descriptionHi : lang === 'mr' ? cat.descriptionMr : cat.description
            return (
              <Link
                key={cat.id}
                href={`/products/${cat.id}`}
                className="group bg-white rounded-xl p-4 md:p-5 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-200 border border-gray-100"
              >
                <div className="w-12 h-12 mx-auto bg-brand-50 text-brand-600 rounded-xl flex items-center justify-center mb-3 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icons[cat.icon] || icons.small} />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-gray-800 group-hover:text-brand-600 transition-colors">{catName}</h3>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{catDesc}</p>
              </Link>
            )
          })}
        </div>

        <div className="text-center mt-8">
          <Link href="/products/televisions" className="btn-outline text-sm">
            {t('categories.viewAll')}
          </Link>
        </div>
      </div>
    </section>
  )
}
