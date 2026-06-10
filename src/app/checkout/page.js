'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { createCustomerOrder, updateCustomerOrder } from '@/lib/orders'
import { formatCurrency, useCart } from '@/lib/cart'
import { formatPrice } from '@/lib/products'
import { listenToAuth } from '@/lib/auth'
import { getCustomerProfile, saveCustomerProfile } from '@/lib/customerProfile'

var PAYMENT_METHODS = [
  { id: 'razorpay', label: 'Razorpay', description: 'Cards, UPI, net banking and wallets' },
  { id: 'upi', label: 'UPI on Delivery', description: 'Pay by UPI after confirmation' },
  { id: 'cod', label: 'Cash on Delivery', description: 'Pay when the product is delivered' },
  { id: 'store', label: 'Pay at Store', description: 'Reserve now and pay in store' }
]

function loadRazorpayScript() {
  return new Promise(function (resolve) {
    if (window.Razorpay) { resolve(true); return }
    var script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = function () { resolve(true) }
    script.onerror = function () { resolve(false) }
    document.body.appendChild(script)
  })
}

export default function CheckoutPage() {
  var cart = useCart()
  var [user, setUser] = useState(null)
  var [customer, setCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    alternatePhone: '',
    address: '',
    landmark: '',
    city: '',
    state: '',
    pincode: ''
  })
  var [paymentMethod, setPaymentMethod] = useState('razorpay')
  var [loading, setLoading] = useState(false)
  var [message, setMessage] = useState('')
  var [orderId, setOrderId] = useState('')
  var [pincodeMessage, setPincodeMessage] = useState('')

  useEffect(function () {
    return listenToAuth(function (current) {
      setUser(current)
      if (current && !current.isAnonymous) {
        getCustomerProfile(current.uid).then(function (profile) {
          if (profile) {
            setCustomer(function (existing) {
              return Object.assign({}, existing, profile, {
                email: profile.email || current.email || existing.email,
                name: profile.name || current.displayName || existing.name
              })
            })
          } else {
            setCustomer(function (existing) {
              return Object.assign({}, existing, {
                email: current.email || existing.email,
                name: current.displayName || existing.name
              })
            })
          }
        })
      }
    })
  }, [])

  var canPayOnline = useMemo(function () {
    return cart.subtotal > 0 && paymentMethod === 'razorpay'
  }, [cart.subtotal, paymentMethod])

  function updateCustomer(e) {
    setCustomer(Object.assign({}, customer, { [e.target.name]: e.target.value }))
  }

  async function lookupPincode(value) {
    var pin = value || customer.pincode
    if (!/^\d{6}$/.test(pin)) {
      setPincodeMessage('Enter a valid 6 digit pincode.')
      return
    }
    setPincodeMessage('Checking pincode...')
    try {
      var res = await fetch('/api/pincode/' + pin)
      var data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Pincode not found.')
      setCustomer(function (current) {
        return Object.assign({}, current, {
          city: data.city || current.city,
          state: data.state || current.state,
          pincode: pin
        })
      })
      setPincodeMessage((data.city || 'Area') + ', ' + (data.state || 'India'))
    } catch (err) {
      setPincodeMessage(err.message || 'Unable to check pincode.')
    }
  }

  async function startRazorpay(localOrderId) {
    var loaded = await loadRazorpayScript()
    if (!loaded) throw new Error('Razorpay checkout could not load.')

    var res = await fetch('/api/razorpay/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: cart.subtotal,
        receipt: localOrderId,
        notes: { firestoreOrderId: localOrderId }
      })
    })
    var data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Unable to create Razorpay order.')

    return new Promise(function (resolve, reject) {
      var checkout = new window.Razorpay({
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: 'Hariom Electronics',
        description: 'Order payment',
        order_id: data.id,
        prefill: {
          name: customer.name,
          email: customer.email,
          contact: customer.phone
        },
        handler: async function (response) {
          var verify = await fetch('/api/razorpay/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(response)
          })
          var verified = await verify.json()
          if (!verify.ok || !verified.verified) {
            reject(new Error(verified.error || 'Payment verification failed.'))
            return
          }
          resolve(response)
        },
        modal: {
          ondismiss: function () { reject(new Error('Payment was cancelled.')) }
        },
        theme: { color: '#00235e' }
      })
      checkout.open()
    })
  }

  async function submit(e) {
    e.preventDefault()
    if (cart.items.length === 0) return
    setLoading(true)
    setMessage('')
    setOrderId('')
    try {
      var id = await createCustomerOrder({
        customer: customer,
        items: cart.items,
        subtotal: cart.subtotal,
        total: cart.subtotal,
        currency: 'INR',
        paymentMethod: paymentMethod,
        source: 'website-checkout'
      })

      if (user && !user.isAnonymous) {
        await saveCustomerProfile(user.uid, customer)
      }

      if (canPayOnline) {
        var payment = await startRazorpay(id)
        await updateCustomerOrder(id, {
          paymentStatus: 'paid',
          status: 'confirmed',
          razorpay: payment
        })
      }

      setOrderId(id)
      setMessage(canPayOnline ? 'Payment received. Your order is confirmed.' : 'Order placed. Our team will confirm availability and payment.')
      cart.clearCart()
    } catch (err) {
      setMessage(err.message || 'Unable to place order.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <section className="bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 py-12 md:py-16">
        <div className="container-custom">
          <h1 className="text-3xl md:text-5xl font-bold text-white">Checkout</h1>
          <p className="text-gray-300 mt-3">Place an order as a guest or sign in from Account for faster checkout.</p>
        </div>
      </section>

      <section className="py-8 md:py-12 bg-gray-50 min-h-[60vh]">
        <div className="container-custom">
          {cart.items.length === 0 && !orderId ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <h2 className="text-xl font-bold text-brand-800">Your cart is empty</h2>
              <Link href="/products" className="btn-primary mt-6">Browse Products</Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-[1fr_380px] gap-8">
              <form onSubmit={submit} className="bg-white rounded-xl border border-gray-200 p-5 md:p-6 space-y-5">
                <h2 className="text-xl font-bold text-brand-800">Customer Details</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <input name="name" required placeholder="Full name" value={customer.name} onChange={updateCustomer} className="px-4 py-3 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-brand-200" />
                  <input name="phone" required placeholder="Mobile number" value={customer.phone} onChange={updateCustomer} className="px-4 py-3 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-brand-200" />
                  <input name="alternatePhone" placeholder="Alternate number optional" value={customer.alternatePhone} onChange={updateCustomer} className="px-4 py-3 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-brand-200" />
                  <input name="email" type="email" placeholder="Email optional" value={customer.email} onChange={updateCustomer} className="px-4 py-3 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-brand-200" />
                  <div>
                    <div className="flex gap-2">
                      <input name="pincode" required placeholder="Pincode" value={customer.pincode} onChange={function (e) { updateCustomer(e); if (e.target.value.length === 6) lookupPincode(e.target.value) }} className="min-w-0 flex-1 px-4 py-3 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-brand-200" />
                      <button type="button" onClick={function () { lookupPincode() }} className="px-4 py-3 rounded-lg border border-brand-700 text-brand-700 text-sm font-semibold">Check</button>
                    </div>
                    {pincodeMessage && <p className="text-xs text-gray-500 mt-1">{pincodeMessage}</p>}
                  </div>
                  <input name="city" required placeholder="City / district" value={customer.city} onChange={updateCustomer} className="px-4 py-3 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-brand-200" />
                  <input name="state" required placeholder="State" value={customer.state} onChange={updateCustomer} className="px-4 py-3 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-brand-200" />
                  <input name="landmark" placeholder="Landmark optional" value={customer.landmark} onChange={updateCustomer} className="px-4 py-3 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-brand-200" />
                  <textarea name="address" required placeholder="Delivery address" value={customer.address} onChange={updateCustomer} className="sm:col-span-2 px-4 py-3 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-brand-200 resize-none" rows={3} />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-brand-800 mb-3">Payment</h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {PAYMENT_METHODS.map(function (method) {
                      return (
                        <label key={method.id} className={'border rounded-xl p-4 cursor-pointer transition-colors ' + (paymentMethod === method.id ? 'border-brand-600 bg-brand-50' : 'border-gray-200 bg-white hover:border-gray-300')}>
                          <input type="radio" name="paymentMethod" value={method.id} checked={paymentMethod === method.id} onChange={function () { setPaymentMethod(method.id) }} className="sr-only" />
                          <span className="block text-sm font-bold text-brand-800">{method.label}</span>
                          <span className="block text-xs text-gray-500 mt-1">{method.description}</span>
                        </label>
                      )
                    })}
                  </div>
                </div>

                <button disabled={loading || cart.items.length === 0} className="btn-primary w-full">
                  {loading ? 'Processing...' : paymentMethod === 'razorpay' ? 'Place Order and Pay' : 'Place Order'}
                </button>
                {message && <p className="text-sm text-center text-gray-700">{message}{orderId ? ' Order ID: ' + orderId : ''}</p>}
              </form>

              <aside className="bg-white rounded-xl border border-gray-200 p-5 h-fit">
                <h2 className="text-lg font-bold text-brand-800 mb-4">Order Summary</h2>
                <div className="space-y-4">
                  {cart.items.map(function (item) {
                    return (
                      <div key={item.id} className="flex gap-3 border-b border-gray-100 pb-4">
                        <div className="w-16 h-16 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden">
                          {item.image ? <img src={item.image} alt="" className="w-full h-full object-contain" /> : <span className="text-sm font-bold text-brand-600">{item.name[0]}</span>}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800 line-clamp-2">{item.name}</p>
                          <p className="text-xs text-gray-500 mt-1">{formatPrice(item.price)}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <button type="button" onClick={function () { cart.updateQuantity(item.id, item.quantity - 1) }} className="w-7 h-7 rounded-lg border border-gray-200">-</button>
                            <span className="text-sm font-semibold min-w-6 text-center">{item.quantity}</span>
                            <button type="button" onClick={function () { cart.updateQuantity(item.id, item.quantity + 1) }} className="w-7 h-7 rounded-lg border border-gray-200">+</button>
                            <button type="button" onClick={function () { cart.removeItem(item.id) }} className="ml-auto text-xs text-crimson-500 font-semibold">Remove</button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div className="flex items-center justify-between pt-4">
                  <span className="font-semibold text-gray-700">Subtotal</span>
                  <span className="text-xl font-bold text-brand-800">{formatCurrency(cart.subtotal)}</span>
                </div>
              </aside>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
