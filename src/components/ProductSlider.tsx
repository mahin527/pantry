"use client"

import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import ProductItems from "./ProductItems"

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
      <Swiper
        spaceBetween={10}
        modules={[Navigation]}
        navigation={true}
        breakpoints={{
          320: { slidesPerView: 1 },
          480: { slidesPerView: 2 },
          640: { slidesPerView: 3 },
          768: { slidesPerView: 4 },
          1024: { slidesPerView: 5 },
          1280: { slidesPerView: 6 },
        }}
        className="mySwiper"
      >
        {items.map((item, index) => (
          <SwiperSlide key={typeof item === "object" ? item._id : index}>
            <div className="flex items-center justify-center">
              <ProductItems product={typeof item === "object" ? item : undefined} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default ProductSlider
