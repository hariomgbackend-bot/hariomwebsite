'use client'

import { useState } from 'react'
import { useTranslation } from '@/hooks/useTranslation'

export default function ContactForm() {
  const { t } = useTranslation()
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 5000)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t('contact.form.name')}</label>
        <input
          type="text"
          required
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all text-sm"
          placeholder={t('contact.form.name')}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t('contact.form.email')}</label>
        <input
          type="email"
          required
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all text-sm"
          placeholder={t('contact.form.email')}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t('contact.form.phone')}</label>
        <input
          type="tel"
          required
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all text-sm"
          placeholder={t('contact.form.phone')}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t('contact.form.message')}</label>
        <textarea
          required
          rows={4}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all text-sm resize-none"
          placeholder={t('contact.form.message')}
        />
      </div>
      <button type="submit" className="btn-primary w-full">
        {t('contact.form.submit')}
      </button>
      {submitted && (
        <p className="text-green-600 text-sm text-center font-medium">{t('contact.form.success')}</p>
      )}
    </form>
  )
}
