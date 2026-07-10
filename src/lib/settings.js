import { db } from '@/lib/firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'

var SETTINGS_COLLECTION = 'settings'
var PAYMENT_DOC = 'payment'

export async function getPaymentMode() {
  if (!db) return { enabled: false }
  try {
    var snap = await getDoc(doc(db, SETTINGS_COLLECTION, PAYMENT_DOC))
    if (snap.exists()) {
      return { enabled: snap.data().enabled === true }
    }
    return { enabled: false }
  } catch (e) {
    console.error('getPaymentMode error:', e)
    return { enabled: false }
  }
}

export async function setPaymentMode(enabled) {
  if (!db) return
  await setDoc(doc(db, SETTINGS_COLLECTION, PAYMENT_DOC), {
    enabled: enabled === true,
    updatedAt: new Date().toISOString()
  })
}
