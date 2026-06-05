'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'
import LanguageSwitcher from './LanguageSwitcher'

export default function Header() {
  const { t } = useTranslation()
  const [menuOpen, setMenuOpen] = useState(false)

  const navLinks = [
    { href: '/', label: t('nav.home') },
    { href: '/about', label: t('nav.about') },
    { href: '/products/televisions', label: t('nav.products') },
    { href: '/brands', label: t('nav.brands') },
    { href: '/offers', label: t('nav.offers') },
    { href: '/stores', label: t('nav.stores') },
    { href: '/contact', label: t('nav.contact') },
    { href: '/services', label: t('nav.services') },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-brand-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">HO</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-sm md:text-base font-bold text-brand-800 leading-tight">{t('siteName')}</h1>
              <p className="text-xs text-accent-500 font-medium">{t('tagline')}</p>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-6">
            <nav className="flex items-center gap-5">
              {navLinks.slice(0, 7).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-gray-700 hover:text-accent-500 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <LanguageSwitcher />
            <Link href="/contact" className="btn-primary text-xs px-4 py-2">
              {t('nav.contact')}
            </Link>
          </div>

          <div className="flex lg:hidden items-center gap-3">
            <LanguageSwitcher />
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 text-gray-700 hover:text-accent-500"
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

      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100">
          <nav className="container-custom py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block py-2 px-3 text-sm font-medium text-gray-700 hover:bg-brand-50 hover:text-brand-600 rounded-lg transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
