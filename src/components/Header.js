'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'
import LanguageSwitcher from './LanguageSwitcher'

export default function Header() {
  const { t } = useTranslation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navLinks = [
    { href: '/', label: t('nav.home') },
    { href: '/about', label: t('nav.about') },
    { href: '/products/televisions', label: t('nav.products') },
    { href: '/brands', label: t('nav.brands') },
    { href: '/offers', label: t('nav.offers') },
    { href: '/stores', label: t('nav.stores') },
    { href: '/services', label: t('nav.services') },
  ]

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-[20px] shadow-[0_1px_20px_rgba(0,0,0,0.08)]'
          : 'bg-white shadow-sm'
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-[72px]">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl overflow-hidden flex-shrink-0 ring-1 ring-outline-variant">
              <img
                src="/logo-hariom.png"
                alt="Hariom Electronics"
                className="w-full h-full object-contain bg-white p-0.5"
              />
            </div>
            <div className="hidden sm:block leading-tight">
              <span className="block text-sm md:text-base font-bold tracking-tight">
                <span className="text-crimson-500">HARIOM</span>
                <span className="text-brand-800 ml-1">ELECTRONICS</span>
              </span>
              <span className="block text-[10px] md:text-xs text-on-surface-variant font-medium tracking-widest uppercase">
                Our Product. Your Trust
              </span>
            </div>
          </Link>

          {/* ── Desktop nav ── */}
          <div className="hidden lg:flex items-center gap-7">
            <nav className="flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="nav-link"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <LanguageSwitcher />
            <Link href="/contact" className="btn-primary text-xs px-5 py-2.5">
              {t('nav.contact')}
            </Link>
          </div>

          {/* ── Mobile controls ── */}
          <div className="flex lg:hidden items-center gap-3">
            <LanguageSwitcher />
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-high transition-colors"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile drawer ── */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-outline-variant shadow-lg">
          {/* Logo row in mobile drawer */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-surface-high">
            <img src="/logo-hariom.png" alt="Hariom Electronics" className="w-10 h-10 rounded-xl object-contain ring-1 ring-outline-variant" />
            <span className="font-bold text-sm">
              <span className="text-crimson-500">HARIOM</span>
              <span className="text-brand-800"> ELECTRONICS</span>
            </span>
          </div>
          <nav className="container-custom py-3 space-y-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center py-3 px-3 text-sm font-semibold text-on-surface-variant hover:bg-surface-low hover:text-brand-700 rounded-xl transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 pb-2">
              <Link href="/contact" onClick={() => setMenuOpen(false)} className="btn-primary w-full justify-center">
                {t('nav.contact')}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
