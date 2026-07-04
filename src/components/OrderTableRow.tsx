"use client"

import { useState } from "react"
import Image from "next/image"
import { FaAngleDown } from "react-icons/fa6"
import IconButton from "@mui/material/IconButton"
import Chip from "@mui/material/Chip"

type OrderItem = {
  product: { _id: string; title: string; slug: string; price: number; images: string[]; brand?: string }
  title: string
  quantity: number
  price: number
  image: string
}

type Order = {
  _id: string
  items: OrderItem[]
  total: number
  paymentStatus: string
  orderStatus: string
  createdAt: string
}

const statusColor: Record<string, "warning" | "success" | "error" | "info" | "default"> = {
  pending: "warning",
  paid: "success",
  failed: "error",
  refunded: "info",
  confirmed: "info",
  processing: "info",
  shipped: "info",
  delivered: "success",
  cancelled: "error",
}

function OrderTableRow({ order }: { order: Order }) {
  const [expandIndex, setExpandIndex] = useState(false)

  const date = new Date(order.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })

  return (
    <>
      <tr className="border-b border-gray-200 hover:bg-blue-100">
        <td>
          <div className="py-4">
            <IconButton
              size="large"
              className="bg-gray-100 shadow-md"
              onClick={() => setExpandIndex(!expandIndex)}
              aria-label={expandIndex ? "Collapse" : "Expand"}
              aria-expanded={expandIndex}
            >
              <FaAngleDown
                size={24}
                className={`transition-transform duration-200 ease-in-out ${expandIndex && "rotate-180"}`}
              />
            </IconButton>
          </div>
        </td>
        <td className="px-3 h-8 whitespace-nowrap border-x border-gray-200 font-medium">
          #{order._id.slice(-8).toUpperCase()}
        </td>
        <td className="px-3 h-8 whitespace-nowrap border-r border-gray-200">
          {order.items.length} item{order.items.length !== 1 ? "s" : ""}
        </td>
        <td className="px-3 h-8 whitespace-nowrap border-r border-gray-200 font-semibold text-blue-600">
          ${order.total.toFixed(2)}
        </td>
        <td className="px-3 h-8 whitespace-nowrap border-r border-gray-200">
          <Chip
            label={order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
            size="small"
            color={statusColor[order.paymentStatus] ?? "default"}
            variant="outlined"
          />
        </td>
        <td className="px-3 h-8 whitespace-nowrap border-r border-gray-200">
          <Chip
            label={order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
            size="small"
            color={statusColor[order.orderStatus] ?? "default"}
          />
        </td>
        <td className="px-3 h-8 whitespace-nowrap border-r border-gray-200">{date}</td>
      </tr>

      {expandIndex &&
        order.items.map((item, index) => (
          <tr key={index} className="hover:bg-blue-100">
            <td></td>
            <td colSpan={1} className="p-3 border-l border-gray-200">
              <div className="flex items-center justify-center">
                <Image
                  src={item.image || item.product?.images?.[0] || "/potato-chips-1.jpg"}
                  alt={item.title}
                  height={100}
                  width={100}
                  className="h-24 w-20 xl:h-30 xl:w-24 rounded-sm object-cover"
                />
              </div>
            </td>
            <td colSpan={3}>
              <div className="space-y-2">
                <p className="font-bold text-base md:text-lg">{item.title}</p>
                <p className="font-semibold">
                  Unit Price: <span>${item.price.toFixed(2)}</span>
                </p>
                <p className="font-semibold">
                  Quantity: <span>{item.quantity}</span>
                </p>
              </div>
            </td>
            <td className="font-semibold text-base">
              ${(item.price * item.quantity).toFixed(2)}
            </td>
            <td></td>
          </tr>
        ))}
    </>
  )
}

export default OrderTableRow
