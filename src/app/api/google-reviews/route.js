import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

const STORES = [
  { storeId: 'main-store', placeId: '0x3bc2c8831512374f:0x82bee502536ab580' },
  { storeId: 'branch-1', placeId: '0x3bc2c76befcccc9b:0x5a7567068d9543ab' }
]

const TTL_MS = 6 * 60 * 60 * 1000
const FIELD_MASK = 'id,displayName,rating,userRatingCount,reviews,googleMapsUri'

function getAdminFirestore() {
  var projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  var clientEmail = process.env.FIREBASE_CLIENT_EMAIL
  var privateKey = process.env.FIREBASE_PRIVATE_KEY
  if (!projectId || !clientEmail || !privateKey) return null
  if (!getApps().length) {
    initializeApp({
      credential: cert({
        projectId: projectId,
        clientEmail: clientEmail,
        privateKey: privateKey.replace(/\\n/g, '\n')
      })
    })
  }
  return getFirestore()
}

async function fetchPlaceReviews(placeId, apiKey) {
  var response = await fetch('https://places.googleapis.com/v1/places/' + placeId, {
    headers: {
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': FIELD_MASK
    },
    cache: 'no-store'
  })
  if (!response.ok) {
    throw new Error('Places API error ' + response.status + ': ' + (await response.text()))
  }
  var data = await response.json()
  return {
    rating: data.rating || 0,
    count: data.userRatingCount || 0,
    mapsUri: data.googleMapsUri || '',
    reviews: (data.reviews || []).map(function (r) {
      var reviewId = r.name ? r.name.split('/').pop() : ''
      return {
        reviewId: reviewId,
        author: (r.authorAttribution && r.authorAttribution.displayName) || 'Google User',
        authorPhoto: (r.authorAttribution && r.authorAttribution.photoUri) || '',
        authorUri: (r.authorAttribution && r.authorAttribution.uri) || '',
        rating: r.rating || 0,
        text: (r.text && r.text.text) || '',
        relativeTime: r.relativePublishTimeDescription || '',
        publishedAt: r.publishTime || ''
      }
    })
  }
}

function stripMeta(data) {
  var out = Object.assign({}, data)
  delete out.syncedAt
  return out
}

export async function GET(request) {
  try {
    var apiKey = process.env.GOOGLE_PLACES_API_KEY
    if (!apiKey) {
      return Response.json({ ok: false, error: 'GOOGLE_PLACES_API_KEY is not configured on the server.' }, { status: 500 })
    }

    var url = new URL(request.url)
    var force = url.searchParams.get('force') === '1'
    var requestedStore = url.searchParams.get('store')

    var db = getAdminFirestore()
    var now = Date.now()
    var results = []

    for (var i = 0; i < STORES.length; i++) {
      var store = STORES[i]
      if (requestedStore && requestedStore !== store.storeId) continue

      var cached = null
      if (db) {
        var snap = await db.collection('reviews').doc(store.storeId).get()
        if (snap.exists) cached = snap.data()
      }

      var fresh = cached && cached.syncedAt && (now - new Date(cached.syncedAt).getTime()) < TTL_MS

      if (cached && fresh && !force) {
        results.push({ storeId: store.storeId, cached: true, ...stripMeta(cached) })
        continue
      }

      try {
        var data = await fetchPlaceReviews(store.placeId, apiKey)
        data.syncedAt = new Date().toISOString()
        data.visible = true
        if (db) {
          await db.collection('reviews').doc(store.storeId).set(data, { merge: true })
        }
        results.push({ storeId: store.storeId, cached: false, ...stripMeta(data) })
      } catch (e) {
        if (cached) {
          results.push({ storeId: store.storeId, cached: true, stale: true, ...stripMeta(cached) })
        } else {
          results.push({ storeId: store.storeId, error: e.message || 'Failed to fetch reviews.' })
        }
      }
    }

    return Response.json({ ok: true, stores: results })
  } catch (err) {
    return Response.json({ ok: false, error: err.message || 'Failed to fetch reviews.' }, { status: 500 })
  }
}
