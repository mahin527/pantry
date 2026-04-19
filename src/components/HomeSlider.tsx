"use client"

// import { useRef, useState } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Autoplay } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import Image from "next/image"
import sliderImage1 from "../../public/home_slider1.png"
import sliderImage2 from "../../public/home_slider2.png"

// TODO: swiper buttons (next & prev) customize

function HomeSlider() {
    return (
        <div className="homeSlider container py-2">
            <Swiper navigation={true}
                modules={[Navigation, Autoplay]}
                autoplay={{
                    delay: 2500,
                    disableOnInteraction: false
                }}
                className="mySwiper">
                <SwiperSlide>
                    <div className="item">
                        <Image src={sliderImage1} alt="slider image" className="w-full h-auto" />
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="item">
                        <Image src={sliderImage2} alt="slider image" className="w-full h-auto rounded-xl" />
                    {/* TODO: Create banner */}
                    </div>
                </SwiperSlide>
            </Swiper>
        </div>
    )
}

export default HomeSlider