import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import ProductItems from "./ProductItems"

function ProductSlider() {
    const products = [1, 2, 3, 4, 5, 6, 7, 8]

    return (
        <div className=" container py-4">
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
                className="mySwiper">

                {products.map((item) => (
                    <SwiperSlide key={item}>
                        <div className="flex items-center justify-center">
                        <ProductItems />
                        </div>
                    </SwiperSlide>
                ))}

            </Swiper>
        </div>
    )
}

export default ProductSlider