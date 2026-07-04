"use client"

import Image from "next/image"
import { Button, IconButton } from "@mui/material"
import Rating from "@mui/material/Rating"
import Link from "next/link"
import { useCart } from "@/hooks/useCart"
import { useWishlist } from "@/hooks/useWishlist"
import { IoMdHeartEmpty, IoMdHeart } from "react-icons/io"
import { formatPrice } from "@/lib/utils"

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
  const title = product?.title || "Colorful fruit juices - 64 fl oz Bottle"
  const slug = product?.slug || "23454356"
  const imageSrc =
    product?.images?.[0] ||
    "/product-1-colorful-fruit-juices-in-glass-bottles-with-fresh-fruit.png"
  const brand = product?.brand || "Bingo"
  const rating = product?.rating ?? 4
  const price = product?.price ?? 24.09
  const discountPrice = product?.discountPrice ?? 32.21

  const inWishlist = product ? isInWishlist(product._id) : false

  const handleWishlist = () => {
    if (!product) return
    if (inWishlist) {
      removeItem(product._id)
    } else {
      addWishlist(product)
    }
  }

  const handleAdd = () => {
    if (!product) return
    addItem(product, 1)
  }

  return (
    <div className="text-gray-600 space-y-2 md:space-y-3 group py-2 px-3 overflow-hidden bg-white shadow-md rounded-md w-full max-w-52 h-80 md:h-88 flex flex-col">
      <Link
        href={`/product/${slug}`}
        className="hover:text-blue-500 transition-colors duration-150 flex-shrink-0"
      >
        <div className="relative img flex items-center justify-center py-2 md:py-3 aspect-square">
          <Image
            src={imageSrc}
            alt={title}
            height={140}
            width={140}
            className="object-contain transition duration-200 group-hover:scale-105 max-h-full"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 200px"
          />
          <span className="z-2 absolute left-0 top-0 border-2 font-bold border-gray-500 text-gray-500 py-0.5 px-1 rounded-md text-[10px] md:text-xs">
            {brand}
          </span>
          {product && (
            <IconButton
              onClick={(e) => {
                e.preventDefault()
                handleWishlist()
              }}
              size="small"
              className="absolute! top-0 right-0 z-10 bg-white/80 hover:bg-white"
              sx={{ position: "absolute", top: 0, right: 0, zIndex: 10 }}
              aria-label={inWishlist ? `Remove ${title} from wishlist` : `Add ${title} to wishlist`}
            >
              {inWishlist ? (
                <IoMdHeart size={18} className="text-red-500" />
              ) : (
                <IoMdHeartEmpty size={18} className="text-gray-500" />
              )}
            </IconButton>
          )}
        </div>
        <h3 className="font-bold text-xs md:text-sm tracking-wider line-clamp-2">{title}</h3>
      </Link>
      <div className="flex-1" />
      <Rating name="read-only" value={rating} size="small" readOnly className="pt-1 md:pt-2" />
      <div className="price flex items-center justify-between">
        <p className="text-blue-500 font-bold text-sm md:text-base">{formatPrice(price)}</p>
        {discountPrice != null && (
          <p className="text-gray-400 font-bold line-through text-xs md:text-sm">{formatPrice(discountPrice)}</p>
        )}
      </div>
      <div className="flex flex-col items-center w-full">
        <Button
          variant="contained"
          className="text-center! w-full! font-bold! text-xs! md:text-sm! py-1.5! md:py-2!"
          onClick={handleAdd}
        >
          Add to cart
        </Button>
      </div>
    </div>
  )
}

export default ProductItems
