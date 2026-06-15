'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useCart } from '@/lib/cart'

export default function AddToCartButton({ product }) {
  var cart = useCart()
  var [added, setAdded] = useState(false)
  var [qty, setQty] = useState(1)

  function inc() { setQty(function (n) { return Math.min(99, n + 1) }) }
  function dec() { setQty(function (n) { return Math.max(1, n - 1) }) }

  function add() {
    cart.addItem(product, qty)
    setAdded(true)
    setTimeout(function () { setAdded(false) }, 1800)
  }

  function buyNow() {
    cart.addItem(product, qty)
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Quantity selector */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-semibold text-gray-700">Quantity</span>
        <div className="inline-flex items-center border border-gray-200 rounded-xl overflow-hidden">
          <button
            type="button"
            onClick={dec}
            disabled={qty <= 1}
            className="w-10 h-10 flex items-center justify-center text-lg text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="w-12 text-center text-sm font-bold text-gray-800 select-none">{qty}</span>
          <button
            type="button"
            onClick={inc}
            disabled={qty >= 99}
            className="w-10 h-10 flex items-center justify-center text-lg text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3 w-full">
        <button type="button" onClick={add} className="btn-primary flex-1">
          {added ? '✓ Added to Cart' : 'Add to Cart'}
        </button>
        <Link href="/checkout" onClick={buyNow} className="btn-accent flex-1 text-center">
          Buy Now
        </Link>
      </div>
    </div>
  )
}
