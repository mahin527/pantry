"use client"

import { useState } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Pagination } from "swiper/modules"
import "swiper/css"
import "swiper/css/pagination"
import Image from "next/image"
import Link from "next/link"
import { FaArrowRight } from "react-icons/fa6"

export type HeroSlide = {
  id: number
  title: string
  subtitle: string
  description: string
  buttonText: string
  buttonLink: string
  image: string
  gradientFrom: string
  gradientTo: string
  accent: string
  badge?: string
}

const defaultSlides: HeroSlide[] = [
  {
    id: 1,
    title: "Fresh Groceries\nDelivered to Your Door",
    subtitle: "Farm Fresh Quality",
    description: "Shop from 10,000+ fresh products with same-day delivery. Free shipping on orders over $100.",
    buttonText: "Shop Now",
    buttonLink: "/products",
    image: "/home_slider1.png",
    gradientFrom: "from-blue-50",
    gradientTo: "to-indigo-100",
    accent: "blue",
    badge: "Free delivery on $100+",
  },
  {
    id: 2,
    title: "Season's Best\nFarm Fresh Produce",
    subtitle: "This Week Only",
    description: "Get up to 30% off on seasonal fruits and vegetables. Handpicked and delivered fresh.",
    buttonText: "Explore Deals",
    buttonLink: "/products?category=fruits-vegetables",
    image: "/home_slider2.png",
    gradientFrom: "from-emerald-50",
    gradientTo: "to-teal-100",
    accent: "emerald",
    badge: "Up to 30% OFF",
  },
]

function HeroSlideContent({ slide, isActive }: { slide: HeroSlide; isActive: boolean }) {
  const accentMap: Record<string, string> = {
    blue: "bg-blue-600 text-white hover:bg-blue-700",
    emerald: "bg-emerald-600 text-white hover:bg-emerald-700",
  }

  return (
    <div
      className={`relative overflow-hidden rounded-xl md:rounded-2xl bg-linear-to-br ${slide.gradientFrom} ${slide.gradientTo} transition-all duration-700 ${isActive ? "opacity-100" : "opacity-0"
        }`}
    >
      <div className="relative z-10 flex flex-col md:flex-row items-center px-6 md:px-12 lg:px-16 py-8 md:py-12 lg:py-16 min-h-[300px] md:min-h-[400px]">
        {/* Left content */}
        <div className="w-full md:w-1/2 space-y-4 md:space-y-5 text-center md:text-left">
          {slide.badge && (
            <span className="inline-block bg-white/80 backdrop-blur-sm text-sm font-bold px-4 py-1.5 rounded-full shadow-sm">
              {slide.badge}
            </span>
          )}
          <p className="text-sm md:text-base font-semibold uppercase tracking-widest text-gray-500">
            {slide.subtitle}
          </p>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-gray-900 leading-tight whitespace-pre-line">
            {slide.title}
          </h2>
          <p className="text-sm md:text-base lg:text-lg text-gray-600 max-w-md leading-relaxed">
            {slide.description}
          </p>
          <Link
            href={slide.buttonLink}
            className={`inline-flex items-center gap-2 px-6 py-3 md:px-7 md:py-3 rounded-xl font-bold text-xs md:text-sm transition-all duration-200 shadow-lg hover:shadow-xl ${accentMap[slide.accent] || accentMap.blue
              }`}
          >
            {slide.buttonText}
            <FaArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Right image */}
        <div className="w-full md:w-1/2 mt-6 md:mt-0 flex items-center justify-center">
          <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-80 lg:h-80">
            <div
              className={`absolute inset-0 rounded-full bg-linear-to-br ${slide.gradientFrom} ${slide.gradientTo} opacity-40 blur-3xl`}
            />
            <Image
              src={slide.image}
              alt={slide.title.replace("\n", " ")}
              width={380}
              height={380}
              className="relative z-10 w-full h-full object-contain drop-shadow-2xl"
              priority={isActive}
            />
          </div>
        </div>
      </div>

      {/* Decorative shapes */}
      <div className="absolute top-10 right-1/4 w-32 h-32 rounded-full bg-white/20 blur-xl hidden md:block" />
      <div className="absolute bottom-10 left-1/3 w-24 h-24 rounded-full bg-white/20 blur-lg hidden md:block" />
    </div>
  )
}

function HeroSlider({ slides = defaultSlides }: { slides?: HeroSlide[] }) {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <div className="container py-2 md:py-4">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        className="hero-swiper"
      >
        {slides.map((slide, idx) => (
          <SwiperSlide key={slide.id}>
            <HeroSlideContent slide={slide} isActive={idx === activeIndex} />
          </SwiperSlide>
        ))}
      </Swiper>

      <style jsx global>{`
        .hero-swiper .swiper-pagination-bullet {
          width: 10px;
          height: 10px;
          background: #94a3b8;
          opacity: 0.5;
        }
        .hero-swiper .swiper-pagination-bullet-active {
          background: #2563eb;
          opacity: 1;
          width: 28px;
          border-radius: 5px;
        }
      `}</style>
    </div>
  )
}

export default HeroSlider
