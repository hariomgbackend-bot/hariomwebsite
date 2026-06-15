'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getFeaturedProducts } from '@/lib/products'
import { formatPrice } from '@/lib/products'

export default function FeaturedProducts() {
  const [products, setProducts] = useState([])
  const [error, setError] = useState(false)

  useEffect(() => {
    getFeaturedProducts(12)
      .then((data) => {
        setProducts(data)
        setError(false)
      })
      .catch(() => {
        setError(true)
      })
  }, [])

  if (error) return null
  if (!products.length) return null

  return (
    <section className="py-14 md:py-20 bg-white">
      <div className="container-custom">
        <div className="text-center mb-10 md:mb-12">
          <span className="section-badge">Products</span>
          <h2 className="section-title font-heading">Featured Products</h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
          {products.map((product) => {
            const onImgError = (e) => {
              e.target.onerror = null
              e.target.src = '/images/placeholder.svg'
            }
            return (
              <Link
                  key={product.id}
                  href={`/product/${product.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-[0_8px_32px_rgba(255,94,26,0.12)] transition-all duration-500"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-50 rounded-xl mx-3 md:mx-4 mt-3 md:mt-4 shadow-sm flex items-center justify-center p-3">
                  {product.image && product.image !== '/images/placeholder.svg' ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      onError={onImgError}
                      className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-brand-600/10 rounded-xl flex items-center justify-center">
                      <span className="text-2xl font-bold text-brand-600">
                        {product.brand ? product.brand[0] : product.name[0]}
                      </span>
                    </div>
                  )}
                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {product.featured && (
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-[#FF5E1A] text-white px-2 py-0.5 rounded-md shadow-sm">
                        Featured
                      </span>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-[#0B1F4B]/0 group-hover:bg-[#0B1F4B]/5 transition-colors duration-300 pointer-events-none" />
                </div>

                {/* Content */}
                <div className="p-3 md:p-4">
                  {product.brand && (
                    <span className="text-[10px] font-bold text-accent-500 uppercase tracking-wider">
                      {product.brand}
                    </span>
                  )}
                  <h3 className="text-sm md:text-base font-bold text-[#1b1b1d] leading-snug line-clamp-2 group-hover:text-[#FF5E1A] transition-colors mt-0.5">
                    {product.name}
                  </h3>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-sm md:text-base font-bold text-[#1b1b1d]">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                  <div className="mt-3">
                    <span className="text-xs font-semibold text-[#FF5E1A] group-hover:underline underline-offset-2 inline-flex items-center gap-1">
                      Shop Now
                      <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* View all */}
        <div className="text-center mt-10">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-7 py-3 bg-[#0B1F4B] text-white font-semibold rounded-xl hover:bg-[#FF5E1A] transition-all duration-300 hover:shadow-[0_6px_24px_rgba(255,94,26,0.3)]"
          >
            View All Products
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
