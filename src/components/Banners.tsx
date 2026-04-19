"use client"

import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import Image from "next/image"
import bannerImage from "../../public/banner-1.png"
import Link from "next/link"

function Banners() {
    const banners = [1, 2, 3]
    return (
        <section className="container py-4">

            <Swiper
                spaceBetween={10}
                modules={[Navigation]}
                navigation={true}
                breakpoints={{
                    480: { slidesPerView: 1 },
                    640: { slidesPerView: 2 },
                    1024: { slidesPerView: 3 },
                }}
                className="mySwiper">

                {banners.map((item) => (
                    <SwiperSlide key={item}>
                        <div className="item flex items-center justify-center">
                            {/* TODO: Create banner */}
                            <Link href={"/"}>
                                <Image src={bannerImage} alt="banner" className="rounded-md" />
                            </Link>
                        </div>
                    </SwiperSlide>
                ))}

            </Swiper>

        </section>
    )
}

export default Banners