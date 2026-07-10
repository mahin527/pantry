"use client"

import { useRouter, useSearchParams } from "next/navigation"
import Pagination from "@mui/material/Pagination"

export function ProductsPagination({
  currentPage,
  totalPages,
}: {
  currentPage: number
  totalPages: number
}) {
  const router = useRouter()
  const searchParams = useSearchParams()

  return (
    <Pagination
      count={totalPages}
      page={currentPage}
      color="primary"
      aria-label="Products pagination"
      onChange={(_, page) => {
        const sp = new URLSearchParams(searchParams.toString())
        sp.set("page", String(page))
        router.push(`/products?${sp.toString()}`)
      }}
    />
  )
}
