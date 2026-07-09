"use client"

import dynamic from "next/dynamic"

const HeroSlider = dynamic(() => import("@/components/HeroSlider"), {
  ssr: false,
  loading: () => <div className="h-[400px] bg-gray-100 animate-pulse rounded-lg" />,
})

export default function HomeSliderWrapper() {
  return <HeroSlider />
}
