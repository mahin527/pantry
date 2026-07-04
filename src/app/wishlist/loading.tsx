import { Skeleton } from "@mui/material"

export default function WishlistLoading() {
  return (
    <section className="bg-gray-100 py-8">
      <div className="container flex gap-5">
        <div className="w-[25%]">
          <Skeleton variant="rectangular" height={300} className="rounded-md" />
        </div>
        <div className="wrapper w-[75%] space-y-4">
          <Skeleton variant="rectangular" height={60} className="rounded-md" />
          <Skeleton variant="rectangular" height={120} className="rounded-md" />
          <Skeleton variant="rectangular" height={120} className="rounded-md" />
        </div>
      </div>
    </section>
  )
}
