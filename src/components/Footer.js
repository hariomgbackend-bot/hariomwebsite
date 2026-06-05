'use client'

import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'

export default function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="bg-brand-900 text-white">
      <div className="container-custom py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-accent-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">HO</span>
              </div>
              <div>
                <h3 className="font-bold text-white">{t('siteName')}</h3>
                <p className="text-xs text-accent-400">{t('tagline')}</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">{t('footer.description')}</p>
            <p className="text-xs text-accent-400 italic">{t('footer.brandMessage')}</p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">{t('footer.quickLinks')}</h4>
            <ul className="space-y-2">
              {[
                { href: '/about', label: t('nav.about') },
                { href: '/brands', label: t('nav.brands') },
                { href: '/offers', label: t('nav.offers') },
                { href: '/stores', label: t('nav.stores') },
                { href: '/services', label: t('nav.services') },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-accent-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">{t('footer.contactInfo')}</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex gap-2">
                <svg className="w-5 h-5 shrink-0 mt-0.5 text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <span>Shree Krishna Complex, Alandi Road, Alandi, Maharashtra 412105</span>
              </li>
              <li className="flex gap-2">
                <svg className="w-5 h-5 shrink-0 text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                <span>+91 9876543210</span>
              </li>
              <li className="flex gap-2">
                <svg className="w-5 h-5 shrink-0 text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                <span>info@hariomelectronics.com</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">{t('footer.followUs')}</h4>
            <div className="flex gap-3">
              {['facebook', 'instagram', 'youtube', 'whatsapp'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-10 h-10 bg-white/10 hover:bg-accent-500 rounded-full flex items-center justify-center transition-colors"
                  aria-label={social}
                >
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10s10-4.477 10-10c0-5.523-4.477-10-10-10z" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 text-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} {t('siteName')}. {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  )
}
