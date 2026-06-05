'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import { getActivePromotions, staticOffers } from '@/lib/offers'

const colorMap = {
  accent: 'bg-accent-500 hover:bg-accent-600',
  brand: 'bg-brand-600 hover:bg-brand-700',
}

export default function OffersCarousel() {
  var { lang, t } = useTranslation()
  var [promotions, setPromotions] = useState([])
  var [loading, setLoading] = useState(true)

  useEffect(function () {
    getActivePromotions().then(function (results) {
      setPromotions(results)
      setLoading(false)
    })
  }, [])

  var displayOffers = promotions.length > 0 ? promotions.slice(0, 4) : staticOffers.current.slice(0, 4)

  return (
    <section className="py-12 md:py-16 bg-gradient-to-br from-brand-800 to-brand-900">
      <div className="container-custom">
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">{t('offers.heading')}</h2>
          <p className="text-base md:text-lg text-gray-300 mt-2">{t('offers.subheading')}</p>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-3 border-white/20 border-t-white rounded-full animate-spin mx-auto"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {displayOffers.map(function (offer) {
              return (
                <div
                  key={offer.id}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10 hover:bg-white/20 transition-all duration-200"
                >
                  <span className={'inline-block px-2.5 py-1 rounded text-xs font-bold text-white mb-3 ' + (colorMap[offer.color] || 'bg-brand-600')}>
                    {offer.badge}
                  </span>
                  <h3 className="text-white font-semibold text-sm md:text-base mb-2">
                    {lang === 'hi' ? (offer.titleHi || offer.title) : lang === 'mr' ? (offer.titleMr || offer.title) : offer.title}
                  </h3>
                  <p className="text-gray-300 text-xs md:text-sm">{offer.description}</p>
                  {offer.validTill && <p className="text-accent-400 text-xs mt-3 font-medium">Valid till: {offer.validTill}</p>}
                </div>
              )
            })}
          </div>
        )}

        <div className="text-center mt-6">
          <p className="text-gray-400 text-sm">
            {lang === 'hi' ? 'सर्व ऑफर देखने के लिए' : lang === 'mr' ? 'सर्व ऑफर पाहण्यासाठी' : 'To see all offers'}{' '}
            <a href="/offers" className="text-accent-400 hover:text-accent-300 underline">
              {lang === 'hi' ? 'यहां क्लिक करें' : lang === 'mr' ? 'येथे क्लिक करा' : 'click here'}
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
