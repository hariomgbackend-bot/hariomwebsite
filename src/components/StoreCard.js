'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useTranslation } from '@/hooks/useTranslation'

export default function StoreCard({ store }) {
  const { lang, t } = useTranslation()
  const [imgError, setImgError] = useState(false)

  const storeName = lang === 'hi' ? store.nameHi : lang === 'mr' ? store.nameMr : store.name
  const storeAddr = lang === 'hi' ? store.addressHi : lang === 'mr' ? store.addressMr : store.address

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
      <div className={'aspect-[16/9] overflow-hidden bg-gray-100 relative' + (imgError ? ' bg-gradient-to-br from-brand-600 to-accent-600' : '')}>
        {!imgError && (
          <Image
            src={store.image}
            alt={storeName}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            onError={() => setImgError(true)}
          />
        )}
      </div>
      <div className="p-5 space-y-3">
        <h3 className="text-lg font-bold text-brand-800">{storeName}</h3>
        <div className="flex gap-2 text-sm text-gray-600">
          <svg className="w-5 h-5 shrink-0 mt-0.5 text-accent-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{storeAddr}</span>
        </div>
        <div className="flex gap-2 text-sm text-gray-600">
          <svg className="w-5 h-5 shrink-0 text-accent-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          <span>{store.mobile}</span>
        </div>
        <div className="flex gap-2 text-sm text-gray-600">
          <svg className="w-5 h-5 shrink-0 text-accent-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{t('stores.timings')}: {store.hours.weekday}</span>
        </div>
        <div className="flex gap-2 pt-2">
          <a
            href={`https://www.google.com/maps?q=${store.coordinates.lat},${store.coordinates.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline text-xs px-4 py-2 flex-1 text-center"
          >
            {t('stores.getDirections')}
          </a>
          <a href={`tel:${store.mobile}`} className="btn-accent text-xs px-4 py-2 flex-1 text-center">
            {t('stores.callNow')}
          </a>
        </div>
      </div>
    </div>
  )
}
