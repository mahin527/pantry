"use client"

import dynamic from "next/dynamic"

const HeroSlider = dynamic(() => import("@/components/HeroSlider"), {
  ssr: false,
})

export default function HomeSliderWrapper() {
  return <HeroSlider />
}
