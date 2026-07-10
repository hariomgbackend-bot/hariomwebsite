'use client'

import { useState, useEffect, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import { db } from '@/lib/firebase'
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { storage } from '@/lib/firebase'
import staticBrands from '@/data/brands'

function getCroppedImg(imageSrc, crop, zoom) {
  return new Promise(function (resolve) {
    var canvas = document.createElement('canvas')
    var ctx = canvas.getContext('2d')
    var img = new Image()
    img.onload = function () {
      var size = Math.min(img.width, img.height)
      var sx = (img.width - size) / 2
      var sy = (img.height - size) / 2
      canvas.width = 200
      canvas.height = 200
      ctx.drawImage(img, sx, sy, size, size, 0, 0, 200, 200)
      resolve(canvas.toDataURL('image/jpeg', 0.9))
    }
    img.src = imageSrc
  })
}

var COLLECTION = 'brands'

function mergeBrands(firestoreBrands) {
  var merged = staticBrands.slice()
  firestoreBrands.forEach(function (fb) {
    var idx = merged.findIndex(function (sb) { return sb.name?.toLowerCase() === (fb.name || '').toLowerCase() })
    if (idx !== -1) {
      merged[idx] = { ...merged[idx], ...fb, _firestore: true }
    } else {
      merged.push({ ...fb, _firestore: true })
    }
  })
  merged.sort(function (a, b) {
    var oa = a.order != null ? a.order : 999
    var ob = b.order != null ? b.order : 999
    if (oa !== ob) return oa - ob
    return (a.name || '').localeCompare(b.name || '')
  })
  return merged
}

async function loadAllBrands() {
  if (!db) return staticBrands
  try {
    var snap = await getDocs(collection(db, COLLECTION))
    var firestoreBrands = snap.docs.map(function (d) { return { id: d.id, ...d.data() } })
    return mergeBrands(firestoreBrands)
  } catch (e) {
    console.error('[AdminBrands] Firestore read error:', e)
    return staticBrands
  }
}

async function addBrandToFirestore(data) {
  var ref = await addDoc(collection(db, COLLECTION), { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() })
  return ref.id
}

async function updateBrandInFirestore(id, data) {
  await updateDoc(doc(db, COLLECTION, id), { ...data, updatedAt: serverTimestamp() })
}

async function deleteBrandFromFirestore(id) {
  await deleteDoc(doc(db, COLLECTION, id))
}

async function uploadBrandImageToStorage(file, brandId) {
  var storageRef = ref(storage, 'brands/' + brandId + '/' + file.name)
  var snapshot = await uploadBytes(storageRef, file)
  var url = await getDownloadURL(snapshot.ref)
  return url
}

async function deleteBrandImageFromStorage(url) {
  try {
    var storageRef = ref(storage, url)
    await deleteObject(storageRef)
  } catch (e) {
    console.error('deleteBrandImage error:', e)
  }
}

export default function AdminBrandsPage() {
  var [brands, setBrands] = useState([])
  var [loading, setLoading] = useState(true)
  var [debugInfo, setDebugInfo] = useState(null)
  var [showModal, setShowModal] = useState(false)
  var [editing, setEditing] = useState(null)
  var [saving, setSaving] = useState(false)

  // Form fields
  var [name, setName] = useState('')
  var [link, setLink] = useState('')
  var [imageFile, setImageFile] = useState(null)
  var [imagePreview, setImagePreview] = useState('')
  var [crop, setCrop] = useState({ x: 0, y: 0 })
  var [zoom, setZoom] = useState(1)
  var [showCrop, setShowCrop] = useState(false)

  function loadBrands() {
    try {
      setLoading(true)
      var firestoreRaw = []
      if (db) {
        getDocs(collection(db, COLLECTION)).then(function (snap) {
          firestoreRaw = snap.docs.map(function (d) { return { id: d.id, name: d.data().name } })
          setDebugInfo({ count: firestoreRaw.length, names: firestoreRaw.map(function (b) { return b.name }) })
        }).catch(function (e) {
          setDebugInfo({ error: e.message })
        })
      } else {
        setDebugInfo({ error: 'db is null' })
      }
      loadAllBrands().then(function (data) {
        if (!data || !data.length) {
          console.warn('[AdminBrands] loadAllBrands returned empty, falling back to staticBrands')
          setBrands(staticBrands)
        } else {
          setBrands(data)
        }
        setLoading(false)
      }).catch(function (err) {
        console.error('[AdminBrands] loadAllBrands promise rejected:', err)
        setBrands(staticBrands)
        setLoading(false)
        setDebugInfo({ error: 'loadAllBrands failed: ' + err.message })
      })
    } catch (err) {
      console.error('[AdminBrands] loadBrands sync error:', err)
      setBrands(staticBrands)
      setLoading(false)
      setDebugInfo({ error: err.message })
    }
  }

  useEffect(function () { loadBrands() }, [])

  function openAdd() {
    setEditing(null)
    setName('')
    setLink('')
    setImageFile(null)
    setImagePreview('')
    setShowModal(true)
  }

  function openEdit(brand) {
    setEditing(brand)
    setName(brand.name || '')
    setLink(brand.link || '')
    setImagePreview(brand.image || '')
    setImageFile(null)
    setShowModal(true)
  }

  function handleImageSelect(e) {
    var file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    var reader = new FileReader()
    reader.onload = function () {
      setImagePreview(reader.result)
      setShowCrop(true)
    }
    reader.readAsDataURL(file)
  }

  var handleSave = useCallback(async function () {
    if (!name.trim()) return
    setSaving(true)
    try {
      var imageUrl = editing ? editing.image || '' : ''
      if (imageFile && imagePreview && !showCrop) {
        var dataUrl = imagePreview
        if (editing && editing.image) await deleteBrandImageFromStorage(editing.image)
        var blob = await (await fetch(dataUrl)).blob()
        imageUrl = await uploadBrandImageToStorage(blob, 'brand_' + Date.now())
      } else if (imageFile && showCrop) {
        var cropped = await getCroppedImg(imagePreview, crop, zoom)
        var croppedBlob = await (await fetch(cropped)).blob()
        if (editing && editing.image) await deleteBrandImageFromStorage(editing.image)
        imageUrl = await uploadBrandImageToStorage(croppedBlob, 'brand_' + Date.now())
      }

      var data = { name: name.trim(), image: imageUrl, link: link.trim() || '' }

      if (editing) {
        await updateBrandInFirestore(editing.id, data)
      } else {
        await addBrandToFirestore(data)
      }

      setShowModal(false)
      loadBrands()
    } catch (err) {
      alert('Error saving brand: ' + err.message)
    } finally {
      setSaving(false)
    }
  }, [name, link, imageFile, imagePreview, showCrop, crop, zoom, editing])

  async function handleDelete(brand) {
    if (!confirm('Delete "' + brand.name + '"?')) return
    try {
      if (brand.image) await deleteBrandImageFromStorage(brand.image)
      await deleteBrandFromFirestore(brand.id)
      loadBrands()
    } catch (err) {
      alert('Error deleting brand: ' + err.message)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-[#0B1F4B]">Brands</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage brands shown on the website</p>
        </div>
        <button onClick={openAdd} className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#FF5E1A] text-white text-sm font-semibold rounded-xl hover:bg-[#e04a0a] transition-colors shadow-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Brand
        </button>
      </div>

      {debugInfo && (
        <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-600">
          <strong>Firestore brands:</strong> {debugInfo.count != null ? debugInfo.count + ' found' : ''}
          {debugInfo.names ? ' — ' + debugInfo.names.join(', ') : ''}
          {debugInfo.error ? ' Error: ' + debugInfo.error : ''}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading brands...</div>
      ) : brands.length === 0 ? (
        <div className="text-center py-12 text-gray-400">No brands yet. Click &quot;Add Brand&quot; to get started.</div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Logo</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Name</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Link</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {brands.map(function (brand) {
                return (
                  <tr key={brand.id || brand.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center">
                        {brand.image ? (
                          <img src={brand.image} alt={brand.name} className="w-full h-full object-contain" />
                        ) : (
                          <span className="text-xs font-bold text-gray-400">{brand.name?.slice(0, 2).toUpperCase()}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-800">{brand.name}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs truncate max-w-[200px]">{brand.link || '—'}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={function () { openEdit(brand) }} className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors mr-1">
                        Edit
                      </button>
                      <button onClick={function () { handleDelete(brand) }} className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        Delete
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg mx-4 p-6 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-[#0B1F4B]">{editing ? 'Edit Brand' : 'Add Brand'}</h2>
              <button onClick={function () { setShowModal(false) }} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Brand Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={function (e) { setName(e.target.value) }}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-[#FF5E1A] focus:ring-2 focus:ring-[#FF5E1A]/20 outline-none transition-all"
                  placeholder="e.g. Samsung"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Logo Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-[#fff4ed] file:text-[#FF5E1A] hover:file:bg-[#ffe8d5] transition-colors"
                />
                {imagePreview && !showCrop && (
                  <div className="mt-2 w-20 h-20 rounded-xl border border-gray-200 overflow-hidden">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Crop UI */}
              {showCrop && imagePreview && (
                <div>
                  <div className="relative w-full h-64 rounded-xl overflow-hidden bg-gray-900 mb-3">
                    <Cropper
                      image={imagePreview}
                      crop={crop}
                      zoom={zoom}
                      aspect={1}
                      cropShape="round"
                      onCropChange={setCrop}
                      onZoomChange={setZoom}
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500">Zoom:</span>
                    <input
                      type="range"
                      min={1}
                      max={3}
                      step={0.1}
                      value={zoom}
                      onChange={function (e) { setZoom(Number(e.target.value)) }}
                      className="flex-1 accent-[#FF5E1A]"
                    />
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={async function () {
                        var cropped = await getCroppedImg(imagePreview, crop, zoom)
                        setImagePreview(cropped)
                        setShowCrop(false)
                      }}
                      className="px-4 py-2 bg-[#FF5E1A] text-white text-sm font-semibold rounded-xl hover:bg-[#e04a0a] transition-colors"
                    >
                      Apply Crop
                    </button>
                    <button
                      onClick={function () { setShowCrop(false) }}
                      className="px-4 py-2 border border-gray-300 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      Skip
                    </button>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link (optional)</label>
                <input
                  type="url"
                  value={link}
                  onChange={function (e) { setLink(e.target.value) }}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-[#FF5E1A] focus:ring-2 focus:ring-[#FF5E1A]/20 outline-none transition-all"
                  placeholder="https://example.com/brand-page"
                />
                <p className="text-xs text-gray-400 mt-1">When clicked, opens this URL. Leave empty for no link.</p>
              </div>
            </div>

            <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
              <button
                onClick={handleSave}
                disabled={saving || !name.trim()}
                className="flex-1 px-4 py-2.5 bg-[#0B1F4B] text-white text-sm font-semibold rounded-xl hover:bg-[#071035] disabled:opacity-50 transition-colors"
              >
                {saving ? 'Saving...' : editing ? 'Update Brand' : 'Add Brand'}
              </button>
              <button
                onClick={function () { setShowModal(false) }}
                className="px-4 py-2.5 border border-gray-300 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
