"use client"

import { useState, useEffect, useCallback, useTransition } from "react"

export type CartItem = {
  productId: string
  title: string
  slug: string
  image: string
  brand: string
  price: number
  discountPrice: number | null
  quantity: number
  subtotal: number
}

type CartState = {
  items: CartItem[]
  subtotal: number
  itemCount: number
  loading: boolean
  error: string | null
}

const LOCAL_KEY = "pantry_cart"

function loadLocalCart(): CartItem[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(LOCAL_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveLocalCart(items: CartItem[]) {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(items))
  } catch {
    // localStorage unavailable
  }
}

function itemSubtotal(item: CartItem): number {
  const effectivePrice = item.discountPrice ?? item.price
  return effectivePrice * item.quantity
}

function computeTotals(items: CartItem[]) {
  const subtotal = items.reduce((sum, i) => sum + itemSubtotal(i), 0)
  return { items, subtotal, itemCount: items.length }
}

async function apiFetch(method: string, body?: unknown) {
  const res = await fetch("/api/cart", {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include",
  })
  if (res.status === 401) return null
  const json = await res.json()
  if (!json.success) return null
  return json.data as { items: CartItem[]; subtotal: number; itemCount: number }
}

export function useCart() {
  const [state, setState] = useState<CartState>({
    items: [],
    subtotal: 0,
    itemCount: 0,
    loading: true,
    error: null,
  })

  const isServer = typeof window === "undefined"

  const sync = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }))

    const data = await apiFetch("GET")
    if (data) {
      setState({ ...data, loading: false, error: null })
      return
    }

    const local = loadLocalCart()
    const totals = computeTotals(local)
    setState({ ...totals, loading: false, error: null })
  }, [])

  const [, startTransition] = useTransition()

  useEffect(() => {
    if (!isServer) startTransition(() => sync())
  }, [isServer, sync])

  const addItem = useCallback(
    async (product: {
      _id: string
      title: string
      slug: string
      price: number
      discountPrice?: number
      images: string[]
      brand?: string
    }, quantity = 1) => {
      const data = await apiFetch("POST", { productId: product._id, quantity })
      if (data) {
        setState({ ...data, loading: false, error: null })
        return
      }

      setState((prev) => {
        const existing = prev.items.find((i) => i.productId === product._id)
        let items: CartItem[]
        if (existing) {
          items = prev.items.map((i) =>
            i.productId === product._id
              ? { ...i, quantity: i.quantity + quantity, subtotal: itemSubtotal({ ...i, quantity: i.quantity + quantity }) }
              : i,
          )
        } else {
          const newItem: CartItem = {
            productId: product._id,
            title: product.title,
            slug: product.slug,
            image: product.images?.[0] ?? "/potato-chips-1.jpg",
            brand: product.brand ?? "",
            price: product.price,
            discountPrice: product.discountPrice ?? null,
            quantity,
            subtotal: (product.discountPrice ?? product.price) * quantity,
          }
          items = [...prev.items, newItem]
        }
        saveLocalCart(items)
        return { ...computeTotals(items), loading: false, error: null }
      })
    },
    [],
  )

  const updateQuantity = useCallback(
    async (productId: string, quantity: number) => {
      if (quantity < 1) return

      const data = await apiFetch("PATCH", { productId, quantity })
      if (data) {
        setState({ ...data, loading: false, error: null })
        return
      }

      setState((prev) => {
        const items = prev.items.map((i) =>
          i.productId === productId ? { ...i, quantity, subtotal: itemSubtotal({ ...i, quantity }) } : i,
        )
        saveLocalCart(items)
        return { ...computeTotals(items), loading: false, error: null }
      })
    },
    [],
  )

  const removeItem = useCallback(async (productId: string) => {
    const data = await apiFetch("DELETE", undefined)
    if (data) {
      setState({ ...data, loading: false, error: null })
      return
    }

    setState((prev) => {
      const items = prev.items.filter((i) => i.productId !== productId)
      saveLocalCart(items)
      return { ...computeTotals(items), loading: false, error: null }
    })
  }, [])

  const clearCart = useCallback(async () => {
    const data = await apiFetch("DELETE")
    if (data) {
      setState({ ...data, loading: false, error: null })
      return
    }

    saveLocalCart([])
    setState({ items: [], subtotal: 0, itemCount: 0, loading: false, error: null })
  }, [])

  return { ...state, addItem, updateQuantity, removeItem, clearCart, refresh: sync }
}
