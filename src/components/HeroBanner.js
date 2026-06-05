'use client'

import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'

export default function HeroBanner() {
  const { t } = useTranslation()

  return (
    <section className="relative bg-brand-800 min-h-[85vh] md:min-h-[90vh] flex items-center overflow-hidden">

      {/* ── Background layers ── */}
      <div className="absolute inset-0">
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
        {/* Crimson glow — top left */}
        <div className="absolute -top-24 -left-24 w-[500px] h-[500px] bg-crimson-500 rounded-full blur-[120px] opacity-20" />
        {/* Brand blue glow — bottom right */}
        <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-brand-600 rounded-full blur-[140px] opacity-30" />
      </div>

      <div className="container-custom relative z-10 py-20 md:py-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ── Left: Text content ── */}
          <div>
            {/* Badge */}
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-crimson-500/20 text-crimson-200 text-xs font-bold rounded-full mb-6 tracking-widest uppercase border border-crimson-500/30">
              <span className="w-1.5 h-1.5 bg-crimson-300 rounded-full animate-pulse" />
              {t('hero.badge')}
            </span>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-bold text-white leading-[1.1] tracking-tight">
              {t('hero.title')}
            </h1>

            <p className="text-base md:text-lg text-brand-200 mt-6 max-w-xl leading-relaxed">
              {t('hero.subtitle')}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 mt-8">
              <Link href="/stores" className="btn-accent px-7 py-3.5">
                {t('hero.cta1')}
              </Link>
              <Link href="/products/televisions" className="btn-outline-light px-7 py-3.5">
                {t('hero.cta2')}
              </Link>
              <Link href="/contact" className="flex items-center gap-1.5 text-sm text-brand-300 hover:text-white transition-colors py-3.5 font-medium">
                {t('hero.cta3')}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-12 pt-10 border-t border-white/10">
              {[
                { number: '38+', label: 'Years of Trust' },
                { number: '3', label: 'Store Locations' },
                { number: '50+', label: 'Brands Available' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-3xl md:text-4xl font-bold text-crimson-300">{stat.number}</div>
                  <div className="text-xs md:text-sm text-brand-300 mt-1 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Logo showcase ── */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="relative">
              {/* Outer glow ring */}
              <div className="absolute inset-0 rounded-full bg-crimson-500/20 blur-2xl scale-110" />
              {/* Logo card */}
              <div className="relative w-72 h-72 rounded-3xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center p-10 shadow-2xl">
                <img
                  src="/logo-hariom.png"
                  alt="Hariom Electronics"
                  className="w-full h-full object-contain drop-shadow-2xl"
                />
              </div>
              {/* Floating badge chips */}
              <div className="absolute -top-4 -right-6 bg-white rounded-2xl shadow-xl px-4 py-2 flex items-center gap-2">
                <span className="text-lg">⭐</span>
                <div>
                  <div className="text-xs font-bold text-brand-800">Trusted Since</div>
                  <div className="text-sm font-bold text-crimson-500">1988</div>
                </div>
              </div>
              <div className="absolute -bottom-4 -left-6 bg-white rounded-2xl shadow-xl px-4 py-2 flex items-center gap-2">
                <span className="text-lg">🏪</span>
                <div>
                  <div className="text-xs font-bold text-brand-800">3 Stores</div>
                  <div className="text-xs text-on-surface-variant">Alandi</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
