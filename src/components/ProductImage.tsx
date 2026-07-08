"use client"

import { Swiper, SwiperSlide } from "swiper/react"
import type { Swiper as SwiperType } from "swiper"
import "swiper/css"
import Image from "next/image"
import { useState } from "react"

function ProductImage({ images, title }: { images: string[]; title: string }) {
  const [slideIndex, setSlideIndex] = useState(0)
  const [bigSwiper, setBigSwiper] = useState<SwiperType | null>(null)
  const [smallSwiper, setSmallSwiper] = useState<SwiperType | null>(null)

  const items = images.length > 0 ? images : ["/potato-chips-1.jpg"]

  const goToSlide = (index: number) => {
    setSlideIndex(index)
    smallSwiper?.slideTo(index)
    bigSwiper?.slideTo(index)
  }

  return (
    <div className="image-wrapper w-full md:w-[40%] space-y-6">
      <Swiper
        onSwiper={setBigSwiper}
        className="BigSlider border border-gray-200 rounded-md p-4"
      >
        {items.map((src, idx) => (
          <SwiperSlide key={idx}>
            <div className="relative w-full aspect-square bg-gray-50 rounded-md">
              <Image
                src={src}
                alt={`${title} ${idx + 1}`}
                fill
                className="object-cover p-2"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={idx === 0}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <Swiper
        onSwiper={setSmallSwiper}
        className="SmallSlider p-3"
        slidesPerView={3}
        spaceBetween={10}
      >
        {items.map((src, idx) => (
          <SwiperSlide key={idx}>
            <div
              onClick={() => goToSlide(idx)}
              className={`item border ${slideIndex === idx ? "border-gray-400" : "border-gray-200"
                } rounded-md overflow-hidden`}
            >
              <Image src={src} alt={`${title} ${idx + 1}`} className="w-full h-20 object-cover" width={100} height={100} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default ProductImage
