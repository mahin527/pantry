"use client"

import Image from "next/image"
import Link from "next/link"

type Category = {
  _id: string
  name: string
  slug: string
  image: string
}

function CategorySlider({ categories }: { categories: Category[] }) {
  if (categories.length === 0) return null

  return (
    <section className="py-4 md:py-8">
      <div className="container">
        <div className="flex items-center justify-between mb-3 md:mb-5">
          <h2 className="text-lg md:text-2xl font-bold text-gray-800">Browse Categories</h2>
          <Link
            href="/products"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            View All &rarr;
          </Link>
        </div>

        {/* Mobile: horizontal scroll */}
        <div className="flex md:hidden gap-3 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-none snap-x snap-mandatory">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              href={`/products?category=${cat._id}`}
              className="snap-start shrink-0 w-25 group"
            >
              <div className="w-full aspect-square bg-white border border-gray-100 rounded-xl shadow-sm p-3 flex items-center justify-center transition-all duration-200 group-hover:shadow-md group-hover:border-blue-200 group-hover:-translate-y-0.5">
                <Image
                  src={cat.image || "/category-image1.png"}
                  alt={cat.name}
                  width={56}
                  height={56}
                  className="w-12 h-12 object-contain transition-transform duration-200 group-hover:scale-110"
                />
              </div>
              <p className="mt-1.5 text-center text-[11px] font-semibold text-gray-600 group-hover:text-blue-600 transition-colors truncate">
                {cat.name}
              </p>
            </Link>
          ))}
        </div>

        {/* Desktop: responsive grid */}
        <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              href={`/products?category=${cat._id}`}
              className="group bg-white border border-gray-100 rounded-xl shadow-sm p-4 flex flex-col items-center text-center transition-all duration-200 hover:shadow-md hover:border-blue-200 hover:-translate-y-0.5"
            >
              <div className="w-16 h-16 lg:w-20 lg:h-20 flex items-center justify-center mb-2">
                <Image
                  src={cat.image || "/category-image1.png"}
                  alt={cat.name}
                  width={72}
                  height={72}
                  className="w-14 h-14 lg:w-16 lg:h-16 object-contain transition-transform duration-200 group-hover:scale-110"
                />
              </div>
              <h3 className="text-sm lg:text-base font-bold text-gray-700 group-hover:text-blue-600 transition-colors">
                {cat.name}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CategorySlider
