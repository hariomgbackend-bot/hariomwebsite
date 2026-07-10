'use client'

import { useState, useEffect, useCallback } from 'react'
import { db } from '@/lib/firebase'
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore'
import staticCategories from '@/data/categories'

var COLLECTION = 'categories'
var iconOptions = ['tv', 'ac', 'fridge', 'washing', 'mobile', 'tablet', 'laptop', 'audio', 'kitchen', 'industrial', 'flour', 'small']

function mergeCategories(firestoreCats) {
  var merged = staticCategories.slice()
  firestoreCats.forEach(function (fc) {
    var idx = merged.findIndex(function (sc) { return sc.id === fc.id })
    if (idx !== -1) {
      merged[idx] = { ...merged[idx], ...fc, _firestore: true }
    } else {
      merged.push({ ...fc, _firestore: true })
    }
  })
  merged.sort(function (a, b) { return (a.order || 99) - (b.order || 99) })
  return merged
}

async function loadAllCategories() {
  if (!db) return staticCategories
  try {
    var snap = await getDocs(collection(db, COLLECTION))
    var firestoreCats = snap.docs.map(function (d) { return { id: d.id, ...d.data() } })
    return mergeCategories(firestoreCats)
  } catch (e) {
    console.error('loadAllCategories error:', e)
    return staticCategories
  }
}

export default function AdminCategoriesPage() {
  var [categories, setCategories] = useState([])
  var [loading, setLoading] = useState(true)
  var [showModal, setShowModal] = useState(false)
  var [editing, setEditing] = useState(null)
  var [saving, setSaving] = useState(false)

  var [name, setName] = useState('')
  var [nameHi, setNameHi] = useState('')
  var [nameMr, setNameMr] = useState('')
  var [description, setDescription] = useState('')
  var [descriptionHi, setDescriptionHi] = useState('')
  var [descriptionMr, setDescriptionMr] = useState('')
  var [icon, setIcon] = useState('tv')
  var [order, setOrder] = useState(99)

  function load() {
    setLoading(true)
    loadAllCategories().then(function (data) {
      setCategories(data)
      setLoading(false)
    })
  }

  useEffect(function () { load() }, [])

  function openAdd() {
    setEditing(null)
    setName(''); setNameHi(''); setNameMr('')
    setDescription(''); setDescriptionHi(''); setDescriptionMr('')
    setIcon('tv'); setOrder(99)
    setShowModal(true)
  }

  function openEdit(cat) {
    setEditing(cat)
    setName(cat.name || '')
    setNameHi(cat.nameHi || '')
    setNameMr(cat.nameMr || '')
    setDescription(cat.description || '')
    setDescriptionHi(cat.descriptionHi || '')
    setDescriptionMr(cat.descriptionMr || '')
    setIcon(cat.icon || 'tv')
    setOrder(cat.order != null ? cat.order : 99)
    setShowModal(true)
  }

  var handleSave = useCallback(async function () {
    if (!name.trim()) return
    setSaving(true)
    try {
      var data = {
        id: editing ? editing.id : (name.trim().toLowerCase().replace(/\s+/g, '-')),
        name: name.trim(),
        nameHi: nameHi.trim() || '',
        nameMr: nameMr.trim() || '',
        description: description.trim(),
        descriptionHi: descriptionHi.trim() || '',
        descriptionMr: descriptionMr.trim() || '',
        icon: icon,
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
      alert('Error saving category: ' + err.message)
    } finally {
      setSaving(false)
    }
  }, [name, nameHi, nameMr, description, descriptionHi, descriptionMr, icon, order, editing])

  async function handleDelete(cat) {
    if (!confirm('Delete "' + cat.name + '"?')) return
    try {
      await deleteDoc(doc(db, COLLECTION, cat._firestore ? cat.id : cat.id))
      load()
    } catch (err) {
      alert('Error deleting category: ' + err.message)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-[#0B1F4B]">Categories</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage product categories</p>
        </div>
        <button onClick={openAdd} className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#FF5E1A] text-white text-sm font-semibold rounded-xl hover:bg-[#e04a0a] transition-colors shadow-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Category
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading categories...</div>
      ) : categories.length === 0 ? (
        <div className="text-center py-12 text-gray-400">No categories yet.</div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Name</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Icon</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Order</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(function (cat) {
                return (
                  <tr key={cat.id || cat.name} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-800">{cat.name}</div>
                      <div className="text-xs text-gray-400">{cat.nameHi}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-block px-2 py-1 bg-gray-100 rounded text-xs font-mono">{cat.icon}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{cat.order != null ? cat.order : '—'}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={function () { openEdit(cat) }} className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors mr-1">Edit</button>
                      <button onClick={function () { handleDelete(cat) }} className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors">Delete</button>
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
              <h2 className="text-lg font-bold text-[#0B1F4B]">{editing ? 'Edit Category' : 'Add Category'}</h2>
              <button onClick={function () { setShowModal(false) }} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name (English) *</label>
                  <input type="text" value={name} onChange={function (e) { setName(e.target.value) }} className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-[#FF5E1A] focus:ring-2 focus:ring-[#FF5E1A]/20 outline-none transition-all" placeholder="Televisions" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name (Hindi)</label>
                  <input type="text" value={nameHi} onChange={function (e) { setNameHi(e.target.value) }} className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-[#FF5E1A] focus:ring-2 focus:ring-[#FF5E1A]/20 outline-none transition-all" placeholder="टेलीविजन" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name (Marathi)</label>
                  <input type="text" value={nameMr} onChange={function (e) { setNameMr(e.target.value) }} className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-[#FF5E1A] focus:ring-2 focus:ring-[#FF5E1A]/20 outline-none transition-all" placeholder="टेलिव्हिजन" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                  <select value={icon} onChange={function (e) { setIcon(e.target.value) }} className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-[#FF5E1A] focus:ring-2 focus:ring-[#FF5E1A]/20 outline-none transition-all">
                    {iconOptions.map(function (opt) { return <option key={opt} value={opt}>{opt}</option> })}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (English)</label>
                <textarea value={description} onChange={function (e) { setDescription(e.target.value) }} rows={2} className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-[#FF5E1A] focus:ring-2 focus:ring-[#FF5E1A]/20 outline-none transition-all resize-none" placeholder="LED, OLED, QLED, 4K and Smart TVs" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description (Hindi)</label>
                  <textarea value={descriptionHi} onChange={function (e) { setDescriptionHi(e.target.value) }} rows={2} className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-[#FF5E1A] focus:ring-2 focus:ring-[#FF5E1A]/20 outline-none transition-all resize-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description (Marathi)</label>
                  <textarea value={descriptionMr} onChange={function (e) { setDescriptionMr(e.target.value) }} rows={2} className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-[#FF5E1A] focus:ring-2 focus:ring-[#FF5E1A]/20 outline-none transition-all resize-none" />
                </div>
              </div>

              <div className="w-24">
                <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                <input type="number" value={order} onChange={function (e) { setOrder(Number(e.target.value)) }} className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-[#FF5E1A] focus:ring-2 focus:ring-[#FF5E1A]/20 outline-none transition-all" />
              </div>
            </div>

            <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
              <button onClick={handleSave} disabled={saving || !name.trim()} className="flex-1 px-4 py-2.5 bg-[#0B1F4B] text-white text-sm font-semibold rounded-xl hover:bg-[#071035] disabled:opacity-50 transition-colors">
                {saving ? 'Saving...' : editing ? 'Update Category' : 'Add Category'}
              </button>
              <button onClick={function () { setShowModal(false) }} className="px-4 py-2.5 border border-gray-300 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
