import { db } from '@/lib/firebase'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import fallbackCategories from '@/data/categories'

export async function getCategories() {
  if (!db) return fallbackCategories
  try {
    var ref = collection(db, 'categories')
    var q = query(ref, orderBy('order', 'asc'))
    var snap = await getDocs(q)
    var results = []
    snap.forEach(function (doc) {
      var d = doc.data()
      results.push({
        id: d.id,
        name: d.name || '',
        nameHi: d.nameHi || '',
        nameMr: d.nameMr || '',
        description: d.description || '',
        descriptionHi: d.descriptionHi || '',
        descriptionMr: d.descriptionMr || '',
        icon: d.icon || 'small'
      })
    })
    return results.length > 0 ? results : fallbackCategories
  } catch (e) {
    console.error('getCategories error:', e)
    return fallbackCategories
  }
}

export async function getCategoryBySlug(slug) {
  var cats = await getCategories()
  return cats.find(function (c) { return c.id === slug }) || null
}
