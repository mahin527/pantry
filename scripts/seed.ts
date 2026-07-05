// import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { Category, Product, User } from "../src/models";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("MONGODB_URI is required");
  process.exit(1);
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function generateSku(categoryPrefix: string, index: number): string {
  return `${categoryPrefix}-${String(index).padStart(3, "0")}`;
}

const categories = [
  {
    name: "Fruits & Vegetables",
    slug: "fruits-vegetables",
    image: "https://placehold.co/200x200?text=Fruits",
    description: "Fresh fruits and vegetables sourced daily",
    sortOrder: 1,
    isActive: true,
  },
  {
    name: "Meats & Seafood",
    slug: "meats-seafood",
    image: "https://placehold.co/200x200?text=Meats",
    description: "Premium cuts of meat and fresh seafood",
    sortOrder: 2,
    isActive: true,
  },
  {
    name: "Breakfast & Dairy",
    slug: "breakfast-dairy",
    image: "https://placehold.co/200x200?text=Dairy",
    description: "Dairy products and breakfast essentials",
    sortOrder: 3,
    isActive: true,
  },
  {
    name: "Breads & Bakery",
    slug: "breads-bakery",
    image: "https://placehold.co/200x200?text=Bakery",
    description: "Freshly baked breads and pastries",
    sortOrder: 4,
    isActive: true,
  },
  {
    name: "Beverages",
    slug: "beverages",
    image: "https://placehold.co/200x200?text=Drinks",
    description: "Refreshing drinks for every occasion",
    sortOrder: 5,
    isActive: true,
  },
  {
    name: "Snacks & Biscuits",
    slug: "snacks-biscuits",
    image: "https://placehold.co/200x200?text=Snacks",
    description: "Crisps, biscuits, and everything in between",
    sortOrder: 6,
    isActive: true,
  },
];

type ProductSeed = {
  title: string;
  categoryName: string;
  price: number;
  discountPrice?: number;
  stock: number;
  brand: string;
  description: string;
  shortDescription: string;
  tags: string[];
  isFeatured?: boolean;
  isPopular?: boolean;
  isLatest?: boolean;
};

