"use client"

import { Swiper, SwiperSlide } from "swiper/react"
import type { Swiper as SwiperType } from "swiper"
import "swiper/css"
import Image from "next/image"
import { useState } from "react"
import InnerImageZoom from "react-inner-image-zoom"
import "react-inner-image-zoom/lib/styles.min.css"

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
        className="BigSlider border border-gray-200 rounded-md p-4 overflow-hidden max-h-96"
      >
        {items.map((src, idx) => (
          <SwiperSlide key={idx}>
            <div className="w-full h-96 flex items-center justify-center overflow-hidden">
              <InnerImageZoom
                zoomType="click"
                zoomScale={1}
                src={src}
                zoomSrc={src}
                className="max-h-full max-w-full"
                imgAttributes={{ className: "max-h-full w-full object-contain" }}
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
