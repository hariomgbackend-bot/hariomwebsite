'use client'

import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'

export default function HeroBanner() {
  const { t } = useTranslation()

  return (
    <section className="relative bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 min-h-[80vh] md:min-h-[90vh] flex items-center overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent-500 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
      </div>

      <div className="container-custom relative z-10 py-16 md:py-24">
        <div className="max-w-3xl">
          <span className="inline-block px-4 py-1.5 bg-accent-500/20 text-accent-400 text-xs md:text-sm font-semibold rounded-full mb-4 md:mb-6">
            {t('hero.badge')}
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
            {t('hero.title')}
          </h1>

          <p className="text-base md:text-lg text-gray-300 mt-4 md:mt-6 max-w-2xl leading-relaxed">
            {t('hero.subtitle')}
          </p>

          <div className="flex flex-wrap gap-3 md:gap-4 mt-6 md:mt-8">
            <Link href="/stores" className="btn-accent text-sm md:text-base px-6 md:px-8 py-3 md:py-3.5">
              {t('hero.cta1')}
            </Link>
            <Link href="/products/televisions" className="btn-outline-light text-sm md:text-base px-6 md:px-8 py-3 md:py-3.5">
              {t('hero.cta2')}
            </Link>
            <Link href="/contact" className="text-sm md:text-base px-6 py-3 text-gray-300 hover:text-white transition-colors">
              {t('hero.cta3')} &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-4 md:gap-8 mt-10 md:mt-16 pt-8 md:pt-12 border-t border-white/10">
            {[
              { number: '38+', label: 'Years of Trust' },
              { number: '3', label: 'Store Locations' },
              { number: '50+', label: 'Brands Available' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl md:text-3xl font-bold text-accent-400">{stat.number}</div>
                <div className="text-xs md:text-sm text-gray-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
