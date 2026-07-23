"use client"

import Image from "next/image"
import { Button, IconButton } from "@mui/material"
import Rating from "@mui/material/Rating"
import Link from "next/link"
import { IoMdHeartEmpty, IoMdHeart } from "react-icons/io"
import { RiShoppingBag3Line } from "react-icons/ri"
import { useCart } from "@/hooks/useCart"
import { useWishlist } from "@/hooks/useWishlist"
import { formatPrice, hasDiscount, getEffectivePrice } from "@/lib/utils"

type ProductItem = {
  _id: string
  title: string
  slug: string
  price: number
  discountPrice?: number
  images: string[]
  rating: number
  brand?: string
}

function ProductItems({ product }: { product?: ProductItem }) {
  const { addItem } = useCart()
  const { addItem: addWishlist, removeItem, isInWishlist } = useWishlist()

  const title = product?.title || "Product Unavailable"
  const slug = product?.slug || "product-unavailable"
  const imageSrc = product?.images?.[0] || "/placeholder-product.png"
  const brand = product?.brand || "Unknown"
  const rating = product?.rating ?? 0
  const originalPrice = product?.price ?? 0
  const discountPrice = product?.discountPrice ?? undefined
  const isDiscounted = hasDiscount(originalPrice, discountPrice)
  const effectivePrice = getEffectivePrice(originalPrice, discountPrice)

  const inWishlist = product ? isInWishlist(product._id) : false

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!product) return
    if (inWishlist) {
      removeItem(product._id)
    } else {
      addWishlist(product)
    }
  }

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!product) return
    addItem(product, 1)
  }

  return (
    <div className="group bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 w-full h-full max-w-52 max-h-86 flex flex-col overflow-hidden">
      {/* Image section */}
      <Link href={`/product/${slug}`} className="relative overflow-hidden bg-gray-50 aspect-square">
        <Image
          src={imageSrc}
          alt={title}
          height={200}
          width={200}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 200px"
        />

        {/* Brand badge */}
        <span className="absolute left-2 top-2 bg-white/90 backdrop-blur-sm text-[10px] md:text-xs font-bold text-gray-600 px-2 py-0.5 rounded-md shadow-sm border border-gray-100">
          {brand}
        </span>

        {/* Discount badge */}
        {isDiscounted && (
          <span className="absolute right-2 top-2 bg-red-500 text-white text-[10px] md:text-xs font-bold px-2 py-0.5 rounded-md shadow-sm">
            -{Math.round((1 - effectivePrice / originalPrice) * 100)}%
          </span>
        )}

        {/* Wishlist icon */}
        {product && (
          <IconButton
            onClick={handleWishlist}
            size="small"
            className="absolute! bottom-2 right-2! z-10! bg-white/90! hover:bg-white! shadow-sm!"
            sx={{ width: 34, height: 34 }}
            aria-label={inWishlist ? `Remove ${title} from wishlist` : `Add ${title} to wishlist`}
          >
            {inWishlist ? (
              <IoMdHeart size={18} className="text-red-500" />
            ) : (
              <IoMdHeartEmpty size={18} className="text-gray-500" />
            )}
          </IconButton>
        )}
      </Link>

      {/* Content section */}
      <div className="p-3 md:p-4 flex flex-col flex-1 gap-1.5 md:gap-2">
        <Link href={`/product/${slug}`} className="block">
          <h3 className="font-bold text-xs md:text-sm text-gray-800 leading-snug line-clamp-2 hover:text-blue-600 transition-colors">
            {title}
          </h3>
        </Link>

        <Rating value={rating} size="small" readOnly className="text-amber-400!" />

        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-sm md:text-base text-blue-600">
              {formatPrice(effectivePrice)}
            </span>
            {isDiscounted && (
              <span className="text-[11px] md:text-xs font-medium text-gray-400 line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>
        </div>

        <Button
          variant="contained"
          onClick={handleAdd}
          suppressHydrationWarning
          className="w-full! rounded-lg! font-bold! text-[11px]! md:text-xs! py-2! md:py-2.5! shadow-sm hover:shadow-md! transition-all! flex items-center justify-center gap-1.5!"
        >
          <RiShoppingBag3Line size={16} className="md:size-[18]" />
          Add
        </Button>
      </div>
    </div>
  )
}

export default ProductItems
