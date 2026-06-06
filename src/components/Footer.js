'use client'

import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'

export default function Footer() {
  const { t } = useTranslation()

  const socialIcons = {
    facebook: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z',
    instagram: 'M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01M6.5 19.5h11a3 3 0 003-3v-11a3 3 0 00-3-3h-11a3 3 0 00-3 3v11a3 3 0 003 3z',
    youtube: 'M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.4a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58zm-13.1 9v-6.85l5.74 3.42z',
    whatsapp: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z',
  }

  return (
    <footer className="bg-brand-900 text-white">
      <div className="container-custom py-14 md:py-18">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-14">

          {/* ── Brand column ── */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl overflow-hidden bg-white flex-shrink-0 ring-1 ring-white/20">
                <img
                  src="/logo-icon.png"
                  alt="Hariom Electronics"
                  className="w-full h-full object-contain p-0.5"
                />
              </div>
              <div className="leading-tight">
                <span className="block text-sm font-bold">
                  <span className="text-crimson-300">HARIOM</span>
                  <span className="text-white ml-1">ELECTRONICS</span>
                </span>
                <span className="block text-[10px] text-brand-300 tracking-widest uppercase">
                  Our Product. Your Trust
                </span>
              </div>
            </div>
            <p className="text-sm text-brand-300 leading-relaxed">{t('footer.description')}</p>
            <p className="text-xs text-crimson-300 italic">{t('footer.brandMessage')}</p>
          </div>

          {/* ── Quick links ── */}
          <div>
            <h4 className="font-bold text-white mb-5 text-sm tracking-widest uppercase">{t('footer.quickLinks')}</h4>
            <ul className="space-y-2.5">
              {[
                { href: '/about',   label: t('nav.about') },
                { href: '/brands',  label: t('nav.brands') },
                { href: '/offers',  label: t('nav.offers') },
                { href: '/stores',  label: t('nav.stores') },
                { href: '/services',label: t('nav.services') },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-brand-300 hover:text-crimson-300 transition-colors flex items-center gap-1.5 group"
                  >
                    <svg className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Contact info ── */}
          <div>
            <h4 className="font-bold text-white mb-5 text-sm tracking-widest uppercase">{t('footer.contactInfo')}</h4>
            <ul className="space-y-3.5 text-sm text-brand-300">
              <li className="flex gap-2.5">
                <svg className="w-5 h-5 shrink-0 mt-0.5 text-crimson-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Shree Krishna Complex, Alandi Road, Alandi, Maharashtra 412105</span>
              </li>
              <li className="flex gap-2.5">
                <svg className="w-5 h-5 shrink-0 text-crimson-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+91 8177896218</span>
              </li>
              <li className="flex gap-2.5">
                <svg className="w-5 h-5 shrink-0 text-crimson-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>hariom_elect@live.com</span>
              </li>
            </ul>
          </div>

          {/* ── Social ── */}
          <div>
            <h4 className="font-bold text-white mb-5 text-sm tracking-widest uppercase">{t('footer.followUs')}</h4>
            <div className="flex gap-3">
              {Object.entries(socialIcons).map(([name, path]) => (
                <a
                  key={name}
                  href="#"
                  className="w-10 h-10 bg-white/10 hover:bg-crimson-500 rounded-full flex items-center justify-center transition-colors"
                  aria-label={name}
                >
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d={path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-center">
          <p className="text-xs text-brand-400">
            &copy; {new Date().getFullYear()} Hariom Electronics. {t('footer.rights')}
          </p>
          <p className="text-xs text-brand-400">
            Serving Alandi since <span className="text-crimson-300 font-semibold">1988</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
