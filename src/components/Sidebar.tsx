"use client"

import { FaAngleDown } from "react-icons/fa6"
import { FaAngleUp } from "react-icons/fa6"
import FormGroup from "@mui/material/FormGroup"
import FormControlLabel from "@mui/material/FormControlLabel"
import Checkbox from "@mui/material/Checkbox"
import { Collapse } from "react-collapse"
import { useState, useCallback, useRef } from "react"
import Rating from "@mui/material/Rating"
import { useRouter, useSearchParams } from "next/navigation"

import RangeSlider from "react-range-slider-input"
import "react-range-slider-input/dist/style.css"

type Category = {
  _id: string
  name: string
  slug: string
  image: string
}

type Props = {
  categories: Category[]
  selectedCategory: string
  minPrice: string
  maxPrice: string
}

function Sidebar({ categories, selectedCategory, minPrice, maxPrice }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [isOpenCatFilter, setIsOpenCatFilter] = useState(true)
  const [isOpenRatingFilter, setIsOpenRatingFilter] = useState(true)

  const initialMin = minPrice ? Number(minPrice) : 10
  const initialMax = maxPrice ? Number(maxPrice) : 30000
  const [price, setPrice] = useState<[number, number]>([initialMin, initialMax])

  const ratings = [5, 4, 3, 2, 1]
  const selectedRating = searchParams.get("rating") || ""

  const navigate = useCallback(
    (params: Record<string, string>) => {
      const sp = new URLSearchParams(searchParams.toString())
      Object.entries(params).forEach(([k, v]) => {
        if (v) sp.set(k, v)
        else sp.delete(k)
      })
      sp.set("page", "1")
      router.push(`/products?${sp.toString()}`)
    },
    [router, searchParams],
  )

  const toggleCategory = (catId: string) => {
    navigate({ category: selectedCategory === catId ? "" : catId })
  }

  const commitPrice = useCallback(
    (val: [number, number]) => {
      navigate({
        minPrice: val[0] > 10 ? String(val[0]) : "",
        maxPrice: val[1] < 30000 ? String(val[1]) : "",
      })
    },
    [navigate],
  )

  const handlePriceInput = (val: [number, number]) => {
    setPrice(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      commitPrice(val)
    }, 600)
  }

  // cleanup handled inline in handlePriceInput

  return (
    <aside className="sticky top-10 text-gray-600">
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-base lg:text-lg font-bold">Shop by Category</h3>
          <button
            onClick={() => setIsOpenCatFilter(!isOpenCatFilter)}
            className="rounded-full h-14 w-4 flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Toggle category filter"
          >
            {isOpenCatFilter === true ? <FaAngleUp size={26} /> : <FaAngleDown size={26} />}
          </button>
        </div>

        <Collapse isOpened={isOpenCatFilter}>
          <div className="scroll overflow-scroll max-h-60 px-2">
            <FormGroup>
              {categories.map((cat) => (
                <FormControlLabel
                  key={cat._id}
                  className="hover:bg-gray-200"
                  control={
                    <Checkbox
                      checked={selectedCategory === cat._id}
                      onChange={() => toggleCategory(cat._id)}
                    />
                  }
                  label={cat.name}
                />
              ))}
            </FormGroup>
          </div>
        </Collapse>
      </div>

      <div className="pt-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base lg:text-lg font-bold">Filter By Price</h3>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span>${price[0]}</span>
            <span>${price[1]}</span>
          </div>
          <RangeSlider
            value={price}
            onInput={(val) => handlePriceInput(val as [number, number])}
            min={10}
            max={30000}
            step={5}
          />
        </div>
      </div>

      <div className="pt-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base lg:text-lg font-bold">Filter By Rating</h3>
          <button
            onClick={() => setIsOpenRatingFilter(!isOpenRatingFilter)}
            className="rounded-full h-14 w-4 flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Toggle rating filter"
          >
            {isOpenRatingFilter === true ? <FaAngleUp size={26} /> : <FaAngleDown size={26} />}
          </button>
        </div>

        <Collapse isOpened={isOpenRatingFilter}>
          <div className="scroll overflow-scroll max-h-60">
            {ratings.map((rate) => (
              <button
                key={rate}
                type="button"
                className="flex items-center w-full hover:bg-gray-200 rounded"
                onClick={() => {
                  navigate({ rating: selectedRating === String(rate) ? "" : String(rate) })
                }}
                aria-label={`Filter by ${rate} star rating`}
                aria-pressed={selectedRating === String(rate)}
              >
                <Checkbox checked={selectedRating === String(rate)} tabIndex={-1} />
                <Rating value={rate} size="small" readOnly />
              </button>
            ))}
          </div>
        </Collapse>
      </div>
    </aside>
  )
}

export default Sidebar
