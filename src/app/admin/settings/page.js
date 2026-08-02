'use client'

import { useState, useEffect } from 'react'
import { getPaymentMode, setPaymentMode } from '@/lib/settings'
import { getSectionToggle, updateSection } from '@/lib/site-sections'

var SECTION_DEFS = [
  { id: 'featured', label: 'Featured Products', description: 'Show featured products on the homepage.' },
  { id: 'products', label: 'Products Page (Commerce)', description: 'Show the product catalog. When off, customers see the placeholder + Snake game instead of products.' },
  { id: 'offers', label: 'Offers Carousel', description: 'Show the offers carousel on the homepage.' },
  { id: 'promotions', label: 'Promotions Space', description: 'Show the promotions space on the homepage.' },
]

export default function AdminSettingsPage() {
  var [paymentEnabled, setPaymentEnabled] = useState(false)
  var [sections, setSections] = useState({})
  var [loading, setLoading] = useState(true)
  var [saving, setSaving] = useState(false)
  var [savingSection, setSavingSection] = useState(null)
  var [message, setMessage] = useState('')

  useEffect(function () {
    Promise.all([
      getPaymentMode(),
      Promise.all(SECTION_DEFS.map(function (def) { return getSectionToggle(def.id) }))
    ]).then(function (results) {
      var mode = results[0]
      var sectionStates = results[1]
      var map = {}
      SECTION_DEFS.forEach(function (def, i) { map[def.id] = sectionStates[i] })
      setPaymentEnabled(mode.enabled)
      setSections(map)
      setLoading(false)
    }).catch(function () { setLoading(false) })
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

  async function toggleSection(id) {
    setSavingSection(id)
    setMessage('')
    var next = !sections[id].active
    try {
      await updateSection(id, { active: next })
      setSections(function (cur) {
        return Object.assign({}, cur, { [id]: { active: next, message: (cur[id] && cur[id].message) || '' } })
      })
      setMessage(next ? 'Section enabled: ' + id : 'Section disabled: ' + id)
    } catch (err) {
      setMessage('Error: ' + err.message)
    } finally {
      setSavingSection(null)
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
        <div className="mb-4">
          <h2 className="text-base font-bold text-gray-800">Site Sections</h2>
          <p className="text-sm text-gray-500 mt-1">Turn sections of the website on or off. When a section is off, it is hidden from customers.</p>
        </div>
        <div className="space-y-4">
          {SECTION_DEFS.map(function (def) {
            var state = sections[def.id]
            var active = !!(state && state.active)
            var busy = savingSection === def.id
            return (
              <div key={def.id} className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-gray-800">{def.label}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{def.description}</p>
                </div>
                <button
                  onClick={function () { toggleSection(def.id) }}
                  disabled={busy}
                  className={'relative w-14 h-8 rounded-full transition-colors flex-shrink-0 ' + (active ? 'bg-green-500' : 'bg-gray-300')}
                  aria-label={def.label}
                >
                  <span className={'absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-sm transition-transform ' + (active ? 'translate-x-6' : '')}></span>
                </button>
              </div>
            )
          })}
        </div>
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
