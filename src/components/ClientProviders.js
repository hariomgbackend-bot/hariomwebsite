'use client'

import { CartProvider } from '@/lib/cart'

export default function ClientProviders({ children }) {
  return <CartProvider>{children}</CartProvider>
}
