'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'

var CartContext = createContext(null)
var STORAGE_KEY = 'hariom_cart_v1'

function loadCart() {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]')
  } catch (e) {
    return []
  }
}

function parsePrice(value) {
  if (!value) return 0
  var parsed = parseFloat(String(value).replace(/[^\d.]/g, ''))
  return Number.isFinite(parsed) ? parsed : 0
}

export function CartProvider({ children }) {
  var [items, setItems] = useState([])

  useEffect(function () {
    setItems(loadCart())
  }, [])

  useEffect(function () {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    }
  }, [items])

  function addItem(product, quantity) {
    quantity = quantity || 1
    setItems(function (current) {
      var found = current.find(function (item) { return item.id === product.id })
      if (found) {
        return current.map(function (item) {
          return item.id === product.id ? Object.assign({}, item, { quantity: item.quantity + quantity }) : item
        })
      }
      return current.concat([{
        id: product.id,
        slug: product.slug,
        name: product.name,
        brand: product.brand || '',
        price: product.price || '',
        image: product.image || '',
        quantity: quantity
      }])
    })
  }

  function updateQuantity(id, quantity) {
    var nextQty = Math.max(1, Number(quantity) || 1)
    setItems(function (current) {
      return current.map(function (item) {
        return item.id === id ? Object.assign({}, item, { quantity: nextQty }) : item
      })
    })
  }

  function removeItem(id) {
    setItems(function (current) {
      return current.filter(function (item) { return item.id !== id })
    })
  }

  function clearCart() {
    setItems([])
  }

  var summary = useMemo(function () {
    var totalQuantity = items.reduce(function (sum, item) { return sum + item.quantity }, 0)
    var subtotal = items.reduce(function (sum, item) {
      return sum + (parsePrice(item.price) * item.quantity)
    }, 0)
    return { totalQuantity: totalQuantity, subtotal: subtotal }
  }, [items])

  return (
    <CartContext.Provider value={{
      items: items,
      addItem: addItem,
      updateQuantity: updateQuantity,
      removeItem: removeItem,
      clearCart: clearCart,
      totalQuantity: summary.totalQuantity,
      subtotal: summary.subtotal
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  var value = useContext(CartContext)
  if (!value) throw new Error('useCart must be used inside CartProvider')
  return value
}

export function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value || 0)
}
