'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'
import staticOffers from '@/data/offers'

const badgeColors = {
  SALE: 'bg-green-500',
  EXCHANGE: 'bg-blue-500',
  EMI: 'bg-purple-500',
  COMBO: 'bg-pink-500',
  STUDENT: 'bg-amber-500',
  FREE: 'bg-teal-500',
}

export default function OffersCarousel() {
  const { t } = useTranslation()
  const [offers] = useState([...(staticOffers.current || []), ...(staticOffers.exchange || []), ...(staticOffers.emi || [])])

  if (!offers.length) {
    return (
      <section className="py-14 md:py-20 bg-white">
        <div className="container-custom text-center">
          <span className="section-badge">Offers</span>
          <h2 className="section-title font-heading">{t('offers.heading')}</h2>
          <p className="text-gray-400 mt-4">No offers available right now</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-14 md:py-20 bg-white overflow-hidden">
      <div className="container-custom">
        <div className="text-center mb-10 md:mb-12">
          <span className="section-badge">Offers</span>
          <h2 className="section-title font-heading">{t('offers.heading')}</h2>
        </div>
      </div>

      <div className="overflow-hidden">
        <div className="flex gap-4 md:gap-5 animate-marquee">
          {[...offers, ...offers, ...offers].map((offer, i) => (
            <div
              key={`${offer.id}-${i}`}
              className="flex-shrink-0 w-[260px] md:w-[300px] bg-gradient-to-br from-[#0B1F4B] to-[#122b63] rounded-2xl p-5 md:p-6 shadow-[0_8px_32px_rgba(11,31,75,0.15)] hover:shadow-[0_12px_40px_rgba(255,94,26,0.2)] transition-all duration-300 hover:-translate-y-1"
            >
              <span className={`inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white rounded-md mb-3 ${badgeColors[offer.badge] || 'bg-[#FF5E1A]'}`}>
                {offer.badge || 'Offer'}
              </span>
              <h3 className="text-white font-bold text-sm md:text-base leading-snug mb-2 line-clamp-2">
                {offer.title}
              </h3>
              <p className="text-white/60 text-xs md:text-sm leading-relaxed line-clamp-2">
                {offer.description}
              </p>
              {offer.validTill && (
                <p className="text-[#FF5E1A] text-[10px] font-semibold mt-3 uppercase tracking-wider">
                  Valid: {offer.validTill}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
