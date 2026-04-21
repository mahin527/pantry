"use client"
import { Swiper, SwiperSlide } from "swiper/react"
import type { Swiper as SwiperType } from "swiper"
import "swiper/css"
import Image from "next/image"

import potatoChips1 from "../../public/potato-chips-1.jpg"
import potatoChips2 from "../../public/potato-chips-1.jpg"
import { useState } from "react"

import InnerImageZoom from 'react-inner-image-zoom';
import 'react-inner-image-zoom/lib/styles.min.css';

function ProductImage() {
    const [slideIndex, setSlideIndex] = useState(0)

    const [bigSwiper, setBigSwiper] = useState<SwiperType | null>(null)
    const [smallSwiper, setSmallSwiper] = useState<SwiperType | null>(null)

    const goToslide = (index: number) => {
        setSlideIndex(index)
        smallSwiper?.slideTo(index)
        bigSwiper?.slideTo(index)
    }

    return (
        <div className="image-wrapper w-[30%] space-y-6">
            <Swiper onSwiper={setBigSwiper} className="BigSlider border border-gray-200 rounded-md p-4 overflow-hidden">
                <SwiperSlide>
                    <div className="w-full h-fit flex items-center justify-center">
                        <InnerImageZoom
                            zoomType="click"
                            zoomScale={1}
                            src={potatoChips1.src}
                            zoomSrc={potatoChips1.src}
                        />
                    </div>
                </SwiperSlide>

                <SwiperSlide>
                    <div className="w-full h-fit flex items-center justify-center">
                        <InnerImageZoom
                            zoomType="click"
                            zoomScale={1}
                            src={potatoChips2.src}
                            zoomSrc={potatoChips2.src}
                        />
                    </div>
                </SwiperSlide>

            </Swiper>

            <Swiper onSwiper={setSmallSwiper} className="SmallSlider p-3"
                slidesPerView={3}
                spaceBetween={10}
            >
                <SwiperSlide>
                    <div onClick={() => goToslide(0)} className={`item border ${slideIndex === 0 ? "border-gray-400" : "border-gray-200"} rounded-md overflow-hidden`}>
                        <Image src={potatoChips1} alt="potato chips 1" className="w-full" />
                    </div>
                </SwiperSlide>

                <SwiperSlide>
                    <div onClick={() => goToslide(1)} className={`item border ${slideIndex === 1 ? "border-gray-400" : "border-gray-200"} rounded-md overflow-hidden`}>
                        <Image src={potatoChips2} alt="potato chips 1" className="w-full" />
                    </div>
                </SwiperSlide>

            </Swiper>
        </div>
    )
}

export default ProductImage