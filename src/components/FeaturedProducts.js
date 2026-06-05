'use client'

import products from '@/data/products'

// Brand colour map for the placeholder badge
const brandColors = {
  Samsung: 'bg-blue-50 text-blue-700',
  LG:      'bg-red-50 text-red-700',
  Sony:    'bg-gray-50 text-gray-700',
  Voltas:  'bg-orange-50 text-orange-700',
  Whirlpool: 'bg-cyan-50 text-cyan-700',
}

export default function FeaturedProducts() {
  const featured = products.filter((p) => p.featured).slice(0, 8)

  return (
    <section className="py-14 md:py-20 bg-surface-container">
      <div className="container-custom">
        <div className="text-center mb-10 md:mb-12">
          <h2 className="section-title">Featured Products</h2>
          <p className="section-subtitle">Our most popular products across categories</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {featured.map((product) => (
            <div
              key={product.id}
              className="card group bg-white overflow-hidden flex flex-col"
            >
              {/* Product image area */}
              <div className="aspect-[4/3] bg-gradient-to-br from-brand-50 to-surface-low flex items-center justify-center p-6 relative">
                {/* Placeholder brand badge */}
                <div
                  className={`w-20 h-20 rounded-2xl flex items-center justify-center shadow-sm ${
                    brandColors[product.brand] || 'bg-brand-50 text-brand-700'
                  }`}
                >
                  <span className="text-3xl font-bold">{product.brand[0]}</span>
                </div>
                {/* "Featured" chip */}
                <span className="absolute top-3 left-3 px-2.5 py-1 bg-crimson-500 text-white text-[10px] font-bold rounded-full tracking-wide uppercase">
                  Featured
                </span>
              </div>

              {/* Content */}
              <div className="p-4 flex flex-col flex-1">
                <span className="text-[11px] font-bold text-accent-200 uppercase tracking-wider">
                  {product.brand}
                </span>
                <h3 className="text-sm font-semibold text-on-surface mt-1 line-clamp-2 group-hover:text-brand-700 transition-colors leading-snug flex-1">
                  {product.name}
                </h3>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-outline-variant">
                  <span className="text-base font-bold text-brand-800">{product.price}</span>
                  <button className="text-xs bg-brand-700 text-white px-3.5 py-1.5 rounded-xl hover:bg-brand-800 active:scale-95 transition-all font-semibold">
                    Enquire
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
