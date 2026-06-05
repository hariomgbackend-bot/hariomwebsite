'use client'

import { useTranslation } from '@/hooks/useTranslation'

const features = [
  {
    key: 'emi',
    icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  },
  {
    key: 'delivery',
    icon: 'M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2-1m4 0l2 1m0 0l2-1m-2 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1v-1m12-2V9l4-1v6M5 18h14a2 2 0 002-2v-2M5 18H3',
  },
  {
    key: 'exchange',
    icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
  },
  {
    key: 'installation',
    icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
  },
  {
    key: 'genuine',
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
  },
  {
    key: 'multiBrand',
    icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
  },
]

export default function FeaturesStrip() {
  const { t } = useTranslation()

  return (
    <section className="py-14 md:py-20 bg-white">
      <div className="container-custom">
        <div className="text-center mb-10 md:mb-12">
          <h2 className="section-title">{t('features.heading')}</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {features.map((f) => (
            <div
              key={f.key}
              className="group flex flex-col items-center text-center p-5 md:p-6 rounded-2xl bg-surface-low hover:bg-brand-50 hover:shadow-md transition-all duration-200 border border-transparent hover:border-brand-100 cursor-default"
            >
              <div className="w-13 h-13 bg-brand-50 text-brand-700 rounded-2xl flex items-center justify-center mb-3 group-hover:bg-brand-700 group-hover:text-white transition-colors shadow-sm">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={f.icon} />
                </svg>
              </div>
              <span className="text-xs md:text-sm font-semibold text-on-surface group-hover:text-brand-700 transition-colors leading-snug">
                {t(`features.${f.key}`)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
