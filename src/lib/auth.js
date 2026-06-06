'use client'

import { auth } from '@/lib/firebase'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInAnonymously,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth'
import { saveCustomerProfile } from '@/lib/customerProfile'

export function listenToAuth(callback) {
  if (!auth) return function () {}
  return onAuthStateChanged(auth, callback)
}

export async function ensureGuestUser() {
  if (!auth) return null
  if (auth.currentUser) return auth.currentUser
  var credential = await signInAnonymously(auth)
  return credential.user
}

export async function loginCustomer(email, password) {
  var credential = await signInWithEmailAndPassword(auth, email, password)
  return credential.user
}

export async function registerCustomer(name, email, password) {
  var credential = await createUserWithEmailAndPassword(auth, email, password)
  if (name) await updateProfile(credential.user, { displayName: name })
  await saveCustomerProfile(credential.user.uid, {
    name: name || '',
    email: email || ''
  })
  return credential.user
}

export async function logoutCustomer() {
  if (!auth) return
  await signOut(auth)
}
