'use client'

import { useState, useEffect, useCallback } from 'react'
import { db, storage } from '@/lib/firebase'
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import fallbackProducts from '@/data/products'
import { getCategories } from '@/lib/categories'

var COLLECTION = 'products'

async function loadAllProducts() {
  if (!db) return fallbackProducts
  try {
    var snap = await getDocs(collection(db, COLLECTION))
    return snap.docs.map(function (d) { return { id: d.id, ...d.data() } })
  } catch (e) {
    console.error('loadAllProducts error:', e)
    return fallbackProducts
  }
}

export default function AdminProductsPage() {
  var [products, setProducts] = useState([])
  var [categories, setCategories] = useState([])
  var [loading, setLoading] = useState(true)
  var [showModal, setShowModal] = useState(false)
  var [editing, setEditing] = useState(null)
  var [saving, setSaving] = useState(false)

  var [name, setName] = useState('')
  var [slug, setSlug] = useState('')
  var [brand, setBrand] = useState('')
  var [category, setCategory] = useState('')
  var [price, setPrice] = useState(0)
  var [description, setDescription] = useState('')
  var [featured, setFeatured] = useState(false)
  var [isVisible, setIsVisible] = useState(true)
  var [imageFiles, setImageFiles] = useState([])
  var [imagePreviews, setImagePreviews] = useState([])
  var [existingImages, setExistingImages] = useState([])

  function load() {
    setLoading(true)
    Promise.all([loadAllProducts(), getCategories()]).then(function ([p, c]) {
      setProducts(p)
      setCategories(c)
      setLoading(false)
    })
  }

  useEffect(function () { load() }, [])

  function openAdd() {
    setEditing(null)
    setName(''); setSlug(''); setBrand(''); setCategory(categories[0]?.id || '')
    setPrice(0); setDescription(''); setFeatured(false); setIsVisible(true)
    setImageFiles([]); setImagePreviews([]); setExistingImages([])
    setShowModal(true)
  }

  function openEdit(product) {
    setEditing(product)
    setName(product.name || '')
    setSlug(product.slug || '')
    setBrand(product.brand || '')
    setCategory(product.category || '')
    setPrice(product.price || 0)
    setDescription(product.description || '')
    setFeatured(product.featured === true)
    setIsVisible(product.is_visible !== false)
    setExistingImages(product.images || [])
    setImageFiles([]); setImagePreviews([])
    setShowModal(true)
  }

  function handleImages(e) {
    var files = Array.from(e.target.files || [])
    setImageFiles(files)
    var previews = files.map(function (f) { return URL.createObjectURL(f) })
    setImagePreviews(previews)
  }

  var handleSave = useCallback(async function () {
    if (!name.trim() || !brand.trim()) return
    setSaving(true)
    try {
      var imageUrls = existingImages.slice()

      for (var i = 0; i < imageFiles.length; i++) {
        var file = imageFiles[i]
        var storageRef = ref(storage, 'products/' + Date.now() + '_' + file.name)
        var snap = await uploadBytes(storageRef, file)
        var url = await getDownloadURL(snap.ref)
        imageUrls.push(url)
      }

      var data = {
        name: name.trim(),
        slug: slug.trim() || name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        brand: brand.trim(),
        category: category,
        price: Number(price),
        description: description.trim() || '',
        featured: featured,
        is_visible: isVisible,
        images: imageUrls,
      }

      if (editing) {
        await updateDoc(doc(db, COLLECTION, editing.id), { ...data, updatedAt: serverTimestamp() })
      } else {
        await addDoc(collection(db, COLLECTION), { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() })
      }

      setShowModal(false)
      load()
    } catch (err) {
      alert('Error saving product: ' + err.message)
    } finally {
      setSaving(false)
    }
  }, [name, slug, brand, category, price, description, featured, isVisible, imageFiles, existingImages, editing])

  async function handleDelete(product) {
    if (!confirm('Delete "' + product.name + '"?')) return
    try {
      await deleteDoc(doc(db, COLLECTION, product.id))
      load()
    } catch (err) {
      alert('Error deleting product: ' + err.message)
    }
  }

  function removeExistingImage(idx) {
    setExistingImages(function (prev) { return prev.filter(function (_, i) { return i !== idx }) })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-[#0B1F4B]">Products</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage products listed on the website</p>
        </div>
        <button onClick={openAdd} className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#FF5E1A] text-white text-sm font-semibold rounded-xl hover:bg-[#e04a0a] transition-colors shadow-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Product
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 text-gray-400">No products yet.</div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Product</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Brand</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Category</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">Price</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600">Visible</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(function (p) {
                return (
                  <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                          {(p.images && p.images[0]) ? (
                            <img src={p.images[0]} alt="" className="w-full h-full object-contain" />
                          ) : (
                            <span className="flex items-center justify-center w-full h-full text-xs font-bold text-gray-400">{p.name?.[0]}</span>
                          )}
                        </div>
                        <span className="font-medium text-gray-800 truncate max-w-[200px]">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{p.brand}</td>
                    <td className="px-4 py-3 text-gray-600">{p.category}</td>
                    <td className="px-4 py-3 text-right font-medium text-gray-800">
                      {'\u20B9' + Number(p.price || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={'inline-block w-2 h-2 rounded-full ' + (p.is_visible !== false ? 'bg-green-500' : 'bg-red-400')}></span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={function () { openEdit(p) }} className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors mr-1">Edit</button>
                      <button onClick={function () { handleDelete(p) }} className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors">Delete</button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg mx-4 p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-[#0B1F4B]">{editing ? 'Edit Product' : 'Add Product'}</h2>
              <button onClick={function () { setShowModal(false) }} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                  <input type="text" value={name} onChange={function (e) { setName(e.target.value) }} className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-[#FF5E1A] focus:ring-2 focus:ring-[#FF5E1A]/20 outline-none transition-all" placeholder="Samsung 55 4K Smart TV" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Brand *</label>
                  <input type="text" value={brand} onChange={function (e) { setBrand(e.target.value) }} className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-[#FF5E1A] focus:ring-2 focus:ring-[#FF5E1A]/20 outline-none transition-all" placeholder="Samsung" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL path)</label>
                <input type="text" value={slug} onChange={function (e) { setSlug(e.target.value) }} className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-[#FF5E1A] focus:ring-2 focus:ring-[#FF5E1A]/20 outline-none transition-all" placeholder="Auto-generated from name if empty" />
                <p className="text-xs text-gray-400 mt-1">Leave empty to auto-generate from product name</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select value={category} onChange={function (e) { setCategory(e.target.value) }} className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-[#FF5E1A] focus:ring-2 focus:ring-[#FF5E1A]/20 outline-none transition-all">
                    {categories.map(function (c) { return <option key={c.id || c.name} value={c.id || c.name}>{c.name}</option> })}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                  <input type="number" value={price} onChange={function (e) { setPrice(Number(e.target.value)) }} className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-[#FF5E1A] focus:ring-2 focus:ring-[#FF5E1A]/20 outline-none transition-all" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={description} onChange={function (e) { setDescription(e.target.value) }} rows={3} className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-[#FF5E1A] focus:ring-2 focus:ring-[#FF5E1A]/20 outline-none transition-all resize-none" />
              </div>

              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={featured} onChange={function (e) { setFeatured(e.target.checked) }} className="w-4 h-4 accent-[#FF5E1A]" />
                  <span className="text-sm text-gray-700">Featured product</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={isVisible} onChange={function (e) { setIsVisible(e.target.checked) }} className="w-4 h-4 accent-[#FF5E1A]" />
                  <span className="text-sm text-gray-700">Visible on site</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Images</label>
                <input type="file" accept="image/*" multiple onChange={handleImages} className="w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-[#fff4ed] file:text-[#FF5E1A] hover:file:bg-[#ffe8d5] transition-colors" />
                {existingImages.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {existingImages.map(function (url, i) {
                      return (
                        <div key={i} className="relative w-16 h-16 rounded-lg border border-gray-200 overflow-hidden group">
                          <img src={url} alt="" className="w-full h-full object-cover" />
                          <button onClick={function () { removeExistingImage(i) }} className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                          </button>
                        </div>
                      )
                    })}
                  </div>
                )}
                {imagePreviews.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {imagePreviews.map(function (url, i) {
                      return <div key={i} className="w-16 h-16 rounded-lg border border-gray-200 overflow-hidden"><img src={url} alt="" className="w-full h-full object-cover" /></div>
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
              <button onClick={handleSave} disabled={saving || !name.trim() || !brand.trim()} className="flex-1 px-4 py-2.5 bg-[#0B1F4B] text-white text-sm font-semibold rounded-xl hover:bg-[#071035] disabled:opacity-50 transition-colors">
                {saving ? 'Saving...' : editing ? 'Update Product' : 'Add Product'}
              </button>
              <button onClick={function () { setShowModal(false) }} className="px-4 py-2.5 border border-gray-300 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
