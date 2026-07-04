export function HomepageJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "GroceryStore",
    name: "Pantry",
    description: "Fresh grocery delivery service. Order fruits, vegetables, meats, dairy, bakery, beverages and snacks online.",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/products?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
