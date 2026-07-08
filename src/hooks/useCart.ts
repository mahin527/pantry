"use client"

import { useCartContext } from "@/providers/CartProvider"
export type { CartItem } from "@/providers/CartProvider"

export function useCart() {
  return useCartContext()
}
