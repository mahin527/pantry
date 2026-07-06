"use client"

import AccountSidebar from "@/components/AccountSidebar"
import Image from "next/image"
import Rating from "@mui/material/Rating"
import { RiDeleteBin6Line } from "react-icons/ri"
import { Button, CircularProgress, Box } from "@mui/material"
import { useWishlist } from "@/hooks/useWishlist"
import { useCart } from "@/hooks/useCart"
import { formatPrice } from "@/lib/utils"
import Link from "next/link"

export default function WishlistPage() {
  const { items, itemCount, loading, removeItem } = useWishlist()
  const { addItem } = useCart()

  if (loading) {
    return (
      <section className="bg-gray-100 py-8 min-h-screen">
        <div className="container flex flex-col md:flex-row gap-5">
          <div className="w-full md:w-[25%]">
            <Box sx={{ bgcolor: "white", p: 2, borderRadius: 2, height: 300 }} />
          </div>
          <div className="wrapper w-full md:w-[75%] flex items-center justify-center">
            <CircularProgress />
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-gray-100 py-8">
      <div className="container flex flex-col md:flex-row gap-5">
        <div className="w-full md:w-[25%]">
          <AccountSidebar />
        </div>

        <div className="wrapper w-full md:w-[75%] space-y-8">
          <div className="bg-white shadow-md rounded-md">
            <div className="py-6 px-6 border-b border-gray-200 flex items-center justify-between">
              <div className="space-y-2">
                <h3 className="text-xl lg:text-2xl text-gray-700 tracking-wider font-bold">
                  Wishlist
                </h3>
                <p className="text-base lg:text-lg text-gray-600 tracking-wider font-bold">
                  There are{" "}
                  <span className="text-blue-500 font-semibold">{itemCount}</span> products
                  in your Wishlist
                </p>
              </div>
            </div>

            {items.length === 0 ? (
              <div className="py-12 px-6 text-center">
                <p className="text-gray-500 font-medium">Your wishlist is empty</p>
                <p className="text-sm text-gray-400 mt-1">
                  <Link href="/products" className="text-blue-500 hover:underline font-bold">
                    Browse Products
                  </Link>
                </p>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.productId}
                  className="px-5 flex justify-between py-4 border-b border-gray-200"
                >
                  <div className="flex items-center gap-4">
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={100}
                      height={100}
                      className="h-28 w-20 rounded-md object-cover"
                    />
                    <div className="space-y-2">
                      <span className="text-xs lg:text-sm text-gray-500">{item.brand}</span>
                      <h4 className="font-bold text-base lg:text-lg text-gray-700">
                        {item.title}
                      </h4>
                      <Rating name="read-only" value={item.rating} readOnly />
                      <div className="flex items-center gap-3 text-gray-600">
                        {item.discountPrice ? (
                          <>
                            <p className="text-blue-500 font-bold">
                              {formatPrice(item.discountPrice)}
                            </p>
                            <p className="text-gray-400 font-bold line-through">
                              {formatPrice(item.price)}
                            </p>
                          </>
                        ) : (
                          <p className="text-blue-500 font-bold">{formatPrice(item.price)}</p>
                        )}
                        <Button
                          size="small"
                          variant="contained"
                          onClick={() => {
                            addItem(
                              {
                                _id: item.productId,
                                title: item.title,
                                slug: item.slug,
                                price: item.price,
                                discountPrice: item.discountPrice ?? undefined,
                                images: [item.image],
                                brand: item.brand,
                              },
                              1,
                            )
                            removeItem(item.productId)
                          }}
                        >
                          Move to Cart
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Button
                      className="py-5! rounded-full! font-bold! text-red-600!"
                      onClick={() => removeItem(item.productId)}
                    >
                      <RiDeleteBin6Line size={20} />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
