"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { FaPlus } from "react-icons/fa"
import { Button, CircularProgress, Snackbar, Alert, Radio } from "@mui/material"
import { useAppContext } from "@/providers/AppProvider"
import { useCart } from "@/hooks/useCart"
import { useRouter } from "next/navigation"

type Address = {
  _id: string
  fullName: string
  phone: string
  country: string
  city: string
  area?: string
  street?: string
  postalCode: string
  label: string
  isDefault: boolean
}

function CheckoutPage() {
  const { openAddAddress } = useAppContext()
  const router = useRouter()
  const { items, subtotal, itemCount, loading: cartLoading, clearCart } = useCart()

  const [addresses, setAddresses] = useState<Address[]>([])
  const [addressLoading, setAddressLoading] = useState(true)
  const [selectedAddressId, setSelectedAddressId] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const [snackbar, setSnackbar] = useState<{
    open: boolean
    message: string
    severity: "success" | "error"
  }>({ open: false, message: "", severity: "success" })

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbar({ open: true, message, severity })
  }

  useEffect(() => {
    fetch("/api/addresses", { credentials: "include" })
      .then((res) => {
        if (res.status === 401 || res.status === 403) {
          router.push("/login")
          return null
        }
        return res.json()
      })
      .then((json) => {
        if (json && json.success && json.data) {
          setAddresses(json.data)
          const defaultAddr = json.data.find((a: Address) => a.isDefault)
          if (defaultAddr) setSelectedAddressId(defaultAddr._id)
        }
      })
      .catch(() => showSnackbar("Failed to load addresses", "error"))
      .finally(() => setAddressLoading(false))
  }, [router])

  const shippingFee = subtotal >= 100 || subtotal === 0 ? 0 : 5.99
  const total = subtotal + shippingFee

  const placeOrder = async () => {
    if (!selectedAddressId) {
      showSnackbar("Please select a delivery address", "error")
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ addressId: selectedAddressId }),
        credentials: "include",
      })

      if (res.status === 401 || res.status === 403) {
        router.push("/login")
        return
      }

      const json = await res.json()
      if (json.success) {
        showSnackbar("Order placed successfully!", "success")
        clearCart()
        setTimeout(() => router.push("/my-orders"), 1000)
      } else {
        showSnackbar(json.message || "Failed to place order", "error")
      }
    } catch {
      showSnackbar("Something went wrong. Please try again.", "error")
    } finally {
      setSubmitting(false)
    }
  }

  const isLoading = cartLoading || addressLoading

  if (isLoading) {
    return (
      <section className="py-10 bg-gray-100 min-h-screen flex items-center justify-center">
        <CircularProgress />
      </section>
    )
  }

  if (items.length === 0) {
    return (
      <section className="py-10 bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-4">Add some items before checkout.</p>
          <Button variant="contained" href="/products">
            Browse Products
          </Button>
        </div>
      </section>
    )
  }

  return (
    <section className="py-10 bg-gray-100">
      <div className="container flex flex-col md:flex-row justify-between gap-5">
        <div className="w-full md:w-[65%] py-4 bg-white rounded-md border border-gray-200">
          <div className="px-6 space-y-3 py-4 border-b border-gray-200 flex justify-between">
            <h3 className="text-xl lg:text-2xl text-gray-700 tracking-wider font-bold">
              Select Delivery Address
            </h3>
            <Button
              onClick={openAddAddress}
              variant="outlined"
              className="font-bold! flex! items-center! gap-2!"
            >
              <FaPlus size={16} /> Add new address
            </Button>
          </div>

          <div className="py-4 px-6 space-y-4">
            {addresses.length === 0 ? (
              <p className="text-gray-500 text-center py-6">
                No addresses found. Add one to continue.
              </p>
            ) : (
              addresses.map((address) => (
                <div
                  key={address._id}
                  className={`flex items-start gap-3 p-4 border rounded-md cursor-pointer transition-colors ${
                    selectedAddressId === address._id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedAddressId(address._id)}
                >
                  <Radio checked={selectedAddressId === address._id} readOnly />
                  <div className="text-gray-600 font-medium">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-700">{address.label}</span>
                      {address.isDefault && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-bold">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="font-semibold">{address.fullName}</p>
                    <p>
                      {[address.street, address.area, address.city, address.country]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                    <p>{address.phone}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="w-full md:w-[35%]">
          <div className="bg-white rounded-md border border-gray-200">
            <div className="py-4 border-b border-gray-200">
              <h3 className="px-5 text-xl lg:text-2xl text-gray-700 tracking-wider font-bold">
                Your Order
              </h3>
            </div>

            <div className="space-y-3 font-medium text-gray-600">
              <div className="px-5 py-3 flex items-center justify-between font-bold border-b border-gray-200">
                <span>Product</span>
                <span>Subtotal</span>
              </div>

              <div className="max-h-75 overflow-y-scroll">
                {items.map((item) => (
                  <div key={item.productId} className="flex px-5 py-2">
                    <div className="flex gap-3 w-[80%]">
                      <div className="w-[30%]">
                        <Image
                          src={item.image}
                          alt={item.title}
                          width={100}
                          height={100}
                          className="h-24 sm:h-25 md:26 w-full rounded-md object-cover"
                        />
                      </div>
                      <div className="flex flex-col gap-2 w-[70%]">
                        <h4 className="truncate font-semibold">{item.title}</h4>
                        <p>
                          Qty: <span className="font-semibold">{item.quantity}</span>
                        </p>
                      </div>
                    </div>
                    <div className="w-[20%] text-right">
                      <p className="font-semibold text-blue-500">
                        ${item.subtotal.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="px-5 flex items-center justify-between text-sm">
                <span>Subtotal ({itemCount} items)</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="px-5 flex items-center justify-between text-sm">
                <span>Shipping</span>
                <span>{shippingFee === 0 ? "Free" : `$${shippingFee.toFixed(2)}`}</span>
              </div>
              {subtotal > 0 && (
                <div className="px-5 flex items-center justify-between text-sm text-gray-400">
                  <span>Free shipping on orders over $100</span>
                  <span />
                </div>
              )}

              <div className="px-5 py-3 border-t border-gray-200 flex items-center justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-blue-500">${total.toFixed(2)}</span>
              </div>

              <div className="px-5 py-3 text-center w-full">
                <Button
                  variant="contained"
                  className="w-full py-3! font-bold!"
                  disabled={submitting || !selectedAddressId}
                  onClick={placeOrder}
                >
                  {submitting ? "Placing Order..." : "Place Order"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </section>
  )
}

export default CheckoutPage
