import { fetchApi } from "@/lib/fetch-api"
import Sidebar from "@/components/Sidebar"
import ProductItems from "@/components/ProductItems"
import { ProductsPagination } from "./ProductsPagination"
import { ProductsToolbar } from "./ProductsToolbar"

type Category = {
  _id: string
  name: string
  slug: string
  image: string
}

type Product = {
  _id: string
  title: string
  slug: string
  price: number
  discountPrice?: number
  images: string[]
  rating: number
  brand?: string
}

type ProductsData = {
  products: Product[]
  pagination: { total: number; page: number; limit: number; totalPages: number }
}

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

const sortMap: Record<string, { field: string; order: string }> = {
  "title-asc": { field: "title", order: "asc" },
  "title-desc": { field: "title", order: "desc" },
  "price-asc": { field: "price", order: "asc" },
  "price-desc": { field: "price", order: "desc" },
  "createdAt-asc": { field: "createdAt", order: "asc" },
  "createdAt-desc": { field: "createdAt", order: "desc" },
}

export default async function ProductsPage({ searchParams }: Props) {
  const sp = await searchParams

  const page = typeof sp.page === "string" ? sp.page : "1"
  const search = typeof sp.search === "string" ? sp.search : ""
  const category = typeof sp.category === "string" ? sp.category : ""
  const minPrice = typeof sp.minPrice === "string" ? sp.minPrice : ""
  const maxPrice = typeof sp.maxPrice === "string" ? sp.maxPrice : ""
  const sort = typeof sp.sort === "string" ? sp.sort : "createdAt-desc"
  const featured = typeof sp.featured === "string" ? sp.featured : ""
  const popular = typeof sp.popular === "string" ? sp.popular : ""
  const latest = typeof sp.latest === "string" ? sp.latest : ""
  const rating = typeof sp.rating === "string" ? sp.rating : ""

  const params = new URLSearchParams()
  params.set("page", page)
  params.set("limit", "20")
  if (search) params.set("search", search)
  if (category) params.set("category", category)
  if (minPrice) params.set("minPrice", minPrice)
  if (maxPrice) params.set("maxPrice", maxPrice)
  if (featured) params.set("featured", featured)
  if (popular) params.set("popular", popular)
  if (latest) params.set("latest", latest)
  if (rating) params.set("rating", rating)

  const sortOption = sortMap[sort] || sortMap["createdAt-desc"]
  params.set("sort", sortOption.field)
  params.set("order", sortOption.order)

  const [productsData, categories] = await Promise.all([
    fetchApi<ProductsData>(`/api/products?${params.toString()}`),
    fetchApi<Category[]>("/api/categories"),
  ])

  const products = productsData?.products ?? []
  const pagination = productsData?.pagination
  const total = pagination?.total ?? 0

  return (
    <section className="py-4 bg-gray-50">
      <div className="container py-4 flex flex-col lg:flex-row gap-6">
        <div className="sidebar-wrapper w-full lg:w-[20%]">
          <Sidebar
            key={`${minPrice}-${maxPrice}-${category}`}
            categories={categories ?? []}
            selectedCategory={category}
            minPrice={minPrice}
            maxPrice={maxPrice}
          />
        </div>
        <div className="product-wrapper w-full lg:w-[80%] tracking-wider text-gray-600">
          <ProductsToolbar total={total} sort={sort} />

          {products.length === 0 ? (
            <div className="py-16 px-5 text-center">
              <p className="text-lg font-bold text-gray-500">
                {search ? `No products found for "${search}"` : "No products found"}
              </p>
              <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or search terms.</p>
            </div>
          ) : (
            <div className="py-6 px-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-5">
              {products.map((product) => (
                <ProductItems key={product._id} product={product} />
              ))}
            </div>
          )}

          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center pb-8">
              <ProductsPagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
