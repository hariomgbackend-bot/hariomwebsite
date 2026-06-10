'use client'

import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'

export default function Footer() {
  const { t } = useTranslation()

  const socialIcons = {
    facebook: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z',
    instagram: 'M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01M6.5 19.5h11a3 3 0 003-3v-11a3 3 0 00-3-3h-11a3 3 0 00-3 3v11a3 3 0 003 3z',
    justdial: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
  }

  const socialColors = {
    facebook: '#1877F2',
    instagram: '#E4405F',
    justdial: '#EE2E24',
  }

  const socialUrls = {
    facebook: 'https://www.facebook.com/share/1NMwLjTudt/?mibextid=wwXIfr',
    instagram: 'https://www.instagram.com/hariom_elect?igsh=MW45cnJnbTluZXBscw%3D%3D&utm_source=qr',
    justdial: 'https://www.justdial.com/Alandi/Hari-OM-Electronics-Near-Cosmos-Bank-Alandi-Devachi/020PXX20-XX20-101130101927-C3B9_BZDET',
  }

  return (
    <footer className="bg-[#0B1F4B] text-white">
      <div className="container-custom py-14 md:py-18">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-14">

          {/* Brand column */}
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
                  <span className="text-[#8B1A35]">HARIOM</span>
                  <span className="text-white ml-1">ELECTRONICS</span>
                </span>
                <span className="block text-[10px] text-white/50 tracking-widest uppercase">
                  Our Product. Your Trust
                </span>
              </div>
            </div>
            <p className="text-sm text-white/60 leading-relaxed">{t('footer.description')}</p>
            <p className="text-xs text-[#FF5E1A] italic">{t('footer.brandMessage')}</p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-bold text-[#FF5E1A] mb-5 text-sm tracking-widest uppercase">{t('footer.quickLinks')}</h4>
            <ul className="space-y-2.5">
              {[
                { href: '/about',   label: t('nav.about') },
                { href: '/awards',  label: t('nav.awards') },
                { href: '/brands',  label: t('nav.brands') },
                { href: '/offers',  label: t('nav.offers') },
                { href: '/stores',  label: t('nav.stores') },
                { href: '/services',label: t('nav.services') },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 hover:text-[#FF5E1A] transition-colors flex items-center gap-1.5 group"
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

          {/* Contact info */}
          <div>
            <h4 className="font-bold text-[#FF5E1A] mb-5 text-sm tracking-widest uppercase">{t('footer.contactInfo')}</h4>
            <ul className="space-y-3.5 text-sm text-white/60">
              <li className="flex gap-2.5">
                <svg className="w-5 h-5 shrink-0 mt-0.5 text-[#FF5E1A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Shree Krishna Complex, Alandi Road, Alandi, Maharashtra 412105</span>
              </li>
              <li className="flex gap-2.5">
                <svg className="w-5 h-5 shrink-0 text-[#FF5E1A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+91 8177896218</span>
              </li>
              <li className="flex gap-2.5">
                <svg className="w-5 h-5 shrink-0 text-[#FF5E1A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>hariom_elect@live.com</span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-bold text-[#FF5E1A] mb-5 text-sm tracking-widest uppercase">{t('footer.followUs')}</h4>
            <div className="flex gap-3">
              {Object.entries(socialIcons).map(([name, path]) => (
                <a
                  key={name}
                  href={socialUrls[name]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group w-10 h-10 bg-white/10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                  style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = socialColors[name] }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)' }}
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
          <p className="text-xs text-white/40">
            &copy; {new Date().getFullYear()} Hariom Electronics. {t('footer.rights')}
          </p>
          <p className="text-xs text-white/40">
            Serving Alandi since <span className="text-[#FF5E1A] font-semibold">1988</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
