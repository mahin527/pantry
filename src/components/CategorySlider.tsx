"use client"

import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/navigation"
import Image from "next/image"
import Link from "next/link"

type Category = {
  _id: string
  name: string
  slug: string
  image: string
}

function CategorySlider({ categories }: { categories: Category[] }) {
  if (categories.length === 0) return null

  return (
    <div className='py-3 md:py-6 bg-gray-100 rounded-md'>
      <div className='container'>
        <Swiper
          spaceBetween={12}
          breakpoints={{
            320: { slidesPerView: 4 },
            640: { slidesPerView: 6 },
            768: { slidesPerView: 8, spaceBetween: 20 },
            1024: { slidesPerView: 9, spaceBetween: 20 }
          }}
        >
          {categories.map((cat) => (
            <SwiperSlide key={cat._id}>
              <Link href={`/products?category=${cat._id}`} className="group">
                <div className="w-full h-20 md:h-25.5 lg:h-27.5 bg-white shadow-md p-2 md:p-3 rounded-md flex items-center justify-center transition duration-500 group-hover:bg-black/5">
                  <Image
                    src={cat.image || "/category-image1.png"}
                    alt={cat.name}
                    width={58}
                    height={58}
                    className="size-10 md:size-14 xl:size-16 object-contain transition duration-200 group-hover:scale-105"
                    sizes="(max-width: 640px) 25vw, (max-width: 768px) 12.5vw, 58px"
                  />
                </div>
                <h4 className="py-1 md:py-2 text-center text-[10px] md:text-sm lg:text-base font-bold group-hover:text-blue-500 transition-colors duration-150 truncate">{cat.name}</h4>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  )
}

export default CategorySlider
