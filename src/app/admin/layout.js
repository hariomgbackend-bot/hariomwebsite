'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import AdminGuard from '@/components/AdminGuard'
import { auth } from '@/lib/firebase'
import { signOut } from 'firebase/auth'

const sidebarLinks = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { href: '/admin/categories', label: 'Categories', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16' },
  { href: '/admin/products', label: 'Products', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
  { href: '/admin/offers', label: 'Offers', icon: 'M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7' },
  { href: '/admin/stores', label: 'Stores', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
  { href: '/admin/brands', label: 'Brands', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
  { href: '/admin/banners', label: 'Banners', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { href: '/admin/settings', label: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
]

export default function AdminLayout({ children }) {
  var pathname = usePathname()
  var router = useRouter()

  async function handleSignOut() {
    if (!auth) return
    await signOut(auth)
    router.push('/admin/login')
  }

  var content = (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-56 bg-white border-r border-gray-200 flex-shrink-0 hidden md:flex flex-col">
        <div className="p-4 border-b border-gray-100">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg overflow-hidden bg-[#0B1F4B] flex-shrink-0">
              <img src="/logo-icon.png" alt="" className="w-full h-full object-contain p-0.5" />
            </div>
            <span className="text-sm font-bold text-[#0B1F4B]">Admin</span>
          </Link>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {sidebarLinks.map(function (link) {
            var active = pathname.startsWith(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active ? 'bg-[#fff4ed] text-[#FF5E1A]' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={link.icon} />
                </svg>
                {link.label}
              </Link>
            )
          })}
        </nav>
        <div className="p-3 border-t border-gray-100 space-y-1">
          <Link href="/" className="flex items-center gap-2 px-3 py-2 text-xs text-gray-400 hover:text-gray-600 transition-colors rounded-lg">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Site
          </Link>
          <button onClick={handleSignOut} className="flex items-center gap-2 px-3 py-2 text-xs text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors rounded-lg w-full text-left">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </button>
        </div>
      </aside>
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 h-14 flex items-center px-4 md:px-6">
          <div className="flex items-center gap-3 ml-auto">
            <Link href="/" className="text-xs text-gray-400 hover:text-[#FF5E1A] transition-colors">View Site</Link>
            <button onClick={handleSignOut} className="text-xs text-red-500 hover:text-red-700 transition-colors">Sign Out</button>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )

  if (pathname === '/admin/login') return children

  return <AdminGuard>{content}</AdminGuard>
}
