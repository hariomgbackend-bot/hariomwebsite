import { db, storage } from '@/lib/firebase'
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import staticBrands from '@/data/brands'

const COLLECTION = 'brands'

export async function getAllBrands() {
  if (!db) return staticBrands
  try {
    var snap = await getDocs(query(collection(db, COLLECTION), orderBy('name')))
    var firestoreBrands = snap.docs.map(function (d) { return { id: d.id, ...d.data() } })
    var merged = staticBrands.slice()
    var staticNames = new Set(staticBrands.map(function (b) { return b.name.toLowerCase() }))
    firestoreBrands.forEach(function (fb) {
      var idx = merged.findIndex(function (sb) { return sb.name.toLowerCase() === (fb.name || '').toLowerCase() })
      if (idx !== -1) {
        merged[idx] = { ...merged[idx], ...fb, _firestore: true }
      } else {
        merged.push({ ...fb, _firestore: true })
      }
    })
    return merged
  } catch (e) {
    console.error('getAllBrands error:', e)
    return staticBrands
  }
}

export async function addBrand(data) {
  var ref = await addDoc(collection(db, COLLECTION), { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() })
  return ref.id
}

export async function updateBrand(id, data) {
  await updateDoc(doc(db, COLLECTION, id), { ...data, updatedAt: serverTimestamp() })
}

export async function deleteBrand(id) {
  await deleteDoc(doc(db, COLLECTION, id))
}

export async function uploadBrandImage(file, brandId) {
  var storageRef = ref(storage, `brands/${brandId}/${file.name}`)
  var snapshot = await uploadBytes(storageRef, file)
  var url = await getDownloadURL(snapshot.ref)
  return url
}

export async function deleteBrandImage(url) {
  try {
    var storageRef = ref(storage, url)
    await deleteObject(storageRef)
  } catch (e) {
    console.error('deleteBrandImage error:', e)
  }
}
