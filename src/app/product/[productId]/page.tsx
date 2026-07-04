import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { fetchApi } from "@/lib/fetch-api"
import ProductDetailsComponents from "@/components/ProductDetailsComponents"

type Product = {
  _id: string
  title: string
  slug: string
  description: string
  shortDescription: string
  category: { _id: string; name: string; slug: string }
  images: string[]
  price: number
  discountPrice?: number
  stock: number
  brand?: string
  rating: number
  reviewCount: number
  tags: string[]
  isFeatured: boolean
  isPopular: boolean
  isLatest: boolean
  isActive: boolean
}

type ProductsData = {
  products: Product[]
  pagination: { total: number; page: number; totalPages: number }
}

type Props = {
  params: Promise<{ productId: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params).productId
  const product = await fetchApi<Product>(`/api/products/${slug}`)

  if (!product) {
    return { title: "Product Not Found | Pantry" }
  }

  return {
    title: `${product.title} | Pantry`,
    description:
      product.shortDescription || product.description.slice(0, 150),
  }
}

export default async function ProductDetailsPage({ params }: Props) {
  const slug = (await params).productId

  const product = await fetchApi<Product>(`/api/products/${slug}`)
  if (!product) notFound()

  const relatedRaw = await fetchApi<ProductsData>(
    `/api/products?category=${product.category._id}&limit=8`,
  )
  const related =
    relatedRaw?.products.filter((p) => p._id !== product._id) ?? []

  return (
    <section className="py-6">
      <div className="container">
        <ProductDetailsComponents product={product} relatedProducts={related} />
      </div>
    </section>
  )
}