const products: ProductSeed[] = [
  {
    title: "Organic Bananas (Bunch)",
    categoryName: "Fruits & Vegetables",
    price: 1.99,
    stock: 200,
    brand: "FreshFarm",
    description:
      "Naturally ripened organic bananas sourced from sustainable farms. Packed with potassium and essential nutrients for a healthy diet.",
    shortDescription: "Sweet and nutritious organic bananas",
    tags: ["organic", "fruit", "fresh"],
    isFeatured: true,
    isPopular: true,
    isLatest: false,
  },
  {
    title: "Fresh Avocados (Pack of 4)",
    categoryName: "Fruits & Vegetables",
    price: 4.49,
    discountPrice: 3.99,
    stock: 120,
    brand: "FreshFarm",
    description:
      "Ripe and creamy avocados perfect for salads, toast, or guacamole. Handpicked at peak ripeness.",
    shortDescription: "Ripe and creamy avocados",
    tags: ["fruit", "fresh", "salad"],
    isFeatured: true,
    isPopular: false,
    isLatest: true,
  },
  {
    title: "Baby Spinach (5 oz)",
    categoryName: "Fruits & Vegetables",
    price: 3.29,
    stock: 150,
    brand: "GreenLeaf",
    description:
      "Tender baby spinach leaves, pre-washed and ready to eat. Rich in iron and vitamins A and C.",
    shortDescription: "Pre-washed tender baby spinach",
    tags: ["salad", "green", "fresh"],
    isFeatured: false,
    isPopular: true,
    isLatest: false,
  },
  {
    title: "Fresh Chicken Breast (1 lb)",
    categoryName: "Meats & Seafood",
    price: 6.99,
    stock: 80,
    brand: "FarmFresh",
    description:
      "Boneless skinless chicken breast from free-range farms. High in protein and low in fat.",
    shortDescription: "Boneless skinless chicken breast",
    tags: ["meat", "protein", "fresh"],
    isFeatured: true,
    isPopular: true,
    isLatest: false,
  },
  {
    title: "Atlantic Salmon Fillet (8 oz)",
    categoryName: "Meats & Seafood",
    price: 9.99,
    stock: 60,
    brand: "OceanCatch",
    description:
      "Fresh Atlantic salmon fillet rich in omega-3 fatty acids. Sustainably sourced and flash-frozen.",
    shortDescription: "Omega-3 rich salmon fillet",
    tags: ["seafood", "fish", "protein"],
    isFeatured: false,
    isPopular: true,
    isLatest: true,
  },
  {
    title: "Ground Beef 85/15 (1 lb)",
    categoryName: "Meats & Seafood",
    price: 5.49,
    stock: 90,
    brand: "FarmFresh",
    description:
      "Premium ground beef with an 85/15 lean-to-fat ratio. Perfect for burgers, meatballs, and pasta sauces.",
    shortDescription: "Lean ground beef for everyday cooking",
    tags: ["meat", "beef", "protein"],
    isFeatured: false,
    isPopular: false,
    isLatest: false,
  },
  {
    title: "Whole Milk (1 Gallon)",
    categoryName: "Breakfast & Dairy",
    price: 3.99,
    stock: 100,
    brand: "DairyPure",
    description:
      "Fresh whole milk from pasture-raised cows. Rich, creamy, and packed with calcium and vitamin D.",
    shortDescription: "Fresh whole milk from pasture-raised cows",
    tags: ["dairy", "milk", "calcium"],
    isFeatured: false,
    isPopular: true,
    isLatest: false,
  },
  {
    title: "Greek Yogurt Plain (32 oz)",
    categoryName: "Breakfast & Dairy",
    price: 5.29,
    discountPrice: 4.49,
    stock: 75,
    brand: "DairyPure",
    description:
      "Thick and creamy plain Greek yogurt. Strained for extra protein. Perfect for smoothies, cooking, or on its own.",
    shortDescription: "High-protein strained Greek yogurt",
    tags: ["dairy", "yogurt", "protein"],
    isFeatured: true,
    isPopular: false,
    isLatest: false,
  },
  {
    title: "Free Range Eggs (Dozen)",
    categoryName: "Breakfast & Dairy",
    price: 4.79,
    stock: 130,
    brand: "HappyHen",
    description:
      "Farm-fresh free-range eggs from cage-free hens. Rich in protein and omega-3 fatty acids.",
    shortDescription: "Farm-fresh free-range eggs",
    tags: ["eggs", "protein", "breakfast"],
    isFeatured: true,
    isPopular: true,
    isLatest: false,
  },
  {
    title: "Almond Milk Unsweetened (Half Gallon)",
    categoryName: "Breakfast & Dairy",
    price: 3.49,
    stock: 90,
    brand: "NutMilk",
    description:
      "Creamy unsweetened almond milk. Dairy-free, lactose-free, and fortified with calcium and vitamin E.",
    shortDescription: "Dairy-free unsweetened almond milk",
    tags: ["dairy-free", "vegan", "milk"],
    isFeatured: false,
    isPopular: false,
    isLatest: true,
  },
  {
    title: "Sourdough Boule (16 oz)",
    categoryName: "Breads & Bakery",
    price: 4.99,
    stock: 40,
    brand: "BakeHouse",
    description:
      "Artisan sourdough bread made with a 20-year-old starter. Slow-fermented for 24 hours for the perfect crust and tangy flavor.",
    shortDescription: "Artisan slow-fermented sourdough bread",
    tags: ["bread", "artisan", "sourdough"],
    isFeatured: true,
    isPopular: true,
    isLatest: false,
  },
  {
    title: "Butter Croissants (Pack of 4)",
    categoryName: "Breads & Bakery",
    price: 3.99,
    stock: 50,
    brand: "BakeHouse",
    description:
      "Flaky and buttery croissants made with French-style laminated dough. Perfect for breakfast or brunch.",
    shortDescription: "Flaky butter croissants",
    tags: ["pastry", "breakfast", "bakery"],
    isFeatured: false,
    isPopular: true,
    isLatest: false,
  },
  {
    title: "Orange Juice Not From Concentrate (64 oz)",
    categoryName: "Beverages",
    price: 5.99,
    discountPrice: 4.99,
    stock: 60,
    brand: "SunSip",
    description:
      "Premium orange juice squeezed from fresh oranges. Never from concentrate. Packed with vitamin C.",
    shortDescription: "Fresh-squeezed orange juice",
    tags: ["juice", "vitamin-c", "breakfast"],
    isFeatured: true,
    isPopular: true,
    isLatest: false,
  },
  {
    title: "Organic Green Tea Bags (Pack of 40)",
    categoryName: "Beverages",
    price: 3.99,
    stock: 85,
    brand: "ZenLeaf",
    description:
      "Premium organic green tea sourced from Japanese plantations. Rich in antioxidants with a smooth finish.",
    shortDescription: "Premium organic Japanese green tea",
    tags: ["tea", "antioxidants", "organic"],
    isFeatured: false,
    isPopular: true,
    isLatest: false,
  },
  {
    title: "Cold Brew Coffee Concentrate (32 oz)",
    categoryName: "Beverages",
    price: 7.49,
    stock: 45,
    brand: "BrewCraft",
    description:
      "Small-batch cold brew coffee concentrate. Steeped for 20 hours for a smooth, low-acidity finish. Mix with water or milk.",
    shortDescription: "Smooth slow-steeped cold brew concentrate",
    tags: ["coffee", "cold-brew", "caffeine"],
    isFeatured: true,
    isPopular: false,
    isLatest: true,
  },
  {
    title: "Sparkling Water Variety Pack (12 cans)",
    categoryName: "Beverages",
    price: 4.49,
    stock: 100,
    brand: "FizzPop",
    description:
      "Zero-calorie sparkling water in three refreshing flavors. No sugar, no artificial sweeteners.",
    shortDescription: "Zero-calorie flavored sparkling water",
    tags: ["water", "sparkling", "zero-calorie"],
    isFeatured: false,
    isPopular: false,
    isLatest: false,
  },
  {
    title: "Dark Chocolate 70% Cocoa (3.5 oz)",
    categoryName: "Snacks & Biscuits",
    price: 3.49,
    stock: 110,
    brand: "CocoArtisan",
    description:
      "Belgian dark chocolate with 70% cocoa content. Rich, smooth, and ethically sourced from single-origin farms.",
    shortDescription: "Rich Belgian dark chocolate",
    tags: ["chocolate", "snack", "dark"],
    isFeatured: true,
    isPopular: false,
    isLatest: false,
  },
  {
    title: "Roasted Mixed Nuts (16 oz)",
    categoryName: "Snacks & Biscuits",
    price: 6.99,
    stock: 70,
    brand: "NuttyGood",
    description:
      "A premium blend of almonds, cashews, pecans, and walnuts. Lightly roasted and sea-salted.",
    shortDescription: "Premium roasted mixed nuts",
    tags: ["nuts", "healthy", "snack"],
    isFeatured: false,
    isPopular: true,
    isLatest: false,
  },
  {
    title: "Kettle Cooked Potato Chips (8 oz)",
    categoryName: "Snacks & Biscuits",
    price: 3.99,
    stock: 140,
    brand: "CrispCo",
    description:
      "Thick-cut kettle cooked potato chips seasoned with sea salt. Crunchy and satisfying.",
    shortDescription: "Thick-cut sea salt potato chips",
    tags: ["chips", "crispy", "snack"],
    isFeatured: false,
    isPopular: true,
    isLatest: false,
  },
  {
    title: "Granola Bars Variety Pack (12 bars)",
    categoryName: "Snacks & Biscuits",
    price: 5.49,
    discountPrice: 4.79,
    stock: 95,
    brand: "NuttyGood",
    description:
      "Chewy granola bars made with whole oats, honey, and real fruit. A convenient and wholesome snack.",
    shortDescription: "Wholesome chewy granola bars",
    tags: ["granola", "snack", "healthy"],
    isFeatured: false,
    isPopular: false,
    isLatest: true,
  },
];

