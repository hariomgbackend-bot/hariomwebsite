/* ═══════════════════════════════════════════
   Hariom Electronics — Admin Portal
   Firebase Configuration
   ═══════════════════════════════════════════ */

const firebaseConfig = {
  apiKey: "AIzaSyBfQlLpHbuRsZ7YKIFBj8Fa5o-HMo0SBrU",
  authDomain: "hariom-delivery.firebaseapp.com",
  databaseURL: "https://hariom-delivery-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "hariom-delivery",
  storageBucket: "hariom-delivery.firebasestorage.app",
  messagingSenderId: "60300951507",
  appId: "1:60300951507:web:e5d55d0d18dc2000b47926"
}

firebase.initializeApp(firebaseConfig)

const auth = firebase.auth()
const db = firebase.firestore()
const storage = firebase.storage()

// Enable offline persistence for faster loads
db.enablePersistence().catch(function (err) {
  if (err.code === 'failed-precondition') {
    console.warn('Firebase persistence: multiple tabs open')
  } else if (err.code === 'unimplemented') {
    console.warn('Firebase persistence: browser not supported')
  }
})
