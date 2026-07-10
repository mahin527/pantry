"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"
import { Button } from "@mui/material"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import { useState } from "react"

const sortOptions = [
  { label: "Name, A TO Z", value: "title-asc" },
  { label: "Name, Z TO A", value: "title-desc" },
  { label: "Price, Low To High", value: "price-asc" },
  { label: "Price, High To Low", value: "price-desc" },
  { label: "Newest First", value: "createdAt-desc" },
  { label: "Oldest First", value: "createdAt-asc" },
]

export function ProductsToolbar({ total, sort }: { total: number; sort: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const currentLabel = sortOptions.find((o) => o.value === sort)?.label || "Newest First"

  const navigate = useCallback(
    (params: Record<string, string>) => {
      const sp = new URLSearchParams(searchParams.toString())
      Object.entries(params).forEach(([k, v]) => {
        if (v) sp.set(k, v)
        else sp.delete(k)
      })
      sp.set("page", "1")
      router.push(`/products?${sp.toString()}`)
    },
    [router, searchParams],
  )

  return (
    <div className="top-strip sticky top-5 z-10 w-full bg-white shadow-md flex items-center justify-between py-3 lg:py-4 xl:py-5 px-6 rounded-md">
      <p className="font-bold">
        There are {total} product{total !== 1 ? "s" : ""}
      </p>
      <div className="flex flex-col md:flex-row items-center gap-3">
        <p className="font-bold">Sort By</p>
        <div className="relative">
          <Button
            variant="outlined"
            className="font-bold!"
            id="sort-button"
            aria-controls={open ? "sort-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={(e) => setAnchorEl(e.currentTarget)}
          >
            {currentLabel}
          </Button>
          <Menu
            id="sort-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={() => setAnchorEl(null)}
            slotProps={{
              paper: { sx: { color: "#57585b" } },
              list: { "aria-labelledby": "sort-button" },
            }}
          >
            {sortOptions.map((opt) => (
              <MenuItem
                key={opt.value}
                onClick={() => {
                  setAnchorEl(null)
                  navigate({ sort: opt.value })
                }}
              >
                {opt.label}
              </MenuItem>
            ))}
          </Menu>
        </div>
      </div>
    </div>
  )
}
