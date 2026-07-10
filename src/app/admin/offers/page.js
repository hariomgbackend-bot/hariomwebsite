'use client'

import { useState, useEffect, useCallback } from 'react'
import { db } from '@/lib/firebase'
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore'
import { staticOffers } from '@/lib/offers'

var COLLECTION = 'promotions'
var sectionOptions = ['current', 'festival', 'emi', 'exchange']
var colorOptions = ['brand', 'accent', 'crimson', 'green', 'purple']

function flattenOffers() {
  var result = []
  Object.keys(staticOffers).forEach(function (section) {
    ;(staticOffers[section] || []).forEach(function (offer) {
      result.push({ ...offer, section: section })
    })
  })
  return result
}

var defaultOffers = flattenOffers()

async function loadAllOffers() {
  if (!db) return defaultOffers
  try {
    var snap = await getDocs(collection(db, COLLECTION))
    var firestoreOffers = snap.docs.map(function (d) { return { id: d.id, ...d.data() } })
    if (firestoreOffers.length === 0) return defaultOffers
    return firestoreOffers.sort(function (a, b) { return (a.title || '').localeCompare(b.title || '') })
  } catch (e) {
    console.error('loadAllOffers error:', e)
    return defaultOffers
  }
}

export default function AdminOffersPage() {
  var [offers, setOffers] = useState([])
  var [loading, setLoading] = useState(true)
  var [showModal, setShowModal] = useState(false)
  var [editing, setEditing] = useState(null)
  var [saving, setSaving] = useState(false)

  var [title, setTitle] = useState('')
  var [titleHi, setTitleHi] = useState('')
  var [titleMr, setTitleMr] = useState('')
  var [description, setDescription] = useState('')
  var [badge, setBadge] = useState('')
  var [validTill, setValidTill] = useState('')
  var [color, setColor] = useState('brand')
  var [isActive, setIsActive] = useState(true)
  var [section, setSection] = useState('current')

  function load() {
    setLoading(true)
    loadAllOffers().then(function (data) {
      setOffers(data)
      setLoading(false)
    })
  }

  useEffect(function () { load() }, [])

  function openAdd() {
    setEditing(null)
    setTitle(''); setTitleHi(''); setTitleMr('')
    setDescription(''); setBadge(''); setValidTill('')
    setColor('brand'); setIsActive(true); setSection('current')
    setShowModal(true)
  }

  function openEdit(offer) {
    setEditing(offer)
    setTitle(offer.title || '')
    setTitleHi(offer.titleHi || '')
    setTitleMr(offer.titleMr || '')
    setDescription(offer.description || '')
    setBadge(offer.badge || '')
    setValidTill(offer.validTill || '')
    setColor(offer.color || 'brand')
    setIsActive(offer.isActive !== false)
    setSection(offer.section || 'current')
    setShowModal(true)
  }

  var handleSave = useCallback(async function () {
    if (!title.trim()) return
    setSaving(true)
    try {
      var data = {
        title: title.trim(),
        titleHi: titleHi.trim() || '',
        titleMr: titleMr.trim() || '',
        description: description.trim() || '',
        badge: badge.trim() || '',
        validTill: validTill.trim() || '',
        color: color,
        isActive: isActive,
        section: section,
      }
      if (editing) {
        await updateDoc(doc(db, COLLECTION, editing.id), { ...data, updatedAt: serverTimestamp() })
      } else {
        await addDoc(collection(db, COLLECTION), { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() })
      }
      setShowModal(false)
      load()
    } catch (err) {
      alert('Error saving offer: ' + err.message)
    } finally {
      setSaving(false)
    }
  }, [title, titleHi, titleMr, description, badge, validTill, color, isActive, section, editing])

  async function handleDelete(offer) {
    if (!confirm('Delete "' + (offer.title || 'this offer') + '"?')) return
    try {
      if (offer.id) await deleteDoc(doc(db, COLLECTION, offer.id))
      load()
    } catch (err) {
      alert('Error deleting offer: ' + err.message)
    }
  }

  var badgeColors = {
    brand: 'bg-[#0B1F4B] text-white',
    accent: 'bg-[#FF5E1A] text-white',
    crimson: 'bg-[#8B1A35] text-white',
    green: 'bg-green-600 text-white',
    purple: 'bg-purple-600 text-white',
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-[#0B1F4B]">Offers & Promotions</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage special offers, deals, and promotions</p>
        </div>
        <button onClick={openAdd} className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#FF5E1A] text-white text-sm font-semibold rounded-xl hover:bg-[#e04a0a] transition-colors shadow-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Offer
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading offers...</div>
      ) : offers.length === 0 ? (
        <div className="text-center py-12 text-gray-400">No offers yet.</div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Title</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Section</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Badge</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Valid Till</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600">Active</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {offers.map(function (offer) {
                return (
                  <tr key={offer.id || offer.title} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-800">{offer.title}</td>
                    <td className="px-4 py-3">
                      <span className="inline-block px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600">{offer.section || 'current'}</span>
                    </td>
                    <td className="px-4 py-3">
                      {offer.badge ? (
                        <span className={'inline-block px-2 py-0.5 rounded text-xs font-semibold ' + (badgeColors[offer.color] || badgeColors.brand)}>
                          {offer.badge}
                        </span>
                      ) : <span className="text-gray-400">—</span>}
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{offer.validTill || '—'}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={'inline-block w-2 h-2 rounded-full ' + (offer.isActive !== false ? 'bg-green-500' : 'bg-red-400')}></span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={function () { openEdit(offer) }} className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors mr-1">Edit</button>
                      <button onClick={function () { handleDelete(offer) }} className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors">Delete</button>
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
              <h2 className="text-lg font-bold text-[#0B1F4B]">{editing ? 'Edit Offer' : 'Add Offer'}</h2>
              <button onClick={function () { setShowModal(false) }} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title (English) *</label>
                  <input type="text" value={title} onChange={function (e) { setTitle(e.target.value) }} className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-[#FF5E1A] focus:ring-2 focus:ring-[#FF5E1A]/20 outline-none transition-all" placeholder="Summer Sale - Up to 30% Off" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title (Hindi)</label>
                  <input type="text" value={titleHi} onChange={function (e) { setTitleHi(e.target.value) }} className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-[#FF5E1A] focus:ring-2 focus:ring-[#FF5E1A]/20 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title (Marathi)</label>
                  <input type="text" value={titleMr} onChange={function (e) { setTitleMr(e.target.value) }} className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-[#FF5E1A] focus:ring-2 focus:ring-[#FF5E1A]/20 outline-none transition-all" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={description} onChange={function (e) { setDescription(e.target.value) }} rows={2} className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-[#FF5E1A] focus:ring-2 focus:ring-[#FF5E1A]/20 outline-none transition-all resize-none" />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Badge</label>
                  <input type="text" value={badge} onChange={function (e) { setBadge(e.target.value) }} className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-[#FF5E1A] focus:ring-2 focus:ring-[#FF5E1A]/20 outline-none transition-all" placeholder="SALE" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Badge Color</label>
                  <select value={color} onChange={function (e) { setColor(e.target.value) }} className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-[#FF5E1A] focus:ring-2 focus:ring-[#FF5E1A]/20 outline-none transition-all">
                    {colorOptions.map(function (c) { return <option key={c} value={c}>{c}</option> })}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                  <select value={section} onChange={function (e) { setSection(e.target.value) }} className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-[#FF5E1A] focus:ring-2 focus:ring-[#FF5E1A]/20 outline-none transition-all">
                    {sectionOptions.map(function (s) { return <option key={s} value={s}>{s}</option> })}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valid Till</label>
                  <input type="text" value={validTill} onChange={function (e) { setValidTill(e.target.value) }} className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-[#FF5E1A] focus:ring-2 focus:ring-[#FF5E1A]/20 outline-none transition-all" placeholder="30 Jun 2026" />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={isActive} onChange={function (e) { setIsActive(e.target.checked) }} className="w-4 h-4 accent-[#FF5E1A]" />
                <span className="text-sm text-gray-700">Active (visible on site)</span>
              </label>
            </div>

            <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
              <button onClick={handleSave} disabled={saving || !title.trim()} className="flex-1 px-4 py-2.5 bg-[#0B1F4B] text-white text-sm font-semibold rounded-xl hover:bg-[#071035] disabled:opacity-50 transition-colors">
                {saving ? 'Saving...' : editing ? 'Update Offer' : 'Add Offer'}
              </button>
              <button onClick={function () { setShowModal(false) }} className="px-4 py-2.5 border border-gray-300 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
