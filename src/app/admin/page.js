'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
  var router = useRouter()
  useEffect(function () { router.replace('/admin/dashboard') }, [router])
  return null
}
