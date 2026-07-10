'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import { getActivePromotions, staticOffers } from '@/lib/offers'

const colorMap = {
  accent: 'bg-accent-500',
  brand: 'bg-brand-600',
}

export default function OffersPage() {
  var { lang, t } = useTranslation()
  var [promotions, setPromotions] = useState([])
  var [loading, setLoading] = useState(true)

  useEffect(function () {
    getActivePromotions().then(function (results) {
      setPromotions(results)
      setLoading(false)
    }).catch(function () { setLoading(false) })
  }, [])

  var liveOffers = promotions.length > 0 ? promotions : staticOffers.current

  function renderOfferCard(offer) {
    return (
      <div key={offer.id} className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
        {offer.badge && (
          <span className={'inline-block px-2.5 py-1 rounded text-xs font-bold text-white mb-3 ' + (colorMap[offer.color] || 'bg-brand-600')}>
            {offer.badge}
          </span>
        )}
        <h3 className="font-semibold text-gray-800 mb-2">
          {lang === 'hi' ? (offer.titleHi || offer.title) : lang === 'mr' ? (offer.titleMr || offer.title) : offer.title}
        </h3>
        <p className="text-sm text-gray-600">{offer.description}</p>
        {offer.validTill && <p className="text-xs text-accent-500 mt-3 font-medium">Valid till: {offer.validTill}</p>}
      </div>
    )
  }

  return (
    <>
      <section className="bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 py-16 md:py-24">
        <div className="container-custom text-center">
          <span className="inline-block px-4 py-1.5 bg-accent-500/20 text-accent-400 text-xs md:text-sm font-semibold rounded-full mb-4">
            {t('offers.heading')}
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">{t('offers.heading')}</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">{t('offers.subheading')}</p>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container-custom space-y-12">
          {loading ? (
            <div className="text-center py-16">
              <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-400">Loading offers...</p>
            </div>
          ) : (
            <>
              <div>
                <h2 className="text-2xl font-bold text-brand-800 mb-6">{t('offers.currentOffers')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {liveOffers.length > 0 ? liveOffers.map(renderOfferCard) : (
                    <p className="text-gray-400 col-span-full text-center py-8">No active promotions right now</p>
                  )}
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-brand-800 mb-6">{t('offers.emiSchemes')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {staticOffers.emi.map(function (item) {
                    return (
                      <div key={item.id} className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow text-center">
                        <div className="w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg className="w-6 h-6 text-accent-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <h3 className="font-semibold text-gray-800 mb-2">{item.title}</h3>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-brand-800 mb-6">{t('offers.exchangePrograms')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {staticOffers.exchange.map(function (item) {
                    return (
                      <div key={item.id} className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                        <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center mb-3">
                          <svg className="w-5 h-5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        </div>
                        <h3 className="font-semibold text-gray-800 mb-2">{item.title}</h3>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            </>
          )}

          <div className="text-center py-8">
            <a
              href={'https://wa.me/918177896218?text=' + encodeURIComponent('Hi! I want to know about the best prices and offers.')}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-accent px-8 py-3"
            >
              {t('offers.contactForPrice')}
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
