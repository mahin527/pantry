type ProductJsonLdProps = {
  title: string
  description: string
  price: number
  image: string
  slug: string
  brand?: string
  rating?: number
  reviewCount?: number
  availability?: boolean
}

export function ProductJsonLd({
  title,
  description,
  price,
  image,
  slug,
  brand,
  rating,
  reviewCount,
  availability = true,
}: ProductJsonLdProps) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: title,
    description,
    image,
    url: `${baseUrl}/product/${slug}`,
    ...(brand && { brand: { "@type": "Brand", name: brand } }),
    offers: {
      "@type": "Offer",
      price,
      priceCurrency: "USD",
      availability: availability
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
    ...(rating &&
      reviewCount !== undefined && {
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: rating,
          reviewCount,
        },
      }),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
