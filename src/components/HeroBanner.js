'use client'

import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'

export default function HeroBanner() {
  const { t } = useTranslation()

  return (
    <section className="relative bg-brand-800 min-h-[85vh] md:min-h-[90vh] flex items-center overflow-hidden">

      {/* ── Professional Blue Blur Electronics Background ── */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Base gradient mesh */}
        <div className="absolute inset-0" style={{
          background: `
            radial-gradient(ellipse 80% 60% at 10% 20%, rgba(139,26,53,0.15) 0%, transparent 60%),
            radial-gradient(ellipse 60% 50% at 90% 80%, rgba(26,63,168,0.25) 0%, transparent 50%),
            radial-gradient(ellipse 50% 40% at 50% 50%, rgba(59,130,246,0.08) 0%, transparent 50%),
            linear-gradient(160deg, #0f1a3e 0%, #1a3fa8 35%, #0f1a3e 70%, #1a2040 100%)
          `
        }} />
        {/* Large blurred tech orbs */}
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full opacity-15" style={{
          background: 'radial-gradient(circle, rgba(59,130,246,0.6) 0%, transparent 70%)',
          filter: 'blur(80px)'
        }} />
        <div className="absolute -bottom-40 -right-32 w-[700px] h-[500px] rounded-full opacity-20" style={{
          background: 'radial-gradient(circle, rgba(139,26,53,0.5) 0%, transparent 70%)',
          filter: 'blur(100px)'
        }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-10" style={{
          background: 'radial-gradient(circle, rgba(99,102,241,0.4) 0%, transparent 70%)',
          filter: 'blur(120px)'
        }} />
        {/* Subtle circuit-like dot grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }} />
        {/* Diagonal tech lines pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(255,255,255,0.15) 40px, rgba(255,255,255,0.15) 41px)`,
        }} />
        {/* Vignette overlay for depth */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.3) 100%)'
        }} />
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
              <Link href="/products" className="btn-outline-light px-7 py-3.5">
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
