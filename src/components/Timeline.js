'use client'

import { useTranslation } from '@/hooks/useTranslation'

/**
 * Renders the company journey from translations.about.timeline (array).
 * Falls back gracefully if a translation value is missing or malformed.
 */
function pickTranslation(raw) {
  // The context's t() returns the raw dotted path string on a miss.
  // Treat a string that looks like a dotted path as "not found".
  if (Array.isArray(raw)) return raw
  if (typeof raw === 'string' && /^[\w.]+$/.test(raw) && raw.indexOf('.') !== -1) return []
  return raw || []
}

export default function Timeline() {
  const { t } = useTranslation()
  const events = pickTranslation(t('about.timeline'))

  if (!events.length) return null

  return (
    <div className="relative">
      {/* Center vertical line (desktop only) */}
      <div className="absolute left-1/2 -translate-x-px top-0 bottom-0 w-0.5 bg-brand-200 hidden md:block" />

      <div className="space-y-8 md:space-y-12">
        {events.map((event, index) => {
          const side = index % 2 === 0 ? 'left' : 'right'
          const year = event && event.year ? event.year : ''
          const heading = event && event.heading ? event.heading : ''
          const body = event && event.body ? event.body : ''
          const isLatest = event && event.latest === true

          return (
            <div key={(year || '') + '-' + index} className={`relative md:flex ${side === 'right' ? 'md:flex-row-reverse' : ''}`}>
              {/* Spacer column on the opposite side (desktop) */}
              <div className="hidden md:flex md:w-1/2 items-center" />

              {/* Center dot */}
              <div className={`hidden md:flex absolute left-1/2 -translate-x-1/2 w-6 h-6 rounded-full border-4 border-white shadow z-10 items-center justify-center ${isLatest ? 'bg-accent-500' : 'bg-brand-600'}`} />

              {/* Content */}
              <div className="md:w-1/2 pl-8 md:pl-0 md:px-8">
                <div className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow ${side === 'right' ? 'md:ml-8' : 'md:mr-8'}`}>
                  <span className={`inline-flex items-center gap-2 px-3 py-1 text-sm font-bold rounded-lg mb-3 ${isLatest ? 'bg-accent-500 text-white' : 'bg-brand-700 text-white'}`}>
                    {year}
                    {isLatest && (
                      <span className="text-[10px] uppercase tracking-wider bg-white/25 px-1.5 py-0.5 rounded">
                        {t('about.latestBadge') || 'Latest'}
                      </span>
                    )}
                  </span>
                  {heading && (
                    <h3 className="text-base md:text-lg font-bold text-brand-800 mb-2 leading-snug">
                      {heading}
                    </h3>
                  )}
                  {body && (
                    <p className="text-sm md:text-base text-gray-700 leading-relaxed">{body}</p>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
