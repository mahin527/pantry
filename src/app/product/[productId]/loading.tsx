"use client"

import { Skeleton } from "@mui/material"

export default function ProductDetailLoading() {
  return (
    <section className="py-6">
      <div className="container">
        <div className="flex gap-10">
          <div className="w-[30%] space-y-6">
            <Skeleton variant="rectangular" height={400} className="rounded-md" />
            <div className="flex gap-2">
              <Skeleton variant="rectangular" width={80} height={80} />
              <Skeleton variant="rectangular" width={80} height={80} />
              <Skeleton variant="rectangular" width={80} height={80} />
            </div>
          </div>
          <div className="w-[70%] space-y-8 py-3">
            <Skeleton variant="text" width="80%" height={40} />
            <Skeleton variant="text" width="40%" height={30} />
            <Skeleton variant="text" width="30%" height={36} />
            <Skeleton variant="rectangular" height={120} className="rounded-md" />
            <Skeleton variant="rectangular" height={48} width={200} className="rounded-md" />
          </div>
        </div>
      </div>
    </section>
  )
}
