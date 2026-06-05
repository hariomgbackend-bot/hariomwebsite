'use client'

import products from '@/data/products'

export default function FeaturedProducts() {
  const featured = products.filter((p) => p.featured).slice(0, 8)

  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-8 md:mb-10">
          <h2 className="section-title">Featured Products</h2>
          <p className="section-subtitle">Our most popular products across categories</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {featured.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 group"
            >
              <div className="aspect-[4/3] bg-gradient-to-br from-brand-100 to-brand-50 flex items-center justify-center p-6">
                <div className="w-16 h-16 bg-brand-600/10 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-brand-600">{product.brand[0]}</span>
                </div>
              </div>
              <div className="p-3 md:p-4">
                <span className="text-xs font-medium text-accent-500 uppercase">{product.brand}</span>
                <h3 className="text-sm font-semibold text-gray-800 mt-1 line-clamp-2 group-hover:text-brand-600 transition-colors">
                  {product.name}
                </h3>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-base font-bold text-brand-800">{product.price}</span>
                  <button className="text-xs bg-brand-600 text-white px-3 py-1.5 rounded-lg hover:bg-brand-700 transition-colors">
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
