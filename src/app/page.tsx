import { fetchApi } from "@/lib/fetch-api"
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

type ProductData = {
  products: Product[]
  pagination: { total: number; page: number; totalPages: number }
}

export default async function Home() {
  const [categories, featured, popular, latest] = await Promise.all([
    fetchApi<Category[]>("/api/categories"),
    fetchApi<ProductData>("/api/products?featured=true&limit=10").then((d) => d?.products ?? null),
    fetchApi<ProductData>("/api/products?popular=true&limit=10").then((d) => d?.products ?? null),
    fetchApi<ProductData>("/api/products?latest=true&limit=10").then((d) => d?.products ?? null),
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
