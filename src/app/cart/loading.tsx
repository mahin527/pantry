import { Skeleton } from "@mui/material"

export default function CartLoading() {
  return (
    <section className="py-10 bg-gray-100">
      <div className="container flex justify-between gap-5">
        <div className="w-[75%] space-y-4">
          <Skeleton variant="rectangular" height={60} className="rounded-md" />
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} variant="rectangular" height={120} className="rounded-md" />
          ))}
        </div>
        <div className="w-[25%]">
          <Skeleton variant="rectangular" height={300} className="rounded-md" />
        </div>
      </div>
    </section>
  )
}
