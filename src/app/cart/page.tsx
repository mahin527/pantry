"use client"

import Image from "next/image"
import Rating from "@mui/material/Rating"
import QuantityBox from "@/components/QuantityBox"
import { RiDeleteBin6Line } from "react-icons/ri"
import { Button } from "@mui/material"
import Link from "next/link"
import { useCart } from "@/hooks/useCart"
import { CircularProgress, Box } from "@mui/material"

export default function CartPage() {
  const { items, subtotal, itemCount, loading, updateQuantity, removeItem } =
    useCart()

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (items.length === 0) {
    return (
      <section className="py-10 bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-4">Looks like you haven&apos;t added anything yet.</p>
          <Button variant="contained" component={Link} href="/products">
            Start Shopping
          </Button>
        </div>
      </section>
    )
  }

  return (
    <section className="py-10 bg-gray-100">
      <div className="container flex justify-between gap-5">
        <div className="w-[75%] bg-white rounded-md border border-gray-200">
          <div className="space-y-3 py-4 border-b border-gray-200">
            <h3 className="px-5 text-xl lg:text-2xl text-gray-700 tracking-wider font-bold">
              Your Cart
            </h3>
            <h6 className="px-5 text-base lg:text-lg text-gray-600 tracking-wide font-semibold">
              There are {itemCount} product{itemCount !== 1 ? "s" : ""} in your cart
            </h6>
          </div>

          {items.map((item) => (
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
                  <Rating name="read-only" value={5} readOnly />
                  <div className="flex items-center gap-3 text-gray-600">
                    <QuantityBox
                      disabled={false}
                      onChange={(val) => updateQuantity(item.productId, val)}
                    />
                    {item.discountPrice ? (
                      <>
                        <p className="text-blue-500 font-bold">
                          ${item.discountPrice.toFixed(2)}
                        </p>
                        <p className="text-gray-400 font-bold line-through">
                          ${item.price.toFixed(2)}
                        </p>
                      </>
                    ) : (
                      <p className="text-blue-500 font-bold">${item.price.toFixed(2)}</p>
                    )}
                    <p className="font-bold text-gray-600">
                      Sub: ${item.subtotal.toFixed(2)}
                    </p>
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
          ))}
        </div>

        <div className="w-[25%]">
          <div className="bg-white rounded-md border border-gray-200">
            <div className="py-4 border-b border-gray-200">
              <h3 className="px-5 text-xl lg:text-2xl text-gray-700 tracking-wider font-bold">
                Cart Totals
              </h3>
            </div>

            <div className="space-y-3 py-3 font-medium text-gray-600">
              <div className="px-5 flex items-center justify-between">
                <span>Subtotal</span>
                <span className="text-blue-500">${subtotal.toFixed(2)}</span>
              </div>

              <div className="px-5 flex items-center justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>

              <div className="px-5 flex items-center justify-between">
                <span>Estimate for</span>
                <span>Global</span>
              </div>
              <div className="px-5 py-2 flex items-center justify-between">
                <span className="font-bold text-xl">Total</span>
                <span className="font-bold text-blue-500 text-xl">
                  ${subtotal.toFixed(2)}
                </span>
              </div>

              <div className="px-5 py-2 text-center w-full">
                <Link href={"/checkout"}>
                  <Button variant="contained" className="w-full">
                    Next
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
