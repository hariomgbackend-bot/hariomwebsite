'use client'

import { useState, useEffect } from 'react'
import { useParams, notFound } from 'next/navigation'
import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'
import { getProductBySlug, getProducts, formatPrice } from '@/lib/products'
import { getCategoryBySlug } from '@/lib/categories'
import AddToCartButton from '@/components/AddToCartButton'

export default function ProductDetailPage() {
  var params = useParams()
  var { lang, t } = useTranslation()
  var [product, setProduct] = useState(null)
  var [category, setCategory] = useState(null)
  var [loading, setLoading] = useState(true)
  var [selectedImage, setSelectedImage] = useState(0)
  var [similar, setSimilar] = useState([])

  useEffect(function () {
    setLoading(true)
    getProductBySlug(params.slug).then(function (p) {
      if (!p) { setLoading(false); return }
      setProduct(p)
      setSelectedImage(0)
      Promise.all([
        getCategoryBySlug(p.category),
        getProducts(p.category)
      ]).then(function ([c, all]) {
        setCategory(c)
        setSimilar(all.filter(function (x) { return x.id !== p.id }).slice(0, 10))
      }).catch(function () {})
      setLoading(false)
    }).catch(function () { setLoading(false) })
  }, [params.slug])

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!product) return notFound()

  var catName = category
    ? (lang === 'hi' ? (category.nameHi || category.name) : lang === 'mr' ? (category.nameMr || category.name) : category.name)
    : product.category

  var images = product.images && product.images.length > 0 ? product.images : [product.image]

  return (
    <>
      {/* Breadcrumb */}
      <section className="bg-white border-b border-gray-100">
        <div className="container-custom py-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-brand-700 transition-colors">{t('nav.home')}</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-brand-700 transition-colors">All Products</Link>
            <span>/</span>
            {category && (
              <>
                <Link href={'/products/' + product.category} className="hover:text-brand-700 transition-colors">{catName}</Link>
                <span>/</span>
              </>
            )}
            <span className="text-gray-800 font-medium truncate max-w-[200px]">{product.name}</span>
          </div>
        </div>
      </section>

      {/* Product Details */}
      <section className="py-8 md:py-12 bg-gray-50">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Image Gallery */}
            <div>
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-4 aspect-square flex items-center justify-center p-8">
                  {images[selectedImage] && images[selectedImage] !== '/images/placeholder.svg' ? (
                    <img
                      src={images[selectedImage]}
                      alt={product.name}
                      onError={function (e) { e.target.src = '/images/placeholder.svg'; e.target.onerror = null }}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                  <div className="w-32 h-32 bg-brand-600/10 rounded-2xl flex items-center justify-center">
                    <span className="text-5xl font-bold text-brand-600">
                      {product.brand ? product.brand[0] : product.name[0]}
                    </span>
                  </div>
                )}
              </div>
              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {images.map(function (img, i) {
                    return (
                      <button
                        key={i}
                        onClick={function () { setSelectedImage(i) }}
                        className={
                          'w-16 h-16 shrink-0 rounded-xl border-2 overflow-hidden p-1 bg-white transition-colors ' +
                          (i === selectedImage ? 'border-brand-600' : 'border-gray-200 hover:border-gray-300')
                        }
                      >
                        <img src={img} alt="" onError={function (e) { e.target.src = '/images/placeholder.svg'; e.target.onerror = null }} className="w-full h-full object-contain" />
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              {product.brand && (
                <span className="text-xs font-bold text-accent-200 uppercase tracking-wider">{product.brand}</span>
              )}
              <h1 className="text-2xl md:text-3xl font-bold text-brand-800 mt-2 leading-tight">{product.name}</h1>

              {category && (
                <Link
                  href={'/products/' + product.category}
                  className="inline-block mt-3 text-sm text-gray-500 hover:text-brand-700 transition-colors"
                >
                  Category: <span className="font-medium">{catName}</span>
                </Link>
              )}

              <div className="mt-6">
                <span className="text-2xl md:text-3xl font-bold text-brand-800">{formatPrice(product.price) || 'Call for Price'}</span>
              </div>

              {/* Key highlights */}
              <div className="mt-6 grid grid-cols-2 gap-3">
                {[
                  { label: 'Brand', value: product.brand || '—' },
                  { label: 'Category', value: catName },
                ].map(function (item) {
                  return (
                    <div key={item.label} className="bg-white rounded-xl border border-gray-100 p-3">
                      <div className="text-xs text-gray-400">{item.label}</div>
                      <div className="text-sm font-semibold text-gray-800 mt-0.5">{item.value}</div>
                    </div>
                  )
                })}
              </div>

              {product.description && (
                <div className="mt-6">
                  <h3 className="text-sm font-bold text-gray-800 mb-2">Description</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <AddToCartButton product={product} />
              </div>
              <div className="mt-3 flex flex-col sm:flex-row gap-3">
                <a href={'https://wa.me/' + (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '918177896218') + '?text=' + encodeURIComponent('Hi! I am interested in ' + product.name)} target="_blank" rel="noopener noreferrer" className="btn-primary-light flex-1 text-center">Enquire on WhatsApp</a>
                <Link href="/contact" className="btn-primary-light flex-1 text-center">Contact Us</Link>
              </div>

              {/* Trust badges */}
              <div className="mt-8 flex flex-wrap gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">100% Genuine</span>
                <span className="flex items-center gap-1">Best Price Guarantee</span>
                <span className="flex items-center gap-1">Authorized Dealer</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Similar Products */}
      {similar.length > 0 && (
        <section className="py-12 bg-white">
          <div className="container-custom">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-brand-800">Similar Products</h2>
              <Link href={'/products/' + product.category} className="text-sm text-accent-600 hover:text-accent-700 font-semibold">View All</Link>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-thin" style={{scrollbarWidth:'thin'}}>
              {similar.map(function (sp) {
                return (
                  <Link
                    key={sp.id}
                    href={'/product/' + sp.slug}
                    className="min-w-[90px] md:min-w-[110px] bg-white rounded-lg border border-gray-100 hover:shadow-sm transition-shadow overflow-hidden shrink-0 snap-start group"
                  >
                    <div className="h-16 md:h-20 bg-gradient-to-br from-brand-50 to-surface-low flex items-center justify-center p-2">
                      {sp.image && sp.image !== '/images/placeholder.svg' ? (
                        <img src={sp.image} alt={sp.name} className="h-full w-full object-contain" onError={function (e) { e.target.src = '/images/placeholder.svg'; e.target.onerror = null }} />
                      ) : (
                        <div className="w-6 h-6 bg-brand-600/10 rounded-lg flex items-center justify-center">
                          <span className="text-[10px] font-bold text-brand-600">{sp.brand ? sp.brand[0] : sp.name[0]}</span>
                        </div>
                      )}
                    </div>
                    <div className="p-1.5">
                      {sp.brand && <span className="text-[8px] font-bold text-accent-200 uppercase leading-tight block truncate">{sp.brand}</span>}
                      <h3 className="text-[10px] font-semibold text-gray-800 line-clamp-2 group-hover:text-brand-700 transition-colors leading-snug mt-0.5">{sp.name}</h3>
                      <span className="text-[11px] font-bold text-brand-800 mt-0.5 block">{formatPrice(sp.price)}</span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
