import { Types } from "mongoose"
import { Wishlist, IWishlist, type IWishlistItem } from "@/models"

export const wishlistRepository = {
  async getWishlist(userId: string): Promise<IWishlist | null> {
    return Wishlist.findOne({ user: userId }).populate({
      path: "items.product",
      select: "title slug price discountPrice images stock isActive brand rating",
    })
  },

  async addItem(userId: string, productId: string): Promise<IWishlist> {
    let wishlist = await Wishlist.findOne({ user: userId })
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: userId, items: [] })
    }

    wishlist.items.push({ product: new Types.ObjectId(productId) })
    await wishlist.save()
    return wishlist
  },

  async removeItem(userId: string, productId: string): Promise<IWishlist | null> {
    const wishlist = await Wishlist.findOne({ user: userId })
    if (!wishlist) return null

    wishlist.items = wishlist.items.filter(
      (i: IWishlistItem) => i.product.toString() !== productId,
    )
    await wishlist.save()
    return wishlist
  },

  async clearWishlist(userId: string): Promise<IWishlist | null> {
    const wishlist = await Wishlist.findOne({ user: userId })
    if (!wishlist) return null

    wishlist.items = []
    await wishlist.save()
    return wishlist
  },

  async hasItem(userId: string, productId: string): Promise<boolean> {
    const wishlist = await Wishlist.findOne({ user: userId })
    if (!wishlist) return false
    return wishlist.items.some((i: IWishlistItem) => i.product.toString() === productId)
  },
}
