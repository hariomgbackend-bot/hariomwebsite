'use client'

import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'

const adminSections = [
  {
    key: 'manageCategories',
    icon: 'M4 6h16M4 10h16M4 14h16M4 18h16',
    color: 'bg-blue-100 text-blue-600',
  },
  {
    key: 'manageProducts',
    icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
    color: 'bg-green-100 text-green-600',
  },
  {
    key: 'manageOffers',
    icon: 'M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7',
    color: 'bg-orange-100 text-orange-600',
  },
  {
    key: 'manageStores',
    icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
    color: 'bg-purple-100 text-purple-600',
  },
  {
    key: 'manageBrands',
    icon: 'M13 10V3L4 14h7v7l9-11h-7z',
    color: 'bg-pink-100 text-pink-600',
  },
  {
    key: 'manageBanners',
    icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
    color: 'bg-indigo-100 text-indigo-600',
  },
]

export default function AdminDashboardPage() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">HO</span>
              </div>
              <span className="text-sm font-bold text-brand-800">Admin</span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-xs text-gray-500 hover:text-brand-600">View Site</Link>
            <button className="text-xs text-red-500 hover:text-red-700">Sign Out</button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-brand-800 mb-2">{t('admin.dashboard')}</h1>
        <p className="text-gray-500 text-sm mb-8">Manage your Hari Om Electronics website content</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminSections.map((section) => (
            <button
              key={section.key}
              onClick={() => alert(`${t(`admin.${section.key}`)} management will be connected to Firebase Firestore.`)}
              className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 text-left group"
            >
              <div className={`w-12 h-12 ${section.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={section.icon} />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800 group-hover:text-brand-600 transition-colors">
                {t(`admin.${section.key}`)}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Manage via Firebase Firestore console
              </p>
            </button>
          ))}
        </div>

        <div className="mt-8 bg-white rounded-xl p-6 border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-3">Quick Stats</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Categories', value: '12' },
              { label: 'Products', value: '20' },
              { label: 'Brands', value: '18' },
              { label: 'Offers', value: '15' },
            ].map((stat) => (
              <div key={stat.label} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-brand-600">{stat.value}</div>
                <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 bg-accent-50 border border-accent-200 rounded-xl p-4 text-sm text-accent-800">
          <strong>Setup Required:</strong> To enable full admin functionality, add your Firebase configuration 
          in the <code className="bg-white px-1.5 py-0.5 rounded text-xs">.env.local</code> file. Admin management 
          will then connect to Firestore for live data management.
        </div>
      </div>
    </div>
  )
}