async function seed() {
  await mongoose.connect(MONGODB_URI!);
  console.log("Connected to MongoDB\n");

  // Seed users
  const hashedPassword = await bcrypt.hash("Admin@123", 12);

  const adminExists = await User.findOne({ email: "admin@example.com" });
  if (!adminExists) {
    await User.create({
      name: "Admin",
      email: "admin@example.com",
      password: hashedPassword,
      role: "admin",
      isVerified: true,
    });
    console.log("Created admin user: admin@example.com / Admin@123");
  } else {
    console.log("Admin user already exists");
  }

  const userExists = await User.findOne({ email: "user@example.com" });
  if (!userExists) {
    const userPassword = await bcrypt.hash("User@123", 12);
    await User.create({
      name: "John Doe",
      email: "user@example.com",
      password: userPassword,
      role: "user",
      isVerified: true,
    });
    console.log("Created user: user@example.com / User@123");
  } else {
    console.log("User already exists");
  }

  console.log("");

  const categoryMap: Record<string, string> = {};

  for (const cat of categories) {
    const exists = await Category.findOne({ slug: cat.slug });
    if (exists) {
      console.log(`Category already exists: ${cat.name}`);
      categoryMap[cat.name] = exists._id.toString();
    } else {
      const created = await Category.create(cat);
      console.log(`Created category: ${cat.name}`);
      categoryMap[cat.name] = created._id.toString();
    }
  }

  console.log("");

  let created = 0;
  let skipped = 0;

  for (const prod of products) {
    const slug = slugify(prod.title);
    const categoryId = categoryMap[prod.categoryName];
    const sku = generateSku(categoryId.slice(-4).toUpperCase(), products.indexOf(prod) + 1);

    const exists = await Product.findOne({ slug });
    if (exists) {
      console.log(`Product already exists: ${prod.title}`);
      skipped++;
      continue;
    }

    await Product.create({
      title: prod.title,
      slug,
      description: prod.description,
      shortDescription: prod.shortDescription,
      category: categoryId,
      images: [],
      price: prod.price,
      discountPrice: prod.discountPrice,
      stock: prod.stock,
      sku,
      brand: prod.brand,
      rating: 0,
      reviewCount: 0,
      isFeatured: prod.isFeatured ?? false,
      isPopular: prod.isPopular ?? false,
      isLatest: prod.isLatest ?? false,
      isActive: true,
      tags: prod.tags,
    });

    console.log(`Created product: ${prod.title}`);
    created++;
  }

  console.log(`\nDone. ${created} products created, ${skipped} skipped.`);

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
