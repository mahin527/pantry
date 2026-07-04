import { headers } from "next/headers"
import Banners from "@/components/Banners"
import CategorySlider from "@/components/CategorySlider"
import FeaturedProducts from "@/components/FeaturedProducts"
import LatestProducts from "@/components/LatestProducts"
import PopularProducts from "@/components/PopularProducts"
import HomeSliderWrapper from "@/components/HomeSliderWrapper"

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

type ApiResponse<T> = {
  success: boolean
  data?: {
    categories?: T
    products?: T
    pagination?: Record<string, unknown>
  }
}

async function fetchApi<T>(path: string): Promise<T | null> {
  try {
    const host = (await headers()).get("host") || "localhost:3000"
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https"
    const res = await fetch(`${protocol}://${host}${path}`, {
      cache: "no-store",
    })
    if (!res.ok) return null
    const json: ApiResponse<T> = await res.json()
    if (!json.success) return null
    const data = json.data
    if (data && "products" in data) return data.products as T
    if (data && "categories" in data) return data.categories as T
    return data as unknown as T
  } catch {
    return null
  }
}

export default async function Home() {
  const [categories, featured, popular, latest] = await Promise.all([
    fetchApi<Category[]>("/api/categories"),
    fetchApi<Product[]>("/api/products?featured=true&limit=10"),
    fetchApi<Product[]>("/api/products?popular=true&limit=10"),
    fetchApi<Product[]>("/api/products?latest=true&limit=10"),
  ])

  return (
    <div className="sliderWrapper p-4">
      <HomeSliderWrapper />
      {categories && <CategorySlider categories={categories} />}
      {popular && <PopularProducts products={popular} />}
      <Banners />
      {latest && <LatestProducts products={latest} />}
      {featured && <FeaturedProducts products={featured} />}
    </div>
  )
}
