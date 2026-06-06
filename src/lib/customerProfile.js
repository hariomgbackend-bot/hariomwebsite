'use client'

import { db } from '@/lib/firebase'
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'

export async function getCustomerProfile(uid) {
  if (!db || !uid) return null
  var snap = await getDoc(doc(db, 'customer_profiles', uid))
  return snap.exists() ? snap.data() : null
}

export async function saveCustomerProfile(uid, data) {
  if (!db || !uid) throw new Error('Firebase is not configured')
  await setDoc(doc(db, 'customer_profiles', uid), Object.assign({}, data, {
    updatedAt: serverTimestamp()
  }), { merge: true })
}
