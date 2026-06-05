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
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navLinks = [
    { href: '/',                      label: t('nav.home')     },
    { href: '/about',                 label: t('nav.about')    },
    { href: '/products/televisions',  label: t('nav.products') },
    { href: '/brands',                label: t('nav.brands')   },
    { href: '/offers',                label: t('nav.offers')   },
    { href: '/stores',                label: t('nav.stores')   },
    { href: '/services',              label: t('nav.services') },
  ]

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/92 backdrop-blur-[24px] shadow-[0_2px_24px_rgba(0,35,94,0.10)]'
          : 'bg-white border-b border-outline-variant/60'
      }`}
    >
      {/* ── Single inner row — exactly 72px tall on desktop, 60px on mobile ── */}
      <div className="container-custom">
        <div className="flex items-center h-[60px] md:h-[72px] gap-0">

          {/* ══ LEFT: Logo + Wordmark ══ */}
          <Link
            href="/"
            className="flex items-center gap-2.5 flex-shrink-0 group"
            aria-label="Hariom Electronics – Home"
          >
            {/* HE monogram icon */}
            <div className="relative w-9 h-9 md:w-10 md:h-10 rounded-xl overflow-hidden flex-shrink-0 ring-1 ring-outline-variant/70 bg-white shadow-sm group-hover:shadow-md transition-shadow duration-200">
              <img
                src="/logo-icon.png"
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-contain p-1"
              />
            </div>

            {/* Wordmark — hidden on xs, visible sm+ */}
            <div className="hidden sm:flex flex-col justify-center leading-none gap-[3px]">
              <span className="text-[13px] md:text-[15px] font-bold tracking-tight leading-none">
                <span className="text-crimson-500">HARIOM</span>
                <span className="text-brand-800"> ELECTRONICS</span>
              </span>
              <span className="text-[9px] md:text-[10px] font-semibold text-on-surface-variant/70 tracking-[0.14em] uppercase leading-none">
                Our Product. Your Trust
              </span>
            </div>
          </Link>

          {/* ══ CENTER: Nav links (desktop only) ══ */}
          {/* flex-1 + flex justify-center pushes links to the middle */}
          <nav className="hidden lg:flex flex-1 items-center justify-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-3 py-1.5 text-[13px] font-semibold text-on-surface-variant hover:text-brand-700 transition-colors duration-150 rounded-lg hover:bg-brand-50 whitespace-nowrap group"
              >
                {link.label}
                {/* Underline indicator */}
                <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-crimson-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left rounded-full" />
              </Link>
            ))}
          </nav>

          {/* ══ RIGHT: Language + CTA ══ */}
          <div className="hidden lg:flex items-center gap-3 flex-shrink-0 ml-auto">
            {/* Divider */}
            <span className="w-px h-5 bg-outline-variant/50" />
            <LanguageSwitcher />
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-700 text-white text-[13px] font-semibold rounded-xl hover:bg-brand-800 active:scale-95 transition-all duration-150 shadow-sm hover:shadow-md whitespace-nowrap"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {t('nav.contact')}
            </Link>
          </div>

          {/* ══ Mobile: Language + Hamburger ══ */}
          <div className="flex lg:hidden items-center gap-2 ml-auto">
            <LanguageSwitcher />
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-9 h-9 flex items-center justify-center rounded-xl text-on-surface-variant hover:bg-surface-high transition-colors"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

        </div>
      </div>

      {/* ══ Mobile drawer ══ */}
      {menuOpen && (
        <div className="lg:hidden border-t border-outline-variant/60 bg-white shadow-xl">

          {/* Drawer header */}
          <div className="flex items-center gap-3 px-5 py-4 bg-surface-low border-b border-outline-variant/40">
            <div className="w-10 h-10 rounded-xl overflow-hidden ring-1 ring-outline-variant flex-shrink-0 bg-white">
              <img src="/logo-icon.png" alt="Hariom Electronics" className="w-full h-full object-contain p-1" />
            </div>
            <div className="leading-tight">
              <span className="block text-[13px] font-bold">
                <span className="text-crimson-500">HARIOM</span>
                <span className="text-brand-800"> ELECTRONICS</span>
              </span>
              <span className="block text-[9px] font-semibold text-on-surface-variant/60 tracking-[0.12em] uppercase">
                Our Product. Your Trust
              </span>
            </div>
          </div>

          {/* Nav items */}
          <nav className="px-3 py-3 space-y-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between px-4 py-3 text-[14px] font-semibold text-on-surface hover:text-brand-700 hover:bg-brand-50 rounded-xl transition-colors group"
              >
                {link.label}
                <svg className="w-4 h-4 text-outline opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="px-4 pb-4 pt-2 border-t border-surface-high">
            <Link
              href="/contact"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3 bg-brand-700 text-white text-[14px] font-semibold rounded-xl hover:bg-brand-800 transition-colors shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {t('nav.contact')}
            </Link>
          </div>

        </div>
      )}
    </header>
  )
}
