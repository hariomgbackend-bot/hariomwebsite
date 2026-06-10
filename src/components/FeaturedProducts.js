'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
export default function FeaturedProducts() {
  const [products, setProducts] = useState([])
  const [activeTab, setActiveTab] = useState('all')
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, { cache: 'no-store' })
      .then((r) => r.json())
      .then((data) => {
        const featured = data.filter((p) => p.featured)
        setProducts(featured)
      })
      .catch(() => {})
  }, [])

  const categories = [...new Set(products.map((p) => p.category?.name || 'Uncategorized'))]
  const filtered = activeTab === 'all' ? products : products.filter((p) => (p.category?.name || 'Uncategorized') === activeTab)

  const formatPrice = (price) => {
    const num = Number(price)
    if (isNaN(num)) return price
    return `₹${num.toLocaleString('en-IN')}`
  }

  if (!products.length) return null

  return (
    <section ref={ref} className="py-14 md:py-20 bg-white">
      <div className="container-custom">
        <div className="text-center mb-10 md:mb-12">
          <span className="section-badge">Products</span>
          <h2 className="section-title font-heading">Featured Products</h2>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8 md:mb-10">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeTab === 'all'
                ? 'bg-[#FF5E1A] text-white shadow-[0_4px_16px_rgba(255,94,26,0.25)]'
                : 'bg-[#F4F6FB] text-[#1b1b1d] hover:bg-[#FF5E1A]/10'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === cat
                  ? 'bg-[#FF5E1A] text-white shadow-[0_4px_16px_rgba(255,94,26,0.25)]'
                  : 'bg-[#F4F6FB] text-[#1b1b1d] hover:bg-[#FF5E1A]/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
          {filtered.map((product, i) => (
            <Link
              key={product._id}
              href={`/product/${product.slug}`}
              className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-[0_8px_32px_rgba(255,94,26,0.12)] transition-all duration-500"
              style={{
                animationDelay: `${i * 80}ms`,
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(24px)',
                transition: 'opacity 0.5s ease, transform 0.5s ease, box-shadow 0.3s ease',
              }}
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
                <Image
                  src={product.images?.[0] || '/placeholder.png'}
                  alt={product.name}
                  fill
                  className="object-contain p-3 transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  {product.featured && (
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-[#FF5E1A] text-white px-2 py-0.5 rounded-md shadow-sm">
                      Featured
                    </span>
                  )}
                  {product.originalPrice && (
                    <span className="text-[10px] font-bold bg-green-500 text-white px-2 py-0.5 rounded-md shadow-sm">
                      {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                    </span>
                  )}
                </div>
                {/* Quick add overlay */}
                <div className="absolute inset-0 bg-[#0B1F4B]/0 group-hover:bg-[#0B1F4B]/5 transition-colors duration-300" />
              </div>

              {/* Content */}
              <div className="p-3 md:p-4">
                <h3 className="text-sm md:text-base font-bold text-[#1b1b1d] leading-snug line-clamp-2 group-hover:text-[#FF5E1A] transition-colors">
                  {product.name}
                </h3>
                <p className="text-xs text-gray-400 mt-1 line-clamp-1">
                  {product.category?.name}
                </p>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-sm md:text-base font-bold text-[#1b1b1d]">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xs text-gray-300 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
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
          ))}
        </div>

        {/* View all */}
        <div className="text-center mt-10">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-7 py-3 bg-[#0B1F4B] text-white font-semibold rounded-xl hover:bg-[#FF5E1A] transition-all duration-300 hover:shadow-[0_6px_24px_rgba(255,94,26,0.3)]"
          >
            View All
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
