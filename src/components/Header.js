'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'
import LanguageSwitcher from './LanguageSwitcher'
import { useCart } from '@/lib/cart'

export default function Header() {
  const { t } = useTranslation()
  const { totalQuantity } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll while the mobile drawer is open
  useEffect(() => {
    if (menuOpen) {
      const prev = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => { document.body.style.overflow = prev }
    }
  }, [menuOpen])

  const navLinks = [
    { href: '/',                      label: t('nav.home')     },
    { href: '/about',                 label: t('nav.about')    },
    { href: '/awards',                label: t('nav.awards')   },
    { href: '/products',              label: t('nav.products') },
    { href: '/brands',                label: t('nav.brands')   },
    { href: '/offers',                label: t('nav.offers')   },
    { href: '/stores',                label: t('nav.stores')   },
    { href: '/services',              label: t('nav.services') },
  ]

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-xl shadow-[0_2px_24px_rgba(11,31,75,0.10)] border-b border-[#FF5E1A]/30'
          : 'bg-white/90 backdrop-blur-xl border-b border-[#E0E6F0]'
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center h-[60px] md:h-[72px] gap-0">

          {/* ══ LEFT: Logo + Wordmark ══ */}
          <Link
            href="/"
            className="flex items-center gap-2.5 flex-shrink-0 group"
            aria-label="Hariom Electronics – Home"
          >
            <div className="relative w-9 h-9 md:w-10 md:h-10 rounded-xl overflow-hidden flex-shrink-0 ring-1 ring-[#E0E6F0]/70 bg-white shadow-sm group-hover:shadow-md transition-shadow duration-200">
              <img
                src="/logo-icon.png"
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-contain p-1"
              />
            </div>
            <div className="hidden sm:flex flex-col justify-center leading-none gap-[3px]">
              <span className="text-[13px] md:text-[15px] font-bold tracking-tight leading-none font-heading">
                <span style={{color:'#8B1A35'}}>HARIOM</span>
                <span style={{color:'#0B1F4B'}}> ELECTRONICS</span>
              </span>
              <span className="text-[9px] md:text-[10px] font-semibold text-[#6B7A99]/70 tracking-[0.14em] uppercase leading-none">
                Our Product. Your Trust
              </span>
            </div>
          </Link>

          {/* ══ CENTER: Nav links (desktop only) ══ */}
          <nav className="hidden lg:flex flex-1 items-center justify-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-3 py-1.5 text-[13px] font-semibold text-[#6B7A99] hover:text-[#0B1F4B] transition-colors duration-150 rounded-lg hover:bg-[#F4F6FB] whitespace-nowrap group"
              >
                {link.label}
                <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#FF5E1A] scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left rounded-full" />
              </Link>
            ))}
          </nav>

          {/* ══ RIGHT: Language + CTA ══ */}
          <div className="hidden lg:flex items-center gap-3 flex-shrink-0 ml-auto">
            <span className="w-px h-5 bg-[#E0E6F0]/50" />
            <LanguageSwitcher />
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#FF5E1A] text-white text-[13px] font-semibold rounded-xl hover:bg-[#e04a0a] active:scale-95 transition-all duration-150 shadow-sm hover:shadow-md whitespace-nowrap"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {t('nav.contact')}
            </Link>
            <Link
              href="/checkout"
              className="relative inline-flex items-center justify-center w-10 h-10 rounded-xl border border-[#E0E6F0] text-[#0B1F4B] hover:bg-[#F4F6FB] transition-colors"
              aria-label="Cart"
            >
              <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M3 3h2l.4 2m0 0h15.2l-2 8H7.2M5.4 5L7 13m0 0l-1.2 3H19M9 20h.01M17 20h.01" />
              </svg>
              {totalQuantity > 0 && <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-[#FF5E1A] text-white text-[10px] font-bold flex items-center justify-center">{totalQuantity}</span>}
            </Link>
            <Link
              href="/account"
              className="inline-flex items-center justify-center w-10 h-10 rounded-xl border border-[#E0E6F0] text-[#0B1F4B] hover:bg-[#F4F6FB] transition-colors"
              aria-label="Account"
            >
              <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M15.75 7.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 21a7.5 7.5 0 0115 0" />
              </svg>
            </Link>
          </div>

          {/* ══ Mobile: Language + Hamburger ══ */}
          <div className="flex lg:hidden items-center gap-2 ml-auto">
            <LanguageSwitcher />
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-9 h-9 flex items-center justify-center rounded-xl text-[#6B7A99] hover:bg-[#eef1f7] transition-colors"
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
            <Link
              href="/checkout"
              aria-label="Cart"
              className="relative w-9 h-9 flex items-center justify-center rounded-xl text-[#6B7A99] hover:bg-[#eef1f7] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M3 3h2l.4 2m0 0h15.2l-2 8H7.2M5.4 5L7 13m0 0l-1.2 3H19M9 20h.01M17 20h.01" />
              </svg>
              {totalQuantity > 0 && <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-[#FF5E1A] text-white text-[10px] font-bold flex items-center justify-center">{totalQuantity}</span>}
            </Link>
          </div>

        </div>
      </div>

      {/* ══ Mobile drawer — dark navy full-screen ══ */}
      {menuOpen && (
        <div className="lg:hidden fixed inset-0 top-[60px] z-50 bg-[#071035] overflow-y-auto" style={{animation:'slideDown 0.25s ease-out'}}>
          <div className="flex items-center justify-between px-5 pt-5 pb-2">
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/40">Menu</span>
            <button
              onClick={() => setMenuOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <nav className="px-5 py-2 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between px-4 py-3.5 text-[15px] font-semibold text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors group"
              >
                {link.label}
                <svg className="w-4 h-4 text-white/30 group-hover:text-[#FF5E1A] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
            <div className="border-t border-white/10 my-4" />
            <Link
              href="/account"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-between px-4 py-3.5 text-[15px] font-semibold text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors group"
            >
              Account
              <svg className="w-4 h-4 text-white/30 group-hover:text-[#FF5E1A] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/checkout"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-between px-4 py-3.5 text-[15px] font-semibold text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors group"
            >
              Cart {totalQuantity > 0 ? '(' + totalQuantity + ')' : ''}
              <svg className="w-4 h-4 text-white/30 group-hover:text-[#FF5E1A] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </nav>

          <div className="px-5 pb-8 pt-2">
            <Link
              href="/contact"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#FF5E1A] text-white text-[15px] font-semibold rounded-xl hover:bg-[#e04a0a] transition-colors shadow-sm"
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
