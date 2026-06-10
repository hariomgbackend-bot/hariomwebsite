import { db } from '@/lib/firebase'
import { collection, getDocs, query, where } from 'firebase/firestore'

function slugify(text) {
  return text.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function mapFirestoreDoc(doc) {
  var d = doc.data()
  return {
    id: doc.id,
    slug: slugify(d.name),
    name: d.name || '',
    brand: d.brand || '',
    category: d.category || '',
    price: d.price || '',
    description: d.description || '',
    featured: d.featured === true,
    image: (d.images && d.images.length > 0) ? d.images[0] : '/images/placeholder.svg',
    images: d.images || []
  }
}

export async function getProductBySlug(slug) {
  if (!db) return null
  try {
    var ref = collection(db, 'products')
    var q = query(ref, where('is_visible', '==', true))
    var snap = await getDocs(q)
    var results = []
    snap.forEach(function (doc) { results.push(mapFirestoreDoc(doc)) })
    var match = results.find(function (p) { return p.slug === slug })
    return match || null
  } catch (e) {
    console.error('getProductBySlug error:', e)
    return null
  }
}

export async function getProducts(categoryId) {
  if (!db) return []
  try {
    var ref = collection(db, 'products')
    var constraints = [where('is_visible', '==', true)]
    if (categoryId) constraints.push(where('category', '==', categoryId))

    var snap = await getDocs(query(ref, ...constraints))
    var results = []
    snap.forEach(function (doc) { results.push(mapFirestoreDoc(doc)) })
    return results
  } catch (e) {
    console.error('getProducts error:', e)
    return []
  }
}

export async function getFeaturedProducts(max) {
  max = max || 8
  if (!db) return []
  try {
    var ref = collection(db, 'products')
    var q = query(ref, where('is_visible', '==', true))
    var snap = await getDocs(q)
    var results = []
    snap.forEach(function (doc) { results.push(mapFirestoreDoc(doc)) })
    if (results.length === 0) return []
    var featured = results.filter(function (p) { return p.featured === true })
    if (featured.length > 0) results = featured
    results.sort(function (a, b) { return a.name.localeCompare(b.name) })
    return results.slice(0, max)
  } catch (e) {
    console.error('getFeaturedProducts error:', e)
    return []
  }
}
