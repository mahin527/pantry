"use client"

import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation } from "swiper/modules"
import "swiper/css"
import ProductItems from "./ProductItems"
import { SwiperNavigation } from "@/components/ui/SwiperNavigation"

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

function ProductSlider({ products }: { products?: ProductItem[] }) {
  const items = products ?? [1, 2, 3, 4, 5, 6, 7, 8]

  if (Array.isArray(items) && items.length === 0) return null

  return (
    <div className="container py-4">
      <div className="relative">
        <Swiper
          spaceBetween={10}
          modules={[Navigation]}
          navigation={{
            prevEl: ".swiper-nav-prev",
            nextEl: ".swiper-nav-next",
          }}
          breakpoints={{
            320: { slidesPerView: 1 },
            480: { slidesPerView: 2 },
            640: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 5 },
            1280: { slidesPerView: 6 },
          }}
          className="!px-0"
        >
          {items.map((item, index) => (
            <SwiperSlide key={typeof item === "object" ? item._id : index}>
              <div className="flex items-center justify-center">
                <ProductItems product={typeof item === "object" ? item : undefined} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Navigation buttons positioned absolutely on desktop, below on mobile */}
        <div className="flex justify-center mt-4 md:absolute md:top-1/2 md:-translate-y-1/2 md:left-0 md:right-0 md:justify-between md:px-1 md:mt-0 md:pointer-events-none z-10">
          <div className="md:pointer-events-auto">
            <SwiperNavigation id="product-slider" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductSlider
