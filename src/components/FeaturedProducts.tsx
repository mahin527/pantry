"use client"

import ProductSlider from './ProductSlider';
import { FaArrowRightLong } from "react-icons/fa6";
import Link from 'next/link';

type ProductItem = {
  _id: string
  title: string
  slug: string
  price: number
  discountPrice?: number
  images: string[]
  rating: number
  brand?: string
}

function FeaturedProducts({ products }: { products?: ProductItem[] }) {
  if (products && products.length === 0) return null

  return (
    <section className="py-6">
      <div className='bg-gray-100 rounded-md'> {/* dark:bg-black */}
        <div className='container'>
          <div className="py-4 space-y-2 flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-wider">
              Featured Products
            </h2>
            <Link href={"/products"} className='flex items-center gap-1 font-bold hover:text-blue-500 transition duration-150'>
              View all
              <FaArrowRightLong />
            </Link>
          </div>
        </div>
        <ProductSlider products={products} sectionId="featured" />
      </div>
    </section>
  )
}

export default FeaturedProducts
