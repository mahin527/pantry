"use client"

// import { useRef, useState } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
// import { Navigation } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import Image from "next/image"
import Img1 from "../../public/category-image1.png"
import Img2 from "../../public/category-image2.png"
import Img3 from "../../public/category-image3.png"
import Img4 from "../../public/category-image4.png"
import Img5 from "../../public/category-image5.png"
import Img6 from "../../public/category-image6.png"
import Img7 from "../../public/category-image7.png"
import Img8 from "../../public/category-image8.png"
import Img9 from "../../public/category-image9.png"
import Img10 from "../../public/category-image10.png"
import Link from "next/link"


function CategorySlider() {
  const categoryImages = [
    { id: 1, image: Img1, title: "Fruits & Vegetables" },
    { id: 2, image: Img2, title: "Meats & Seafood" },
    { id: 3, image: Img3, title: "Breaksfast & Dairy" },
    { id: 4, image: Img4, title: "Breads & Bakery" },
    { id: 5, image: Img5, title: "Beverages" },
    { id: 6, image: Img6, title: "Frozen Foods" },
    { id: 7, image: Img7, title: "Biscuits & Snacks" },
    { id: 8, image: Img8, title: "Grocery & Staples" },
    { id: 9, image: Img9, title: "Baby & Pregnancy" },
    { id: 10, image: Img10, title: "Healthcare" }
  ]
  return (
    <div className='py-6 bg-gray-100 dark:bg-black rounded-md'>
      <div className='container'>
        <Swiper
          spaceBetween={20}
          // modules={[Navigation]}
          // navigation={true}
          breakpoints={{
            320: { slidesPerView: 4 },
            640: { slidesPerView: 6 },
            768: { slidesPerView: 8 },
            1024: { slidesPerView: 9 }
          }}
        >
          {categoryImages.map((item) => (
            <SwiperSlide key={item.id}>
              <Link href={"/"} className="group">
                <div className="w-full h-25.5 lg:h-27.5 bg-white dark:bg-white/5 shadow-md p-3 rounded-md flex items-center justify-center transition duration-500 group-hover:bg-black/5 dark:group-hover:bg-white/10">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={58}
                    height={58}
                    className="size-14 xl:size-16 object-contain transition duration-200 group-hover:scale-105"
                  />
                </div>
                <h4 className="py-2 text-center text-sm lg:text-base font-bold group-hover:text-blue-500 dark:group-hover:text-blue-400  transition-colors duration-150">{item.title}</h4>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  )
}

export default CategorySlider