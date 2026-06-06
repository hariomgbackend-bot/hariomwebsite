'use client'

import { useState, useEffect, useRef } from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import testimonials from '@/data/testimonials'

var STAR = (
  <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
)

function ReviewCard({ review }) {
  var { lang } = useTranslation()
  var name = lang === 'hi' ? (review.nameHi || review.name) : lang === 'mr' ? (review.nameMr || review.name) : review.name
  var text = lang === 'hi' ? (review.textHi || review.text) : lang === 'mr' ? (review.textMr || review.text) : review.text

  return (
    <div className="w-full shrink-0 px-3" style={{ width: '100%' }}>
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100 h-full flex flex-col relative overflow-hidden">
        {/* Top gradient accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent-400 via-brand-500 to-accent-400" />

        {/* Quote icon */}
        <svg className="w-8 h-8 text-brand-100 mb-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
          <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311C9.591 11.69 11 13.131 11 15c0 1.91-1.553 3.5-3.5 3.5-1.566 0-2.694-.734-2.917-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311C19.591 11.69 21 13.131 21 15c0 1.91-1.553 3.5-3.5 3.5-1.566 0-2.694-.734-2.917-1.179z" />
        </svg>

        {/* Review text */}
        <p className="text-gray-600 text-sm md:text-base leading-relaxed flex-1 mb-6 italic">
          &ldquo;{text}&rdquo;
        </p>

        {/* Stars */}
        <div className="flex gap-0.5 text-amber-400 mb-4">
          {Array.from({ length: 5 }, function (_, i) {
            return <span key={i}>{STAR}</span>
          })}
        </div>

        {/* Author */}
        <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white text-sm font-bold shrink-0">
            {name.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate">{name}</p>
            <p className="text-xs text-gray-400">{review.location}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Testimonials() {
  var { lang, t } = useTranslation()
  var [current, setCurrent] = useState(0)
  var [isPaused, setIsPaused] = useState(false)
  var intervalRef = useRef(null)

  var itemsPerView = 3
  var totalSlides = Math.max(1, testimonials.length - itemsPerView + 1)

  useEffect(function () {
    if (isPaused) return
    intervalRef.current = setInterval(function () {
      setCurrent(function (prev) {
        return (prev + 1) % totalSlides
      })
    }, 4000)
    return function () { clearInterval(intervalRef.current) }
  }, [totalSlides, isPaused])

  function goTo(index) {
    setCurrent(index)
    clearInterval(intervalRef.current)
  }

  return (
    <section className="py-14 md:py-20 bg-gradient-to-b from-surface-container to-white relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-brand-100/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-accent-100/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <div className="container-custom relative z-10">
        <div className="text-center mb-10 md:mb-12">
          <span className="inline-block px-3 py-1 bg-accent-100 text-accent-600 text-xs font-bold rounded-full mb-3 uppercase tracking-wider">
            Google Reviews
          </span>
          <h2 className="section-title">What Our Customers Say</h2>
          <p className="section-subtitle">Real reviews from real customers across Alandi, Chakan and Pune</p>
        </div>

        {/* Carousel */}
        <div
          className="relative"
          onMouseEnter={function () { setIsPaused(true) }}
          onMouseLeave={function () { setIsPaused(false) }}
        >
          {/* Desktop: 3-column carousel */}
          <div className="hidden md:block overflow-hidden">
            <div
              className="flex transition-transform duration-700 ease-out"
              style={{ transform: 'translateX(-' + (current * (100 / itemsPerView)) + '%)' }}
            >
              {testimonials.map(function (review) {
                return (
                  <div key={review.id} className="min-w-[33.333%] px-3">
                    <ReviewCard review={review} />
                  </div>
                )
              })}
            </div>
          </div>

          {/* Mobile: single card carousel */}
          <div className="md:hidden overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: 'translateX(-' + (current * 100) + '%)' }}
            >
              {testimonials.map(function (review) {
                return <ReviewCard key={review.id} review={review} />
              })}
            </div>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: Math.min(totalSlides, 5) }, function (_, i) {
              var isCurrent = i === Math.min(current, 4)
              return (
                <button
                  key={i}
                  onClick={function () { goTo(i) }}
                  className={
                    'rounded-full transition-all duration-300 ' +
                    (isCurrent
                      ? 'w-8 h-2.5 bg-brand-600'
                      : 'w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400')
                  }
                  aria-label={'Go to review group ' + (i + 1)}
                />
              )
            })}
          </div>
        </div>

        {/* Google CTA */}
        <div className="text-center mt-8">
          <a
            href="https://maps.app.goo.gl/MEcusRXhsFG7jMW79"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand-700 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
            See all reviews on Google Maps
          </a>
        </div>
      </div>
    </section>
  )
}
