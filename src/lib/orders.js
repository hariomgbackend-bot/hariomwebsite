'use client'

import { db } from '@/lib/firebase'
import { ensureGuestUser } from '@/lib/auth'
import { addDoc, collection, doc, getDoc, getDocs, query, serverTimestamp, updateDoc, where } from 'firebase/firestore'

export async function createCustomerOrder(payload) {
  if (!db) throw new Error('Firebase is not configured')
  var user = await ensureGuestUser()
  var order = Object.assign({}, payload, {
    userId: user ? user.uid : null,
    isGuest: user ? user.isAnonymous === true : true,
    status: 'new',
    paymentStatus: payload.paymentMethod === 'cod' || payload.paymentMethod === 'store' ? 'pending' : 'initiated',
    read: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  })
  var ref = await addDoc(collection(db, 'orders'), order)
  return ref.id
}

export async function updateCustomerOrder(orderId, data) {
  if (!db) throw new Error('Firebase is not configured')
  await updateDoc(doc(db, 'orders', orderId), Object.assign({}, data, {
    updatedAt: serverTimestamp()
  }))
}

export async function getOrderById(orderId) {
  if (!db) throw new Error('Firebase is not configured')
  var snap = await getDoc(doc(db, 'orders', orderId))
  if (!snap.exists()) return null
  var data = snap.data()
  return Object.assign({ id: snap.id }, data)
}

export async function getOrdersForUser(userId) {
  if (!db || !userId) return []
  var snap = await getDocs(query(collection(db, 'orders'), where('userId', '==', userId)))
  var rows = []
  snap.forEach(function (docSnap) {
    rows.push(Object.assign({ id: docSnap.id }, docSnap.data()))
  })
  rows.sort(function (a, b) {
    var aTime = a.createdAt && a.createdAt.seconds ? a.createdAt.seconds : 0
    var bTime = b.createdAt && b.createdAt.seconds ? b.createdAt.seconds : 0
    return bTime - aTime
  })
  return rows
}

export async function createReturnRequest(order, payload) {
  if (!db) throw new Error('Firebase is not configured')
  var user = await ensureGuestUser()
  var ref = await addDoc(collection(db, 'returns'), {
    orderId: order.id,
    userId: user ? user.uid : null,
    customer: order.customer || {},
    items: payload.items || [],
    reason: payload.reason || '',
    issue: payload.issue || '',
    preferredResolution: payload.preferredResolution || 'return',
    pickupAddress: payload.pickupAddress || '',
    alternatePhone: payload.alternatePhone || '',
    status: 'requested',
    read: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  })
  return ref.id
}
