"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { Button, Chip, CircularProgress } from "@mui/material"
import { formatPrice, formatDate } from "@/lib/utils"
import { STATUS_COLORS } from "@/constants"
import { IoArrowBack } from "react-icons/io5"
import { toast } from "sonner"

type OrderItem = {
  product: string
  title: string
  quantity: number
  price: number
  image: string
}

type ShippingAddress = {
  fullName: string
  phone: string
  country: string
  city: string
  area: string
  street: string
  postalCode: string
  label: string
}

type Order = {
  _id: string
  items: OrderItem[]
  shippingAddress: ShippingAddress
  subtotal: number
  shippingFee: number
  discount: number
  total: number
  paymentMethod: string
  paymentStatus: string
  orderStatus: string
  createdAt: string
}

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.orderId as string

  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/orders/${orderId}`, { credentials: "include" })
      .then(async (res) => {
        if (res.status === 401 || res.status === 403) {
          router.push("/login")
          return null
        }
        const json = await res.json()
        if (json.success && json.data) {
          setOrder(json.data)
        } else {
          toast.error(json.message || "Order not found")
          router.push("/my-orders")
        }
        return null
      })
      .catch(() => {
        toast.error("Failed to load order")
        router.push("/my-orders")
      })
      .finally(() => setLoading(false))
  }, [orderId, router])

  if (loading) {
    return (
      <section className="py-10 bg-gray-100 min-h-screen flex items-center justify-center">
        <CircularProgress />
      </section>
    )
  }

  if (!order) return null

  return (
    <section className="py-10 bg-gray-100 min-h-screen">
      <div className="container">
        <Button
          variant="text"
          onClick={() => router.push("/my-orders")}
          className="mb-4 font-bold! flex! items-center! gap-2!"
          startIcon={<IoArrowBack />}
        >
          Back to My Orders
        </Button>

        <div className="bg-white rounded-md border border-gray-200 p-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-4">
            <div>
              <h1 className="text-xl font-bold text-gray-700">Order #{order._id.slice(-8).toUpperCase()}</h1>
              <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
            </div>
            <div className="flex items-center gap-2">
              <Chip
                label={order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                color={STATUS_COLORS[order.orderStatus] ?? "default"}
                size="small"
              />
              <Chip
                label={order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                color={STATUS_COLORS[order.paymentStatus] ?? "default"}
                variant="outlined"
                size="small"
              />
            </div>
          </div>

          {/* Shipping Address */}
          <div>
            <h3 className="font-bold text-gray-700 mb-2">Shipping Address</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p className="font-semibold">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.street}</p>
              <p>{[order.shippingAddress.city, order.shippingAddress.area, order.shippingAddress.country].filter(Boolean).join(", ")}</p>
              <p>{order.shippingAddress.postalCode}</p>
              <p>{order.shippingAddress.phone}</p>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="font-bold text-gray-700 mb-3">Order Items</h3>
            <div className="space-y-3">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-3 border border-gray-100 rounded-md">
                  <Image
                    src={item.image || "/placeholder.png"}
                    alt={item.title}
                    width={80}
                    height={80}
                    className="h-20 w-20 rounded-md object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-700 truncate">{item.title}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    <p className="text-sm text-gray-500">{formatPrice(item.price)} each</p>
                  </div>
                  <p className="font-semibold text-blue-500 whitespace-nowrap">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="border-t border-gray-200 pt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium">{order.shippingFee === 0 ? "Free" : formatPrice(order.shippingFee)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Discount</span>
                <span className="font-medium text-green-600">-{formatPrice(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2">
              <span>Total</span>
              <span className="text-blue-500">{formatPrice(order.total)}</span>
            </div>
          </div>

          {/* Payment Method */}
          <div className="border-t border-gray-200 pt-4">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Payment Method:</span> {order.paymentMethod.toUpperCase()}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}