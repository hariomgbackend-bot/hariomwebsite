'use client'

import { useState, useEffect, useRef } from 'react'
import { useTranslation } from '@/hooks/useTranslation'

const defaultTestimonials = [
  {
    name: 'Sarah M.',
    role: 'Verified Buyer',
    text: 'The AC installation was seamless. The team was professional and finished within 2 hours. Highly recommend!',
    rating: 5,
  },
  {
    name: 'Ahmed R.',
    role: 'Verified Buyer',
    text: 'Best prices in town! Got my split AC delivered and installed the same day. Amazing service.',
    rating: 5,
  },
  {
    name: 'Fatima K.',
    role: 'Verified Buyer',
    text: 'I was worried about buying electronics online, but FCP made it easy. Genuine products with warranty.',
    rating: 5,
  },
  {
    name: 'Omar H.',
    role: 'Verified Buyer',
    text: 'EMI option made it affordable to get a new fridge. Delivery was on time and well-packaged.',
    rating: 4,
  },
  {
    name: 'Layla N.',
    role: 'Verified Buyer',
    text: 'The exchange offer was incredible! Got great value for my old AC. Very happy with the purchase.',
    rating: 5,
  },
  {
    name: 'Yusuf A.',
    role: 'Verified Buyer',
    text: 'Professional team, excellent customer support, and the best warranty options. My go-to store now.',
    rating: 5,
  },
]

function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-4 h-4 ${star <= rating ? 'text-[#FF5E1A]' : 'text-gray-200'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export default function Testimonials() {
  const { t, locale } = useTranslation()
  const [testimonials, setTestimonials] = useState(defaultTestimonials)
  const [storedReviews, setStoredReviews] = useState([])
  const scrollRef = useRef(null)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('fc_reviews')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length) {
          setStoredReviews(parsed)
        }
      }
    } catch {
      // ignore
    }
  }, [])

  const allReviews =
    storedReviews.length
      ? [...storedReviews.map((r) => ({ name: r.name || 'Anonymous', role: 'Customer', text: r.review, rating: r.rating })), ...testimonials]
      : testimonials

  const isRtl = locale === 'he'

  return (
    <section className="py-14 md:py-20 bg-[#F4F6FB] overflow-hidden">
      <div className="container-custom">
        <div className="text-center mb-10 md:mb-12">
          <span className="section-badge">Reviews</span>
          <h2 className="section-title font-heading">{t('about.testimonialsHeading')}</h2>
        </div>
      </div>

      <div className="relative">
        <div className="overflow-hidden">
          <div
            ref={scrollRef}
            className="flex gap-4 md:gap-6 animate-marquee"
            style={{ animationDirection: isRtl ? 'reverse' : 'normal' }}
          >
            {[...allReviews, ...allReviews, ...allReviews].map((item, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-[280px] md:w-[340px] bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-gray-100 hover:shadow-[0_8px_32px_rgba(255,94,26,0.1)] transition-shadow duration-300"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#FF5E1A] to-[#e04a0e] flex items-center justify-center text-white font-bold text-sm">
                    {item.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#1b1b1d]">{item.name}</h4>
                    <p className="text-xs text-gray-400">{item.role}</p>
                  </div>
                </div>
                <StarRating rating={item.rating} />
                <p className="text-sm text-gray-500 mt-3 leading-relaxed line-clamp-3">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
