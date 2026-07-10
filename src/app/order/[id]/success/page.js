'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { getOrderById } from '@/lib/orders'
import { formatCurrency } from '@/lib/cart'

function formatDate(ts) {
  if (!ts) return ''
  var secs = ts.seconds != null ? ts.seconds * 1000 : (ts instanceof Date ? ts.getTime() : null)
  if (!secs) return ''
  return new Date(secs).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

export default function OrderSuccessPage() {
  var params = useParams()
  var [order, setOrder] = useState(null)
  var [loading, setLoading] = useState(true)
  var [error, setError] = useState('')

  useEffect(function () {
    if (!params.id) return
    getOrderById(params.id)
      .then(function (data) {
        if (!data) { setError('Order not found.'); return }
        setOrder(data)
      })
      .catch(function (err) {
        setError(err.message || 'Unable to load order.')
      })
      .finally(function () { setLoading(false) })
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
      </div>
    )
  }

  var paid = order && order.paymentStatus === 'paid'
  var isOnline = order && order.paymentMethod === 'razorpay'

  return (
    <section className="py-12 md:py-16 bg-gray-50 min-h-[60vh]">
      <div className="container-custom max-w-2xl">

        {error ? (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-crimson-100 flex items-center justify-center">
              <svg className="w-7 h-7 text-crimson-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-brand-800 mb-2">We couldn&apos;t find that order</h1>
            <p className="text-sm text-gray-500 mb-6">{error}</p>
            <Link href="/products" className="btn-primary">Continue Shopping</Link>
          </div>
        ) : order ? (
          <div className="space-y-6">

            {/* Status hero */}
            <div className={'rounded-2xl p-8 text-center border ' + (paid ? 'bg-green-50 border-green-200' : 'bg-brand-50 border-brand-200')}>
              <div className={'w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ' + (paid ? 'bg-green-500' : 'bg-brand-700')}>
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-brand-800 mb-1">
                {paid ? 'Payment Successful!' : 'Order Placed!'}
              </h1>
              <p className="text-sm text-gray-600">
                {paid
                  ? 'Thank you! Your payment has been received and your order is confirmed.'
                  : 'Thank you for your order. Our team will call you shortly to confirm availability and payment.'}
              </p>
            </div>

            {/* Order meta */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Order ID</span>
                <span className="font-mono font-bold text-brand-800">{order.id}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Placed on</span>
                <span className="text-gray-800">{formatDate(order.createdAt)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Payment</span>
                <span className={'font-semibold ' + (paid ? 'text-green-600' : 'text-gray-700')}>
                  {isOnline ? (paid ? 'Paid online' : 'Pending') : (order.paymentMethod || '—').toUpperCase()}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Status</span>
                <span className="font-semibold text-brand-700 capitalize">{order.status || 'new'}</span>
              </div>
            </div>

            {/* Items */}
            {order.items && order.items.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="font-bold text-brand-800 mb-4">Items</h2>
                <div className="space-y-4">
                  {order.items.map(function (item) {
                    return (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                          {item.image ? (
                            <img src={item.image} alt="" className="w-full h-full object-contain" />
                          ) : (
                            <span className="text-sm font-bold text-brand-600">{(item.name || '?')[0]}</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800 line-clamp-1">{item.name}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
                  <span className="font-semibold text-gray-700">Total</span>
                  <span className="text-xl font-bold text-brand-800">{formatCurrency(order.total || order.subtotal)}</span>
                </div>
              </div>
            )}

            {/* Delivery (if present) */}
            {order.customer && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="font-bold text-brand-800 mb-3">Delivery Details</h2>
                <p className="text-sm text-gray-700 font-medium">{order.customer.name}</p>
                <p className="text-sm text-gray-600">{order.customer.phone}</p>
                {order.customer.address && (
                  <p className="text-sm text-gray-600 mt-1">
                    {order.customer.address}{order.customer.landmark ? ', ' + order.customer.landmark : ''}
                  </p>
                )}
                <p className="text-sm text-gray-600">
                  {[order.customer.locality, order.customer.city, order.customer.state, order.customer.pincode].filter(Boolean).join(', ')}
                </p>
              </div>
            )}

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/products" className="btn-primary flex-1 text-center">Continue Shopping</Link>
              <a
                href={'https://wa.me/918177896218?text=' + encodeURIComponent('Hi! I have a question about my order ' + order.id)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-accent flex-1 text-center"
              >
                Track on WhatsApp
              </a>
            </div>

            <p className="text-xs text-center text-gray-400 pt-2">
              Please keep your Order ID for reference. Save this page or write it down.
            </p>
          </div>
        ) : null}
      </div>
    </section>
  )
}
