'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'

export default function OffersCarousel() {
  const { t } = useTranslation()
  const [offers, setOffers] = useState([])
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/offers`)
      .then((res) => res.json())
      .then(setOffers)
      .catch(() => {})
  }, [])

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % offers.length)
  }, [offers.length])

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + offers.length) % offers.length)
  }, [offers.length])

  useEffect(() => {
    if (offers.length < 2) return
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [offers.length, next])

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

  const offer = offers[current]

  return (
    <section className="py-14 md:py-20 bg-white">
      <div className="container-custom">
        <div className="text-center mb-10 md:mb-12">
          <span className="section-badge">Offers</span>
          <h2 className="section-title font-heading">{t('offers.heading')}</h2>
        </div>

        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FF5E1A] to-[#e04a0e] shadow-[0_12px_40px_rgba(255,94,26,0.25)]">
          <div className="flex flex-col md:flex-row">
            <div className="flex-1 p-8 md:p-12 lg:p-16 flex flex-col justify-center text-white">
              <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider bg-white/20 rounded-full mb-4 w-fit">
                {offer.badge || 'Special Offer'}
              </span>
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold font-heading mb-3 leading-tight">
                {offer.title}
              </h3>
              <p className="text-base md:text-lg text-white/80 mb-6 max-w-md">
                {offer.description}
              </p>
              {offer.ctaText && (
                <Link
                  href={offer.ctaLink || '/'}
                  className="inline-flex items-center w-fit px-6 py-3 bg-white text-[#FF5E1A] font-bold rounded-xl hover:shadow-[0_4px_20px_rgba(255,255,255,0.3)] transition-all hover:-translate-y-0.5"
                >
                  {offer.ctaText}
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              )}
            </div>
            {offer.image && (
              <div className="md:w-[380px] lg:w-[460px] relative min-h-[220px] md:min-h-full">
                <Image
                  src={offer.image}
                  alt={offer.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 460px"
                />
              </div>
            )}
          </div>

          {offers.length > 1 && (
            <div className="flex items-center justify-between px-6 pb-5 md:absolute md:bottom-6 md:left-8 md:pb-0 z-10">
              <div className="flex gap-2">
                {offers.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === current ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'
                    }`}
                  />
                ))}
              </div>
              <div className="flex gap-2 md:hidden">
                <button onClick={prev} className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button onClick={next} className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
