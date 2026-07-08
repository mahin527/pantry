"use client"

import { useState } from "react"
import Rating from "@mui/material/Rating"
import { Button } from "@mui/material"
import { IoMdHeartEmpty, IoMdHeart } from "react-icons/io"
import Tooltip from "@mui/material/Tooltip"
import { RiShoppingBag3Line } from "react-icons/ri"
import QuantityBox from "./QuantityBox"
import { useCart } from "@/hooks/useCart"
import { useWishlist } from "@/hooks/useWishlist"
import { formatPrice } from "@/lib/utils"

type Product = {
  _id: string
  title: string
  brand?: string
  rating: number
  reviewCount: number
  price: number
  discountPrice?: number
  stock: number
  description: string
  images: string[]
  slug: string
}

function ProductDetails({ product }: { product: Product }) {
  const [qty, setQty] = useState(1)
  const outOfStock = product.stock <= 0
  const { addItem } = useCart()
  const { addItem: addWishlist, removeItem, isInWishlist } = useWishlist()

  const inWishlist = isInWishlist(product._id)

  const handleAdd = () => {
    addItem(
      {
        _id: product._id,
        title: product.title,
        slug: product.slug,
        price: product.price,
        discountPrice: product.discountPrice,
        images: product.images,
        brand: product.brand,
      },
      qty,
    )
  }

  const handleWishlist = () => {
    if (inWishlist) {
      removeItem(product._id)
    } else {
      addWishlist({
        _id: product._id,
        title: product.title,
        slug: product.slug,
        price: product.price,
        discountPrice: product.discountPrice,
        images: product.images,
        brand: product.brand,
        rating: product.rating,
      })
    }
  }

  return (
    <div className="py-3 w-full md:w-[60%] space-y-6 md:space-y-8">
      <div>
        <h2 className="text-xl lg:text-2xl 2xl:text-3xl font-semibold text-gray-700">
          {product.title}
        </h2>
      </div>
      <div className="flex gap-4 items-center text-base 2xl:text-lg font-bold text-gray-600">
        {product.brand && (
          <div>
            Brand: <span>{product.brand}</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Rating name="read-only" value={product.rating} readOnly />
          <span>Review ({product.reviewCount})</span>
        </div>
      </div>
      <div className="flex gap-5 items-center">
        <div className="flex items-center gap-3 text-lg xl:text-xl font-bold">
          <p className="text-blue-500">
            {formatPrice(product.discountPrice ?? product.price)}
          </p>
          {product.discountPrice && (
            <p className="text-gray-500 line-through">{formatPrice(product.price)}</p>
          )}
        </div>
        <div className="flex items-center gap-2 font-bold text-gray-600">
          <span>Available in stock: </span>
          <span>{product.stock.toLocaleString()} items</span>
        </div>
      </div>
      <div>
        <p className="text-base 2xl:text-lg font-bold text-gray-600 tracking-wider leading-7">
          {product.description}
        </p>
      </div>
      <div>
        <div className="flex items-center gap-3">
          <QuantityBox disabled={outOfStock} onChange={setQty} />
          <Button
            variant="contained"
            className="py-2.5! font-bold! space-x-2!"
            disabled={outOfStock}
            onClick={handleAdd}
            suppressHydrationWarning
          >
            <RiShoppingBag3Line size={26} /> {outOfStock ? "Out of Stock" : "Add to cart"}
          </Button>
          <Tooltip
            title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
            placement="top"
          >
            <Button className="rounde-md!" onClick={handleWishlist} suppressHydrationWarning>
              {inWishlist ? (
                <IoMdHeart size={34} className="text-red-500" />
              ) : (
                <IoMdHeartEmpty size={34} />
              )}
            </Button>
          </Tooltip>
        </div>
      </div>
    </div>
  )
}

export default ProductDetails
