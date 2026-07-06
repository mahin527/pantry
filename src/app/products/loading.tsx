import { Skeleton } from "@mui/material"

export default function ProductsLoading() {
  return (
    <section className="py-4 bg-gray-50">
      <div className="container py-4 flex flex-col lg:flex-row gap-6">
        <div className="sidebar-wrapper w-full lg:w-[20%]">
          <div className="space-y-4">
            <Skeleton variant="rectangular" height={30} width="80%" />
            <Skeleton variant="rectangular" height={200} width="100%" />
            <Skeleton variant="rectangular" height={100} width="100%" />
            <Skeleton variant="rectangular" height={150} width="100%" />
          </div>
        </div>
        <div className="product-wrapper w-full lg:w-[80%]">
          <Skeleton variant="rectangular" height={56} className="rounded-md mb-6" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton variant="rectangular" height={200} className="rounded-md" />
                <Skeleton variant="text" width="80%" />
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="text" width="40%" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
