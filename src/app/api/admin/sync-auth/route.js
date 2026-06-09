import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() })
}

export async function POST() {
  try {
    var privateKey = process.env.FIREBASE_PRIVATE_KEY
    var clientEmail = process.env.FIREBASE_CLIENT_EMAIL
    var projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID

    if (!privateKey || !clientEmail) {
      return Response.json({
        ok: false,
        message: 'Firebase Admin SDK not configured. Set FIREBASE_PRIVATE_KEY and FIREBASE_CLIENT_EMAIL in Vercel env vars.'
      }, { headers: corsHeaders() })
    }

    if (!getApps().length) {
      initializeApp({
        credential: cert({
          projectId: projectId,
          clientEmail: clientEmail,
          privateKey: privateKey.replace(/\\n/g, '\n')
        })
      })
    }

    var auth = getAuth()
    var firestore = getFirestore()
    var created = 0
    var skipped = 0
    var errors = 0

    var pageToken
    do {
      var result = await auth.listUsers(1000, pageToken)
      for (var user of result.users) {
        var doc = await firestore.collection('customer_profiles').doc(user.uid).get()
        if (!doc.exists) {
          await firestore.collection('customer_profiles').doc(user.uid).set({
            name: user.displayName || '',
            email: user.email || '',
            phone: user.phoneNumber || '',
            createdAt: new Date(),
            updatedAt: new Date(),
            syncedFromAuth: true
          })
          created++
        } else {
          skipped++
        }
      }
      pageToken = result.pageToken
    } while (pageToken)

    return Response.json({
      ok: true,
      created: created,
      skipped: skipped,
      errors: errors,
      message: 'Synced ' + created + ' new customer(s) from Auth. ' + skipped + ' already existed.'
    }, { headers: corsHeaders() })
  } catch (err) {
    return Response.json({
      ok: false,
      message: err.message || 'Sync failed'
    }, { headers: corsHeaders() })
  }
}
