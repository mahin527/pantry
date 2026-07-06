"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"

type Props = {
  id: string
  className?: string
}

export function SwiperNavigation({ id, className = "" }: Props) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        id={`swiper-prev-${id}`}
        className="swiper-nav-prev flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-full bg-white border border-gray-200 shadow-sm text-gray-600 hover:text-blue-600 hover:border-blue-300 hover:shadow-md hover:scale-105 active:scale-95 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-sm disabled:hover:text-gray-600 disabled:hover:border-gray-200"
        aria-label="Previous slide"
        tabIndex={0}
      >
        <ChevronLeft size={18} className="md:size-5" />
      </button>
      <button
        id={`swiper-next-${id}`}
        className="swiper-nav-next flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-full bg-white border border-gray-200 shadow-sm text-gray-600 hover:text-blue-600 hover:border-blue-300 hover:shadow-md hover:scale-105 active:scale-95 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-sm disabled:hover:text-gray-600 disabled:hover:border-gray-200"
        aria-label="Next slide"
        tabIndex={0}
      >
        <ChevronRight size={18} className="md:size-5" />
      </button>
    </div>
  )
}
