"use client"
import Banners from "@/components/Banners";
import CategorySlider from "@/components/CategorySlider";
import FeaturedProducts from "@/components/FeaturedProducts";
import LatestProducts from "@/components/LatestProducts";
import PopularProducts from "@/components/PopularProducts";
import dynamic from "next/dynamic"


export default function Home() {
  const HomeSlider = dynamic(() => import("@/components/HomeSlider"), {
    ssr: false,
  })
  return (
    <div className="sliderWrapper p-4">
      <HomeSlider />
      <CategorySlider />
      <PopularProducts />
      <Banners />
      <LatestProducts />
      <FeaturedProducts />
    </div>
  );
}
