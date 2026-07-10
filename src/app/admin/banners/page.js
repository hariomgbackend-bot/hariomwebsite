'use client'

import { useState, useEffect, useCallback } from 'react'
import { db, storage } from '@/lib/firebase'
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'

var COLLECTION = 'site_banners'

async function loadAllBanners() {
  if (!db) return []
  try {
    var snap = await getDocs(collection(db, COLLECTION))
    var results = snap.docs.map(function (d) { return { id: d.id, ...d.data() } })
    results.sort(function (a, b) { return (a.order || 99) - (b.order || 99) })
    return results
  } catch (e) {
    console.error('loadAllBanners error:', e)
    return []
  }
}

export default function AdminBannersPage() {
  var [banners, setBanners] = useState([])
  var [loading, setLoading] = useState(true)
  var [showModal, setShowModal] = useState(false)
  var [editing, setEditing] = useState(null)
  var [saving, setSaving] = useState(false)

  var [title, setTitle] = useState('')
  var [link, setLink] = useState('')
  var [isActive, setIsActive] = useState(true)
  var [order, setOrder] = useState(0)
  var [imageFile, setImageFile] = useState(null)
  var [imagePreview, setImagePreview] = useState('')

  function load() {
    setLoading(true)
    loadAllBanners().then(function (data) {
      setBanners(data)
      setLoading(false)
    })
  }

  useEffect(function () { load() }, [])

  function openAdd() {
    setEditing(null)
    setTitle(''); setLink(''); setIsActive(true); setOrder(0)
    setImageFile(null); setImagePreview('')
    setShowModal(true)
  }

  function openEdit(banner) {
    setEditing(banner)
    setTitle(banner.title || '')
    setLink(banner.link || '')
    setIsActive(banner.isActive !== false)
    setOrder(banner.order != null ? banner.order : 0)
    setImagePreview(banner.image || '')
    setImageFile(null)
    setShowModal(true)
  }

  function handleImageSelect(e) {
    var file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    var reader = new FileReader()
    reader.onload = function () { setImagePreview(reader.result) }
    reader.readAsDataURL(file)
  }

  var handleSave = useCallback(async function () {
    if (!title.trim()) return
    setSaving(true)
    try {
      var imageUrl = editing ? editing.image || '' : ''

      if (imageFile && imagePreview) {
        var blob = await (await fetch(imagePreview)).blob()
        var storageRef = ref(storage, 'banners/' + Date.now() + '.jpg')
        var snap = await uploadBytes(storageRef, blob)
        imageUrl = await getDownloadURL(snap.ref)
      }

      var data = {
        title: title.trim(),
        image: imageUrl,
        link: link.trim() || '',
        isActive: isActive,
        order: Number(order),
      }

      if (editing) {
        await updateDoc(doc(db, COLLECTION, editing.id), { ...data, updatedAt: serverTimestamp() })
      } else {
        await addDoc(collection(db, COLLECTION), { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() })
      }

      setShowModal(false)
      load()
    } catch (err) {
      alert('Error saving banner: ' + err.message)
    } finally {
      setSaving(false)
    }
  }, [title, link, isActive, order, imageFile, imagePreview, editing])

  async function handleDelete(banner) {
    if (!confirm('Delete "' + (banner.title || 'this banner') + '"?')) return
    try {
      if (banner.image) {
        try { await deleteObject(ref(storage, banner.image)) } catch (_) {}
      }
      if (banner.id) await deleteDoc(doc(db, COLLECTION, banner.id))
      load()
    } catch (err) {
      alert('Error deleting banner: ' + err.message)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-[#0B1F4B]">Banners</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage homepage banners and promotions</p>
        </div>
        <button onClick={openAdd} className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#FF5E1A] text-white text-sm font-semibold rounded-xl hover:bg-[#e04a0a] transition-colors shadow-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Banner
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading banners...</div>
      ) : banners.length === 0 ? (
        <div className="text-center py-12 text-gray-400">No banners yet. Click &quot;Add Banner&quot; to get started.</div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Preview</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Title</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Order</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600">Active</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {banners.map(function (banner) {
                return (
                  <tr key={banner.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="w-20 h-12 rounded-lg bg-gray-100 overflow-hidden">
                        {banner.image ? (
                          <img src={banner.image} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="flex items-center justify-center w-full h-full text-[10px] text-gray-400">No img</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-800">{banner.title}</td>
                    <td className="px-4 py-3 text-gray-600">{banner.order != null ? banner.order : '—'}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={'inline-block w-2 h-2 rounded-full ' + (banner.isActive !== false ? 'bg-green-500' : 'bg-red-400')}></span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={function () { openEdit(banner) }} className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors mr-1">Edit</button>
                      <button onClick={function () { handleDelete(banner) }} className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors">Delete</button>
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
          <div className="bg-white rounded-2xl w-full max-w-lg mx-4 p-6 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-[#0B1F4B]">{editing ? 'Edit Banner' : 'Add Banner'}</h2>
              <button onClick={function () { setShowModal(false) }} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input type="text" value={title} onChange={function (e) { setTitle(e.target.value) }} className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-[#FF5E1A] focus:ring-2 focus:ring-[#FF5E1A]/20 outline-none transition-all" placeholder="Summer Sale Banner" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Banner Image</label>
                <input type="file" accept="image/*" onChange={handleImageSelect} className="w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-[#fff4ed] file:text-[#FF5E1A] hover:file:bg-[#ffe8d5] transition-colors" />
                {imagePreview && (
                  <div className="mt-2 w-full h-32 rounded-xl border border-gray-200 overflow-hidden bg-gray-50">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Link URL</label>
                  <input type="url" value={link} onChange={function (e) { setLink(e.target.value) }} className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-[#FF5E1A] focus:ring-2 focus:ring-[#FF5E1A]/20 outline-none transition-all" placeholder="https://..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                  <input type="number" value={order} onChange={function (e) { setOrder(Number(e.target.value)) }} className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-[#FF5E1A] focus:ring-2 focus:ring-[#FF5E1A]/20 outline-none transition-all" />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={isActive} onChange={function (e) { setIsActive(e.target.checked) }} className="w-4 h-4 accent-[#FF5E1A]" />
                <span className="text-sm text-gray-700">Active (visible on site)</span>
              </label>
            </div>

            <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
              <button onClick={handleSave} disabled={saving || !title.trim()} className="flex-1 px-4 py-2.5 bg-[#0B1F4B] text-white text-sm font-semibold rounded-xl hover:bg-[#071035] disabled:opacity-50 transition-colors">
                {saving ? 'Saving...' : editing ? 'Update Banner' : 'Add Banner'}
              </button>
              <button onClick={function () { setShowModal(false) }} className="px-4 py-2.5 border border-gray-300 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
