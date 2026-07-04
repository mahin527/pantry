import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/products", "/product/", "/cart", "/login", "/register"],
        disallow: ["/admin/", "/api/", "/my-account/", "/my-orders/", "/address/", "/checkout/", "/wishlist/"],
      },
    ],
    sitemap: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/sitemap.xml`,
  }
}
