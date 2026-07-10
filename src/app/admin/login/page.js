'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from '@/hooks/useTranslation'
import { auth } from '@/lib/firebase'
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'

var ADMIN_UID = 'OIkdwBtfJTgy1ZQpkKiH0YxdIgo2'

export default function AdminLoginPage() {
  var { t } = useTranslation()
  var router = useRouter()
  var [email, setEmail] = useState('')
  var [password, setPassword] = useState('')
  var [error, setError] = useState('')
  var [loading, setLoading] = useState(false)
  var [checking, setChecking] = useState(true)

  useEffect(function () {
    if (!auth) { setChecking(false); return }
    var unsub = onAuthStateChanged(auth, function (user) {
      if (user) {
        if (user.uid === ADMIN_UID) {
          router.replace('/admin/dashboard')
        } else {
          setError('This account does not have admin access.')
          setChecking(false)
        }
      } else {
        setChecking(false)
      }
    })
    return unsub
  }, [router])

  var handleLogin = async function (e) {
    e.preventDefault()
    if (!auth) { setError('Firebase is not configured.'); return }
    setLoading(true)
    setError('')
    try {
      var credential = await signInWithEmailAndPassword(auth, email, password)
      if (credential.user.uid !== ADMIN_UID) {
        await auth.signOut()
        setError('This account does not have admin access.')
        setLoading(false)
        return
      }
      router.replace('/admin/dashboard')
    } catch (err) {
      var msg = err.message
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        msg = 'Invalid email or password.'
      } else if (err.code === 'auth/too-many-requests') {
        msg = 'Too many attempts. Please try again later.'
      } else if (err.code === 'auth/invalid-email') {
        msg = 'Please enter a valid email address.'
      }
      setError(msg)
      setLoading(false)
    }
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center text-gray-500">Checking authentication...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-2xl overflow-hidden mx-auto mb-4 bg-brand-600">
            <img src="/logo-icon.png" alt="Hariom Electronics" className="w-full h-full object-contain p-2" />
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
              onChange={function (e) { setEmail(e.target.value) }}
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
              onChange={function (e) { setPassword(e.target.value) }}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}
          <button type="submit" disabled={loading} className="btn-primary w-full py-3">
            {loading ? 'Signing in...' : t('admin.signIn')}
          </button>
        </form>
      </div>
    </div>
  )
}
