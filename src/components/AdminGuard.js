'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { auth } from '@/lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'

var ADMIN_UID = 'OIkdwBtfJTgy1ZQpkKiH0YxdIgo2'

export default function AdminGuard({ children }) {
  var router = useRouter()
  var pathname = usePathname()
  var [authorized, setAuthorized] = useState(false)
  var [checking, setChecking] = useState(true)

  useEffect(function () {
    if (!auth) {
      setChecking(false)
      setAuthorized(false)
      return
    }

    var unsub = onAuthStateChanged(auth, function (user) {
      if (user && user.uid === ADMIN_UID) {
        setAuthorized(true)
        setChecking(false)
      } else {
        setAuthorized(false)
        setChecking(false)
        if (pathname !== '/admin/login') {
          router.replace('/admin/login')
        }
      }
    })

    return unsub
  }, [router, pathname])

  if (pathname === '/admin/login') return children

  if (checking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-gray-500 text-sm">Verifying access...</div>
      </div>
    )
  }

  if (!authorized) {
    return null
  }

  return children
}
