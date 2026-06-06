'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useCart } from '@/lib/cart'

export default function AddToCartButton({ product }) {
  var cart = useCart()
  var [added, setAdded] = useState(false)

  function add() {
    cart.addItem(product, 1)
    setAdded(true)
    setTimeout(function () { setAdded(false) }, 1800)
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full">
      <button type="button" onClick={add} className="btn-primary flex-1">
        {added ? 'Added to Cart' : 'Add to Cart'}
      </button>
      <Link href="/checkout" onClick={add} className="btn-accent flex-1 text-center">
        Buy Now
      </Link>
    </div>
  )
}
