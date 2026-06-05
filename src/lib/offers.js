import { db } from '@/lib/firebase'
import { collection, getDocs, query, where } from 'firebase/firestore'
import staticOffers from '@/data/offers'

function mapPromotion(doc) {
  var d = doc.data()
  return {
    id: doc.id,
    title: d.title || '',
    titleHi: d.titleHi || '',
    titleMr: d.titleMr || '',
    description: d.description || '',
    badge: d.badge || '',
    validTill: d.validTill || '',
    color: d.color || 'brand',
    isActive: d.isActive === true,
    section: d.section || 'current',
    createdAt: d.createdAt || null
  }
}

export async function getActivePromotions() {
  if (!db) return staticOffers.current || []
  try {
    var ref = collection(db, 'promotions')
    var q = query(ref, where('isActive', '==', true))
    var snap = await getDocs(q)
    var results = []
    snap.forEach(function (doc) { results.push(mapPromotion(doc)) })
    results.sort(function (a, b) { return a.title.localeCompare(b.title) })
    return results.length > 0 ? results : (staticOffers.current || [])
  } catch (e) {
    console.error('getActivePromotions error:', e)
    return staticOffers.current || []
  }
}

export { staticOffers }
