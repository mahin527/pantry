import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Products",
  description: "Browse our wide selection of fresh groceries including fruits, vegetables, meats, dairy, bakery, and beverages.",
}

export default function ProductsLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <>{children}</>
}
