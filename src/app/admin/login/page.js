'use client'

import { useState } from 'react'
import { useTranslation } from '@/hooks/useTranslation'

export default function AdminLoginPage() {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    // Firebase auth integration will be added here
    alert('Admin authentication will be integrated with Firebase.')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-2xl overflow-hidden mx-auto mb-4 bg-brand-600">
            <img src="/logo.jpeg" alt="Hari Om Electronics" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-2xl font-bold text-brand-800">{t('admin.login')}</h1>
          <p className="text-sm text-gray-500 mt-2">Hari Om Electronics</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.email')}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all"
              placeholder="admin@hariomelectronics.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.password')}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="btn-primary w-full py-3">
            {t('admin.signIn')}
          </button>
        </form>
      </div>
    </div>
  )
}
