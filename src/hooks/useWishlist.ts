"use client"

import { useWishlistContext } from "@/providers/WishlistProvider"
export type { WishlistItem } from "@/providers/WishlistProvider"

export function useWishlist() {
  return useWishlistContext()
}
