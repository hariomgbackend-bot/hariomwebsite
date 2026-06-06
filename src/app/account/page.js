'use client'

import { useEffect, useState } from 'react'
import { createReturnRequest, getOrdersForUser } from '@/lib/orders'
import { listenToAuth, loginCustomer, logoutCustomer, registerCustomer } from '@/lib/auth'
import { getCustomerProfile, saveCustomerProfile } from '@/lib/customerProfile'

function formatDate(value) {
  if (!value) return 'Pending'
  if (value.seconds) return new Date(value.seconds * 1000).toLocaleString()
  return String(value)
}

function formatMoney(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(Number(value || 0))
}

function statusLabel(order) {
  var status = order.status || 'new'
  var tracking = order.tracking || {}
  if (tracking.status) return tracking.status
  return status.charAt(0).toUpperCase() + status.slice(1)
}

export default function AccountPage() {
  var [mode, setMode] = useState('login')
  var [user, setUser] = useState(null)
  var [authForm, setAuthForm] = useState({ name: '', email: '', password: '' })
  var [profile, setProfile] = useState({ name: '', email: '', phone: '', alternatePhone: '', address: '', landmark: '', city: '', state: '', pincode: '' })
  var [orders, setOrders] = useState([])
  var [message, setMessage] = useState('')
  var [loading, setLoading] = useState(false)
  var [returnForms, setReturnForms] = useState({})

  useEffect(function () {
    return listenToAuth(function (current) {
      setUser(current)
      if (current && !current.isAnonymous) {
        Promise.all([getCustomerProfile(current.uid), getOrdersForUser(current.uid)]).then(function ([savedProfile, savedOrders]) {
          setProfile(function (existing) {
            return Object.assign({}, existing, savedProfile || {}, {
              name: (savedProfile && savedProfile.name) || current.displayName || existing.name,
              email: (savedProfile && savedProfile.email) || current.email || existing.email
            })
          })
          setOrders(savedOrders)
        })
      } else {
        setOrders([])
      }
    })
  }, [])

  function updateAuthField(e) {
    setAuthForm(Object.assign({}, authForm, { [e.target.name]: e.target.value }))
  }

  function updateProfileField(e) {
    setProfile(Object.assign({}, profile, { [e.target.name]: e.target.value }))
  }

  async function submitAuth(e) {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    try {
      if (mode === 'register') {
        await registerCustomer(authForm.name, authForm.email, authForm.password)
        setMessage('Account created successfully.')
      } else {
        await loginCustomer(authForm.email, authForm.password)
        setMessage('Signed in successfully.')
      }
    } catch (err) {
      setMessage(err.message || 'Unable to continue.')
    } finally {
      setLoading(false)
    }
  }

  async function saveProfile(e) {
    e.preventDefault()
    if (!user) return
    setLoading(true)
    setMessage('')
    try {
      await saveCustomerProfile(user.uid, profile)
      setMessage('Profile updated.')
    } catch (err) {
      setMessage(err.message || 'Unable to update profile.')
    } finally {
      setLoading(false)
    }
  }

  function updateReturnForm(orderId, field, value) {
    setReturnForms(function (current) {
      var next = Object.assign({}, current)
      next[orderId] = Object.assign({}, next[orderId] || {}, { [field]: value })
      return next
    })
  }

  async function submitReturn(order) {
    var form = returnForms[order.id] || {}
    if (!form.reason || !form.issue) {
      setMessage('Please add return reason and issue details.')
      return
    }
    setLoading(true)
    setMessage('')
    try {
      await createReturnRequest(order, {
        items: form.items ? form.items.split(',').map(function (item) { return item.trim() }).filter(Boolean) : [],
        reason: form.reason,
        issue: form.issue,
        preferredResolution: form.preferredResolution || 'return',
        pickupAddress: form.pickupAddress || profile.address,
        alternatePhone: form.alternatePhone || profile.alternatePhone
      })
      setMessage('Return request submitted. Our team will review it.')
      setReturnForms(function (current) {
        var next = Object.assign({}, current)
        delete next[order.id]
        return next
      })
    } catch (err) {
      setMessage(err.message || 'Unable to submit return request.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <section className="bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 py-12 md:py-16">
        <div className="container-custom">
          <h1 className="text-3xl md:text-5xl font-bold text-white">Account</h1>
          <p className="text-gray-300 mt-3">Manage profile, track orders, and request returns.</p>
        </div>
      </section>

      <section className="py-8 md:py-12 bg-gray-50 min-h-[60vh]">
        <div className="container-custom">
          {user && !user.isAnonymous ? (
            <div className="grid lg:grid-cols-[380px_1fr] gap-6">
              <form onSubmit={saveProfile} className="bg-white rounded-xl border border-gray-200 p-5 md:p-6 space-y-4 h-fit">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold text-brand-800">Profile</h2>
                    <p className="text-sm text-gray-500 mt-1">{user.email}</p>
                  </div>
                  <button type="button" onClick={logoutCustomer} className="text-sm font-semibold text-crimson-500">Sign Out</button>
                </div>
                <input name="name" placeholder="Full name" value={profile.name} onChange={updateProfileField} className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-brand-200" />
                <input name="phone" placeholder="Mobile number" value={profile.phone} onChange={updateProfileField} className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-brand-200" />
                <input name="alternatePhone" placeholder="Alternate number optional" value={profile.alternatePhone} onChange={updateProfileField} className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-brand-200" />
                <input name="pincode" placeholder="Pincode" value={profile.pincode} onChange={updateProfileField} className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-brand-200" />
                <div className="grid grid-cols-2 gap-3">
                  <input name="city" placeholder="City" value={profile.city} onChange={updateProfileField} className="px-4 py-3 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-brand-200" />
                  <input name="state" placeholder="State" value={profile.state} onChange={updateProfileField} className="px-4 py-3 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-brand-200" />
                </div>
                <input name="landmark" placeholder="Landmark optional" value={profile.landmark} onChange={updateProfileField} className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-brand-200" />
                <textarea name="address" placeholder="Default delivery address" value={profile.address} onChange={updateProfileField} rows={3} className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-brand-200 resize-none" />
                <button disabled={loading} className="btn-primary w-full">{loading ? 'Saving...' : 'Save Profile'}</button>
                {message && <p className="text-sm text-center text-gray-600">{message}</p>}
              </form>

              <div className="space-y-4">
                <h2 className="text-xl font-bold text-brand-800">Order History</h2>
                {orders.length === 0 ? (
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <p className="text-gray-500 text-sm">No orders yet. Orders placed while signed in will appear here.</p>
                  </div>
                ) : orders.map(function (order) {
                  var tracking = order.tracking || {}
                  var returnForm = returnForms[order.id] || {}
                  return (
                    <div key={order.id} className="bg-white rounded-xl border border-gray-200 p-5">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-bold text-brand-800">Order #{order.id.slice(0, 8)}</p>
                          <p className="text-xs text-gray-500 mt-1">{formatDate(order.createdAt)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-brand-800">{formatMoney(order.total || order.subtotal)}</p>
                          <p className="text-xs text-gray-500">{order.paymentMethod} / {order.paymentStatus}</p>
                        </div>
                      </div>
                      <div className="mt-4 rounded-lg bg-gray-50 border border-gray-100 p-3">
                        <p className="text-sm font-semibold text-gray-800">Tracking: {statusLabel(order)}</p>
                        {tracking.number && <p className="text-xs text-gray-600 mt-1">AWB: {tracking.number}</p>}
                        {tracking.carrier && <p className="text-xs text-gray-600 mt-1">Carrier: {tracking.carrier}</p>}
                        {tracking.url && <a href={tracking.url} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-brand-700 mt-2 inline-block">Open courier tracking</a>}
                      </div>
                      <ul className="mt-4 space-y-2">
                        {(order.items || []).map(function (item) {
                          return <li key={item.id} className="text-sm text-gray-700">{item.name} x {item.quantity}</li>
                        })}
                      </ul>
                      <details className="mt-4">
                        <summary className="cursor-pointer text-sm font-semibold text-crimson-500">Request return / service support</summary>
                        <div className="grid sm:grid-cols-2 gap-3 mt-3">
                          <input placeholder="Items to return, comma separated" value={returnForm.items || ''} onChange={function (e) { updateReturnForm(order.id, 'items', e.target.value) }} className="px-4 py-3 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-brand-200" />
                          <select value={returnForm.preferredResolution || 'return'} onChange={function (e) { updateReturnForm(order.id, 'preferredResolution', e.target.value) }} className="px-4 py-3 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-brand-200">
                            <option value="return">Return</option>
                            <option value="replacement">Replacement</option>
                            <option value="service">Service visit</option>
                            <option value="refund">Refund follow-up</option>
                          </select>
                          <input placeholder="Reason" value={returnForm.reason || ''} onChange={function (e) { updateReturnForm(order.id, 'reason', e.target.value) }} className="px-4 py-3 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-brand-200" />
                          <input placeholder="Alternate phone optional" value={returnForm.alternatePhone || ''} onChange={function (e) { updateReturnForm(order.id, 'alternatePhone', e.target.value) }} className="px-4 py-3 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-brand-200" />
                          <textarea placeholder="Describe issue" value={returnForm.issue || ''} onChange={function (e) { updateReturnForm(order.id, 'issue', e.target.value) }} rows={3} className="sm:col-span-2 px-4 py-3 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-brand-200 resize-none" />
                          <textarea placeholder="Pickup address" value={returnForm.pickupAddress || profile.address || ''} onChange={function (e) { updateReturnForm(order.id, 'pickupAddress', e.target.value) }} rows={2} className="sm:col-span-2 px-4 py-3 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-brand-200 resize-none" />
                          <button type="button" disabled={loading} onClick={function () { submitReturn(order) }} className="btn-primary sm:col-span-2">Submit Return Request</button>
                        </div>
                      </details>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <form onSubmit={submitAuth} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4 max-w-xl mx-auto">
              <div className="inline-flex bg-gray-100 rounded-xl p-1">
                <button type="button" onClick={function () { setMode('login') }} className={'px-4 py-2 rounded-lg text-sm font-semibold ' + (mode === 'login' ? 'bg-white text-brand-800 shadow-sm' : 'text-gray-500')}>Login</button>
                <button type="button" onClick={function () { setMode('register') }} className={'px-4 py-2 rounded-lg text-sm font-semibold ' + (mode === 'register' ? 'bg-white text-brand-800 shadow-sm' : 'text-gray-500')}>Create Account</button>
              </div>
              {mode === 'register' && <input name="name" placeholder="Name" value={authForm.name} onChange={updateAuthField} className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-brand-200" />}
              <input name="email" type="email" required placeholder="Email" value={authForm.email} onChange={updateAuthField} className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-brand-200" />
              <input name="password" type="password" required minLength={6} placeholder="Password" value={authForm.password} onChange={updateAuthField} className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-brand-200" />
              <button disabled={loading} className="btn-primary w-full">{loading ? 'Please wait...' : mode === 'register' ? 'Create Account' : 'Sign In'}</button>
              {message && <p className="text-sm text-center text-gray-600">{message}</p>}
            </form>
          )}
        </div>
      </section>
    </>
  )
}
