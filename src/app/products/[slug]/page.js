'use client'

import { useParams, notFound } from 'next/navigation'
import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'
import categories from '@/data/categories'
import products from '@/data/products'

const iconPaths = {
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

export default function CategoryPage() {
  const params = useParams()
  const { lang, t } = useTranslation()

  const category = categories.find((c) => c.id === params.slug)
  if (!category) return notFound()

  const catName = lang === 'hi' ? category.nameHi : lang === 'mr' ? category.nameMr : category.name
  const catDesc = lang === 'hi' ? category.descriptionHi : lang === 'mr' ? category.descriptionMr : category.description
  const categoryProducts = products.filter((p) => p.category === category.id)

  return (
    <>
      <section className="bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 py-16 md:py-24">
        <div className="container-custom">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/" className="text-gray-400 hover:text-accent-400 text-sm transition-colors">{t('nav.home')}</Link>
            <span className="text-gray-500 text-sm">/</span>
            <span className="text-gray-300 text-sm">{catName}</span>
          </div>
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">{catName}</h1>
            <p className="text-lg text-gray-300">{catDesc}</p>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container-custom">
          <div className="flex flex-wrap gap-2 mb-8">
            {category.brands.map((brand) => (
              <span key={brand} className="px-3 py-1.5 bg-white text-sm font-medium text-brand-600 rounded-lg border border-brand-200">
                {brand}
              </span>
            ))}
          </div>

          {categoryProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow group">
                  <div className="aspect-[4/3] bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center p-8">
                    <div className="w-20 h-20 bg-brand-600/10 rounded-full flex items-center justify-center">
                      <span className="text-3xl font-bold text-brand-600">{product.brand[0]}</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <span className="text-xs font-medium text-accent-500 uppercase">{product.brand}</span>
                    <h3 className="text-base font-semibold text-gray-800 mt-1 group-hover:text-brand-600 transition-colors">{product.name}</h3>
                    <p className="text-lg font-bold text-brand-800 mt-2">{product.price}</p>
                    <div className="flex gap-2 mt-4">
                      <button className="btn-primary text-xs px-4 py-2 flex-1 text-center">Enquire Now</button>
                      <a
                        href={`https://wa.me/919876543210?text=${encodeURIComponent(`Hi! I'm interested in ${product.name}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-accent text-xs px-4 py-2 flex-1 text-center"
                      >
                        WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d={iconPaths[category.icon] || 'M12 6v6m0 0v6m0-6h6m-6 0H6'} />
              </svg>
              <h3 className="text-xl font-semibold text-gray-500 mb-2">Products Coming Soon</h3>
              <p className="text-gray-400 mb-6">We are updating our catalog. Contact us for the latest products and prices.</p>
              <div className="flex gap-3 justify-center">
                <a href="/contact" className="btn-primary">Contact Us</a>
                <a
                  href={`https://wa.me/919876543210?text=${encodeURIComponent(`Hi! I'm looking for ${catName}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-accent"
                >
                  Enquire on WhatsApp
                </a>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container-custom text-center">
          <h2 className="text-2xl font-bold text-brand-800 mb-4">Looking for something specific?</h2>
          <p className="text-gray-600 mb-6">Contact us for personalized recommendations and the best prices.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/contact" className="btn-primary">Get in Touch</Link>
            <a
              href={`https://wa.me/919876543210?text=${encodeURIComponent(`Hi! I have a query about ${catName}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-accent"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
