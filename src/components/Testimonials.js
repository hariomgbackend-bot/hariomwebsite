'use client'

import { useState, useEffect, useRef } from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import { getGoogleReviews } from '@/lib/reviews'
import fallbackReviews from '@/data/testimonials'
import ReviewCard, { StarRating } from '@/components/ReviewCard'

function getLocalized(review, lang) {
  return {
    name: lang === 'hi' ? (review.nameHi || review.name) : lang === 'mr' ? (review.nameMr || review.name) : review.name,
    role: review.location || '',
    text: lang === 'hi' ? (review.textHi || review.text) : lang === 'mr' ? (review.textMr || review.text) : review.text,
    rating: review.rating
  }
}

export default function Testimonials() {
  const { t, lang } = useTranslation()
  const [googleReviews, setGoogleReviews] = useState([])
  const [aggregate, setAggregate] = useState(null)
  const [mapsUri, setMapsUri] = useState('')
  const scrollRef = useRef(null)

  useEffect(function () {
    var cancelled = false
    getGoogleReviews().then(function (stores) {
      if (cancelled) return
      var reviews = []
      var ratingWeighted = 0
      var countTotal = 0
      var maps = ''
      stores.forEach(function (s) {
        if (!maps && s.mapsUri) maps = s.mapsUri
        if (s.count) {
          ratingWeighted += (s.rating || 0) * s.count
          countTotal += s.count
        }
        ;(s.reviews || []).forEach(function (r) {
          reviews.push({
            name: r.author,
            role: 'Google Review',
            avatar: r.authorPhoto,
            rating: r.rating,
            text: r.text,
            relativeTime: r.relativeTime,
            sourceUrl: r.authorUri || ''
          })
        })
      })
      setGoogleReviews(reviews)
      if (countTotal) setAggregate({ rating: ratingWeighted / countTotal, count: countTotal })
      setMapsUri(maps)
    }).catch(function () {})
    return function () { cancelled = true }
  }, [])

  var items = googleReviews.length
    ? googleReviews
    : fallbackReviews.map(function (r) { return getLocalized(r, lang) })

  var isRtl = lang === 'he'
  var showGoogleBadge = googleReviews.length > 0 && aggregate

  return (
    <section className="py-14 md:py-20 bg-[#F4F6FB] overflow-hidden">
      <div className="container-custom">
        <div className="text-center mb-8 md:mb-10">
          <span className="section-badge">Reviews</span>
          <h2 className="section-title font-heading">{t('about.testimonialsHeading')}</h2>
          {showGoogleBadge && (
            <div className="mt-5 inline-flex items-center gap-3 bg-white rounded-full px-4 py-2 shadow-sm border border-gray-100">
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm text-[#1b1b1d]">{aggregate.rating.toFixed(1)}</span>
                  <StarRating rating={Math.round(aggregate.rating)} />
                </div>
                <p className="text-xs text-gray-400">{aggregate.count.toLocaleString('en-IN')} Google reviews</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="relative">
        <div className="overflow-hidden">
          <div
            ref={scrollRef}
            className="flex gap-4 md:gap-6 animate-marquee"
            style={{ animationDirection: isRtl ? 'reverse' : 'normal' }}
          >
            {[...items, ...items, ...items].map(function (item, i) {
              return <ReviewCard key={i} {...item} className="flex-shrink-0 w-[280px] md:w-[340px]" />
            })}
          </div>
        </div>
      </div>

      {showGoogleBadge && mapsUri && (
        <div className="text-center mt-6">
          <a
            href={mapsUri}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#FF5E1A] transition-colors"
          >
            Powered by Google
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      )}
    </section>
  )
}
