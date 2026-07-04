import ProductDetails from "./ProductDetails"
import ProductImage from "./ProductImage"
import ProductReviews from "./ProductReviews"
import RelatedProducts from "./RelatedProducts"

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

function ProductDetailsComponents({
  product,
  relatedProducts,
}: {
  product: Product
  relatedProducts: Product[]
}) {
  return (
    <div className="space-y-5">
      <div className="flex flex-col md:flex-row gap-6 md:gap-10">
        <ProductImage images={product.images} title={product.title} />
        <ProductDetails product={product} />
      </div>
      <ProductReviews reviewCount={product.reviewCount} />
      {relatedProducts.length > 0 && <RelatedProducts products={relatedProducts} />}
    </div>
  )
}

export default ProductDetailsComponents
