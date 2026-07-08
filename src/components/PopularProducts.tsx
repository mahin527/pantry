"use client"

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useState } from 'react';
import ProductSlider from './ProductSlider';

type ProductItem = {
  _id: string
  title: string
  slug: string
  price: number
  discountPrice?: number
  images: string[]
  rating: number
  brand?: string
}

function PopularProducts({ products }: { products?: ProductItem[] }) {
  const [value, setValue] = useState(0);
  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  if (products && products.length === 0) return null

  return (
    <section className="py-8">
      <div className='bg-gray-100 rounded-md'> {/* dark:bg-black*/}
        <div className="flex items-center justify-between px-5 py-3">
          <div className="col-1 w-[30%] space-y-2">
            <h2 className="text-xl font-bold tracking-wider">
              Popular Products
            </h2>
            <p className="text-sm lg:text-base font-bold tracking-wider">
              Do not miss the current offers
            </p>
          </div>
          <div className="col-2 w-[70%] flex items-center justify-end">
            <Tabs
              value={value}
              onChange={handleChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                "& .MuiTab-root": {
                  color: "#6b7280",
                  fontWeight: "bold"
                },
                "& .Mui-selected": {
                  color: "#3b82f6",
                  fontWeight: "bold"
                },
              }}
            >
              <Tab label="Breads & Bakery" />
              <Tab label="Breaksfast & Dairy" />
              <Tab label="Meats & Seafood" />
              <Tab label="Fruits & Vegetables" />
              <Tab label="Biscuits & Snacks" />
              <Tab label="Frozen Foods" />
            </Tabs>
          </div>
        </div>

        <ProductSlider products={products} sectionId="popular" />
      </div>
    </section>
  )
}

export default PopularProducts
