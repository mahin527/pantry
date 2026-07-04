"use client"

import dynamic from "next/dynamic"

const HomeSlider = dynamic(() => import("@/components/HomeSlider"), {
  ssr: false,
})

export default function HomeSliderWrapper() {
  return <HomeSlider />
}
