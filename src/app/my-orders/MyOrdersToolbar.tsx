"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material"

const statusOptions = [
  { label: "All", value: "" },
  { label: "Pending", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Processing", value: "processing" },
  { label: "Shipped", value: "shipped" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
]

export function MyOrdersToolbar({ currentStatus }: { currentStatus: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  return (
    <FormControl size="small" sx={{ minWidth: 140 }}>
      <InputLabel>Status</InputLabel>
      <Select
        value={currentStatus}
        label="Status"
        onChange={(e) => {
          const sp = new URLSearchParams(searchParams.toString())
          if (e.target.value) sp.set("status", e.target.value)
          else sp.delete("status")
          sp.set("page", "1")
          router.push(`/my-orders?${sp.toString()}`)
        }}
      >
        {statusOptions.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
