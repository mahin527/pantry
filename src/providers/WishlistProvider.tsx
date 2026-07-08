"use client"

import { createContext, useContext, useState, useEffect, useCallback, startTransition, ReactNode } from "react"
import { toast } from "sonner"

export type WishlistItem = {
  productId: string
  title: string
  slug: string
  image: string
  brand: string
  price: number
  discountPrice: number | null
  rating: number
}

type WishlistState = {
  items: WishlistItem[]
  itemCount: number
  loading: boolean
  error: string | null
}

type WishlistContextType = WishlistState & {
  addItem: (product: {
    _id: string
    title: string
    slug: string
    price: number
    discountPrice?: number
    images: string[]
    brand?: string
    rating?: number
  }) => Promise<void>
  removeItem: (productId: string) => Promise<void>
  clearWishlist: () => Promise<void>
  refresh: () => Promise<void>
  isInWishlist: (productId: string) => boolean
}

const LOCAL_KEY = "pantry_wishlist"

function loadLocalWishlist(): WishlistItem[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(LOCAL_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveLocalWishlist(items: WishlistItem[]) {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(items))
  } catch {
    // localStorage unavailable
  }
}

async function apiFetch(method: string, body?: unknown) {
  const res = await fetch("/api/wishlist", {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include",
  })
  if (res.status === 401) return null
  const json = await res.json()
  if (!json.success) return null
  return json.data as { items: WishlistItem[]; itemCount: number }
}

const WishlistContext = createContext<WishlistContextType | null>(null)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WishlistState>({
    items: [],
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

    const local = loadLocalWishlist()
    setState({ items: local, itemCount: local.length, loading: false, error: null })
  }, [])

  useEffect(() => {
    if (!isServer) startTransition(() => { sync() })
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
      rating?: number
    }) => {
      const data = await apiFetch("POST", { productId: product._id })
      if (data) {
        setState({ ...data, loading: false, error: null })
        toast.success("❤️ Added to wishlist!", { duration: 3000, position: "bottom-right" })
        return
      }

      setState((prev) => {
        if (prev.items.some((i) => i.productId === product._id)) return prev

        const newItem: WishlistItem = {
          productId: product._id,
          title: product.title,
          slug: product.slug,
          image: product.images?.[0] ?? "/potato-chips-1.jpg",
          brand: product.brand ?? "",
          price: product.price,
          discountPrice: product.discountPrice ?? null,
          rating: product.rating ?? 0,
        }
        const items = [...prev.items, newItem]
        saveLocalWishlist(items)
        return { items, itemCount: items.length, loading: false, error: null }
      })
      toast.success("❤️ Added to wishlist!", { duration: 3000, position: "bottom-right" })
    },
    [],
  )

  const removeItem = useCallback(async (productId: string) => {
    try {
      const res = await fetch(`/api/wishlist?productId=${productId}`, {
        method: "DELETE",
        credentials: "include",
      })
      if (res.status === 401) throw new Error("not authenticated")
      const json = await res.json()
      if (json.success && json.data) {
        setState({ ...json.data, loading: false, error: null })
        toast.info("Removed from wishlist", { duration: 3000, position: "bottom-right" })
        return
      }
    } catch {
      // fallback to localStorage
    }

    setState((prev) => {
      const items = prev.items.filter((i) => i.productId !== productId)
      saveLocalWishlist(items)
      return { items, itemCount: items.length, loading: false, error: null }
    })
    toast.info("Removed from wishlist", { duration: 3000, position: "bottom-right" })
  }, [])

  const clearWishlist = useCallback(async () => {
    try {
      const res = await fetch("/api/wishlist", {
        method: "DELETE",
        credentials: "include",
      })
      if (res.status === 401) throw new Error("not authenticated")
      const json = await res.json()
      if (json.success && json.data) {
        setState({ ...json.data, loading: false, error: null })
        return
      }
    } catch {
      // fallback to localStorage
    }

    saveLocalWishlist([])
    setState({ items: [], itemCount: 0, loading: false, error: null })
  }, [])

  const isInWishlist = useCallback(
    (productId: string) => state.items.some((i) => i.productId === productId),
    [state.items],
  )

  const value: WishlistContextType = {
    ...state,
    addItem,
    removeItem,
    clearWishlist,
    refresh: sync,
    isInWishlist,
  }

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlistContext() {
  const context = useContext(WishlistContext)
  if (!context) throw new Error("useWishlistContext must be used inside WishlistProvider")
  return context
}
