'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'
import { getCategories } from '@/lib/categories'
import { getProducts } from '@/lib/products'

var SORT_OPTIONS = [
  { value: 'name-asc', label: 'Name: A-Z' },
  { value: 'name-desc', label: 'Name: Z-A' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
]

function parsePrice(priceStr) {
  if (!priceStr) return 0
  return parseFloat(priceStr.replace(/[₹,\s]/g, '')) || 0
}

export default function ProductsPage() {
  var { lang, t } = useTranslation()
  var [allProducts, setAllProducts] = useState([])
  var [categories, setCategories] = useState([])
  var [loading, setLoading] = useState(true)
  var [search, setSearch] = useState('')
  var [selectedCategory, setSelectedCategory] = useState('')
  var [sort, setSort] = useState('name-asc')
  var [showFilters, setShowFilters] = useState(false)

  useEffect(function () {
    Promise.all([getProducts(), getCategories()]).then(function ([products, cats]) {
      setAllProducts(products)
      setCategories(cats)
      setLoading(false)
    })
  }, [])

  var filtered = useMemo(function () {
    var result = allProducts.slice()

    if (selectedCategory) {
      result = result.filter(function (p) { return p.category === selectedCategory })
    }

    if (search.trim()) {
      var q = search.trim().toLowerCase()
      result = result.filter(function (p) {
        return p.name.toLowerCase().includes(q) ||
          (p.brand && p.brand.toLowerCase().includes(q)) ||
          (p.category && p.category.toLowerCase().includes(q))
      })
    }

    result.sort(function (a, b) {
      switch (sort) {
        case 'name-desc': return b.name.localeCompare(a.name)
        case 'price-asc': return parsePrice(a.price) - parsePrice(b.price)
        case 'price-desc': return parsePrice(b.price) - parsePrice(a.price)
        default: return a.name.localeCompare(b.name)
      }
    })

    return result
  }, [allProducts, selectedCategory, search, sort])

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 py-12 md:py-16">
        <div className="container-custom">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/" className="text-gray-400 hover:text-accent-400 text-sm transition-colors">{t('nav.home')}</Link>
            <span className="text-gray-500 text-sm">/</span>
            <span className="text-gray-300 text-sm">All Products</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">All Products</h1>
          <p className="text-lg text-gray-300">Browse our full range of electronics and home appliances</p>
        </div>
      </section>

      <section className="py-8 md:py-12 bg-gray-50 min-h-[60vh]">
        <div className="container-custom">
          {/* Top bar: search + sort + mobile filter toggle */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search products, brands..."
                value={search}
                onChange={function (e) { setSearch(e.target.value) }}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent"
              />
            </div>

            <select
              value={sort}
              onChange={function (e) { setSort(e.target.value) }}
              className="px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 cursor-pointer"
            >
              {SORT_OPTIONS.map(function (opt) {
                return <option key={opt.value} value={opt.value}>{opt.label}</option>
              })}
            </select>

            <button
              onClick={function () { setShowFilters(function (v) { return !v }) }}
              className="md:hidden px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filters
            </button>
          </div>

          <div className="flex gap-8">
            {/* Sidebar - desktop always visible, mobile toggle */}
            <aside
              className={
                'w-56 shrink-0 ' +
                (showFilters ? 'block' : 'hidden') +
                ' md:block'
              }
            >
              <div className="bg-white rounded-xl border border-gray-200 p-4 sticky top-24">
                <h3 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wide">Categories</h3>
                <ul className="space-y-0.5">
                  <li>
                    <button
                      onClick={function () { setSelectedCategory(''); setShowFilters(false) }}
                      className={
                        'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ' +
                        (!selectedCategory ? 'bg-brand-50 text-brand-700 font-semibold' : 'text-gray-600 hover:bg-gray-50')
                      }
                    >
                      All Products
                    </button>
                  </li>
                  {categories.map(function (cat) {
                    var catName = lang === 'hi' ? (cat.nameHi || cat.name) : lang === 'mr' ? (cat.nameMr || cat.name) : cat.name
                    return (
                      <li key={cat.id}>
                        <button
                          onClick={function () { setSelectedCategory(cat.id); setShowFilters(false) }}
                          className={
                            'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ' +
                            (selectedCategory === cat.id ? 'bg-brand-50 text-brand-700 font-semibold' : 'text-gray-600 hover:bg-gray-50')
                          }
                        >
                          {catName}
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 min-w-0">
              {loading ? (
                <div className="text-center py-16">
                  <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-400">Loading products...</p>
                </div>
              ) : filtered.length > 0 ? (
                <>
                  <p className="text-sm text-gray-500 mb-4">
                    Showing <span className="font-semibold text-gray-800">{filtered.length}</span>{' '}
                    {filtered.length === 1 ? 'product' : 'products'}
                    {selectedCategory ? ' in ' + (categories.find(function (c) { return c.id === selectedCategory })?.name || selectedCategory) : ''}
                  </p>
                  <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
                    {filtered.map(function (product) {
                      return (
                        <Link
                          key={product.id}
                          href={'/product/' + product.slug}
                          className="card group bg-white overflow-hidden flex flex-col"
                        >
                          <div className="aspect-[4/3] bg-gradient-to-br from-brand-50 to-surface-low flex items-center justify-center p-6 relative">
                            {product.image && product.image !== '/images/placeholder.svg' ? (
                              <img
                                src={product.image}
                                alt={product.name}
                                onError={function (e) { e.target.src = '/images/placeholder.svg'; e.target.onerror = null }}
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <div className="w-16 h-16 bg-brand-600/10 rounded-xl flex items-center justify-center">
                                <span className="text-2xl font-bold text-brand-600">
                                  {product.brand ? product.brand[0] : (product.name ? product.name[0] : '?')}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="p-4 flex flex-col flex-1">
                            {product.brand && (
                              <span className="text-[11px] font-bold text-accent-200 uppercase tracking-wider">
                                {product.brand}
                              </span>
                            )}
                            <h3 className="text-sm font-semibold text-on-surface mt-1 line-clamp-2 group-hover:text-brand-700 transition-colors leading-snug flex-1">
                              {product.name}
                            </h3>
                            {product.description && (
                              <p className="text-xs text-gray-400 mt-1 line-clamp-1">{product.description}</p>
                            )}
                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-outline-variant">
                              <span className="text-base font-bold text-brand-800">{product.price || '—'}</span>
                              <span className="text-xs bg-brand-700 text-white px-3 py-1.5 rounded-xl hover:bg-brand-800 active:scale-95 transition-all font-semibold">
                                Enquire
                              </span>
                            </div>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                </>
              ) : (
                <div className="text-center py-16">
                  <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <h3 className="text-xl font-semibold text-gray-500 mb-2">No products found</h3>
                  <p className="text-gray-400 mb-6">
                    {search ? 'Try a different search term or category.' : 'No products match the selected filters.'}
                  </p>
                  <button
                    onClick={function () { setSearch(''); setSelectedCategory('') }}
                    className="btn-primary text-sm"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
