'use client'

import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'

const defaults = { active: true, message: '' }

export function useSectionToggle(sectionId) {
  var [state, setState] = useState({ active: true, message: '', loading: true })

  useEffect(function () {
    if (!db) { setState({ active: true, message: '', loading: false }); return }

    var ref = doc(db, 'site_sections', sectionId)

    getDoc(ref).then(function (snap) {
      if (snap.exists()) {
        var d = snap.data()
        setState({ active: d.active !== false, message: d.message || '', loading: false })
      } else {
        setState({ active: true, message: '', loading: false })
      }
    }).catch(function () {
      setState({ active: true, message: '', loading: false })
    })
  }, [sectionId])

  return state
}

export async function getSectionToggle(sectionId) {
  if (!db) return defaults
  try {
    var ref = doc(db, 'site_sections', sectionId)
    var snap = await getDoc(ref)
    if (snap.exists()) {
      var d = snap.data()
      return { active: d.active !== false, message: d.message || '' }
    }
    return defaults
  } catch (e) {
    return defaults
  }
}

export async function updateSection(sectionId, data) {
  if (!db) return
  var ref = doc(db, 'site_sections', sectionId)
  var { setDoc, serverTimestamp } = await import('firebase/firestore')
  await setDoc(ref, { ...data, updatedAt: serverTimestamp() }, { merge: true })
}
