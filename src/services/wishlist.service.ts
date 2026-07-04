import { connectDB } from "@/lib/db"
import { wishlistRepository } from "@/repositories/wishlist.repository"
import { Product } from "@/models"
import { success, error } from "@/lib/api-response"
import { MESSAGES } from "@/lib/messages"
import type { ApiResponse } from "@/types/common"

type WishlistItemResponse = {
  productId: string
  title: string
  slug: string
  image: string
  brand: string
  price: number
  discountPrice: number | null
  rating: number
}

type WishlistResponse = {
  items: WishlistItemResponse[]
  itemCount: number
}

function toWishlistResponse(
  wishlist: { items: { product: unknown }[] } | null,
): WishlistResponse {
  if (!wishlist || !wishlist.items) {
    return { items: [], itemCount: 0 }
  }

  const items: WishlistItemResponse[] = []

  for (const item of wishlist.items) {
    const product = item.product as {
      _id: { toString(): string }
      title: string
      slug: string
      price: number
      discountPrice?: number
      images: string[]
      stock: number
      isActive: boolean
      brand?: string
      rating: number
    }

    if (!product || !product._id) continue

    items.push({
      productId: product._id.toString(),
      title: product.title,
      slug: product.slug,
      image: product.images?.[0] ?? "/potato-chips-1.jpg",
      brand: product.brand ?? "",
      price: product.price,
      discountPrice: product.discountPrice ?? null,
      rating: product.rating ?? 0,
    })
  }

  return { items, itemCount: items.length }
}

export const wishlistService = {
  async getWishlist(userId: string): Promise<ApiResponse<WishlistResponse>> {
    await connectDB()

    const wishlist = await wishlistRepository.getWishlist(userId)

    return success(toWishlistResponse(wishlist), MESSAGES.WISHLIST_FETCHED)
  },

  async addItem(
    userId: string,
    productId: string,
  ): Promise<ApiResponse<WishlistResponse>> {
    await connectDB()

    const product = await Product.findById(productId).select("isActive")
    if (!product) {
      return error(MESSAGES.PRODUCT_NOT_FOUND)
    }
    if (!product.isActive) {
      return error(MESSAGES.PRODUCT_INACTIVE)
    }

    const has = await wishlistRepository.hasItem(userId, productId)
    if (has) {
      return error(MESSAGES.PRODUCT_ALREADY_IN_WISHLIST)
    }

    await wishlistRepository.addItem(userId, productId)
    const populated = await wishlistRepository.getWishlist(userId)

    return success(toWishlistResponse(populated), MESSAGES.WISHLIST_ITEM_ADDED)
  },

  async removeItem(
    userId: string,
    productId: string,
  ): Promise<ApiResponse<WishlistResponse>> {
    await connectDB()

    await wishlistRepository.removeItem(userId, productId)
    const populated = await wishlistRepository.getWishlist(userId)

    return success(toWishlistResponse(populated), MESSAGES.WISHLIST_ITEM_REMOVED)
  },

  async clearWishlist(userId: string): Promise<ApiResponse<WishlistResponse>> {
    await connectDB()

    await wishlistRepository.clearWishlist(userId)

    return success({ items: [], itemCount: 0 }, MESSAGES.WISHLIST_CLEARED)
  },
}
