'use client'

import { useState, useEffect } from 'react'
import { getPaymentMode, setPaymentMode } from '@/lib/settings'

export default function AdminSettingsPage() {
  var [paymentEnabled, setPaymentEnabled] = useState(false)
  var [loading, setLoading] = useState(true)
  var [saving, setSaving] = useState(false)
  var [message, setMessage] = useState('')

  useEffect(function () {
    getPaymentMode().then(function (mode) {
      setPaymentEnabled(mode.enabled)
      setLoading(false)
    })
  }, [])

  async function togglePayment() {
    setSaving(true)
    setMessage('')
    var next = !paymentEnabled
    try {
      await setPaymentMode(next)
      setPaymentEnabled(next)
      setMessage(next ? 'Online payment is now ENABLED.' : 'Online payment is now DISABLED.')
    } catch (err) {
      setMessage('Error: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12 text-gray-400">Loading settings...</div>
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-[#0B1F4B]">Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">Configure website features</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-gray-800">Online Payment (Razorpay)</h2>
            <p className="text-sm text-gray-500 mt-1">
              {paymentEnabled
                ? 'Customers can pay online via Razorpay during checkout.'
                : 'Online payment is disabled. Customers can use COD, UPI on Delivery, or Pay at Store.'}
            </p>
          </div>
          <button
            onClick={togglePayment}
            disabled={saving}
            className={'relative w-14 h-8 rounded-full transition-colors flex-shrink-0 ' + (paymentEnabled ? 'bg-green-500' : 'bg-gray-300')}
          >
            <span className={'absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-sm transition-transform ' + (paymentEnabled ? 'translate-x-6' : '')}></span>
          </button>
        </div>
        {saving && <p className="text-xs text-gray-400 mt-3">Saving...</p>}
        {message && (
          <p className={'text-xs mt-3 ' + (message.startsWith('Error') ? 'text-red-600' : 'text-green-600')}>{message}</p>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-xl mt-4">
        <h2 className="text-base font-bold text-gray-800 mb-2">Razorpay Keys</h2>
        <p className="text-sm text-gray-500">
          To enable online payment, add your Razorpay API keys to <code className="bg-gray-100 px-1 rounded">.env.local</code>:
        </p>
        <pre className="mt-2 bg-gray-50 p-3 rounded-lg text-xs text-gray-600">
RAZORPAY_KEY_ID=your_key_id{'\n'}
RAZORPAY_KEY_SECRET=your_key_secret
        </pre>
      </div>
    </div>
  )
}
