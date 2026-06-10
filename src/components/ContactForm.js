'use client'

import { useState } from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import { db } from '@/lib/firebase'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'

export default function ContactForm() {
  const { t } = useTranslation()
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    var form = e.currentTarget
    var data = new FormData(form)
    try {
      await addDoc(collection(db, 'enquiries'), {
        name: data.get('name') || '',
        email: data.get('email') || '',
        phone: data.get('phone') || '',
        message: data.get('message') || '',
        source: 'website-contact',
        read: false,
        createdAt: serverTimestamp()
      })
      form.reset()
      setSubmitted(true)
      setTimeout(() => setSubmitted(false), 5000)
    } catch (err) {
      setError(err.message || 'Unable to send message.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t('contact.form.name')}</label>
        <input
          type="text"
          name="name"
          required
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all text-sm"
          placeholder={t('contact.form.name')}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t('contact.form.email')}</label>
        <input
          type="email"
          name="email"
          required
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all text-sm"
          placeholder={t('contact.form.email')}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t('contact.form.phone')}</label>
        <input
          type="tel"
          name="phone"
          required
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all text-sm"
          placeholder={t('contact.form.phone')}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t('contact.form.message')}</label>
        <textarea
          name="message"
          required
          rows={4}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all text-sm resize-none"
          placeholder={t('contact.form.message')}
        />
      </div>
      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? 'Sending...' : t('contact.form.submit')}
      </button>
      {submitted && (
        <p className="text-green-600 text-sm text-center font-medium">{t('contact.form.success')}</p>
      )}
      {error && <p className="text-red-600 text-sm text-center font-medium">{error}</p>}
    </form>
  )
}
