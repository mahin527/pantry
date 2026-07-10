export type HeroSlide = {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  image: string;
  gradientFrom: string;
  gradientTo: string;
  accent: string;
  badge?: string;
};

export const defaultHeroSlides: HeroSlide[] = [
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
];
