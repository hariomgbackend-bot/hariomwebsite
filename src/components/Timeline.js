'use client'

import { useTranslation } from '@/hooks/useTranslation'

const events = [
  { year: '1988', key: '1988', side: 'left' },
  { year: '1998', key: 'growth', side: 'right' },
  { year: '2010', key: 'hariOm', side: 'left' },
  { year: '2024', key: 'present', side: 'right' },
]

export default function Timeline() {
  const { lang, t } = useTranslation()

  return (
    <div className="relative">
      <div className="absolute left-1/2 -translate-x-px top-0 bottom-0 w-0.5 bg-brand-200 hidden md:block" />

      <div className="space-y-8 md:space-y-12">
        {events.map((event, index) => (
          <div key={event.year} className={`relative md:flex ${event.side === 'right' ? 'md:flex-row-reverse' : ''}`}>
            <div className="hidden md:flex md:w-1/2 items-center" />

            <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-6 h-6 bg-brand-600 rounded-full border-4 border-white shadow z-10" />

            <div className="md:w-1/2 pl-8 md:pl-0 md:px-8">
              <div className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow ${event.side === 'right' ? 'md:ml-8' : 'md:mr-8'}`}>
                <span className="inline-block px-3 py-1 bg-accent-500 text-white text-sm font-bold rounded-lg mb-3">
                  {event.year}
                </span>
                <p className="text-gray-700 leading-relaxed">{t(`about.timeline.${event.key}`)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
