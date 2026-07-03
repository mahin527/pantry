"use client"

import { Button } from "@mui/material";
import { FaAngleDown } from "react-icons/fa6";
import { FaAngleUp } from "react-icons/fa6";
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Collapse } from 'react-collapse';
import { useState } from "react";
import Rating from '@mui/material/Rating';

import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';


function Sidebar() {
    const checkboxLabel = [
        { id: 1, label: "Fruits & Vegetables" },
        { id: 2, label: "Meats & Seafood" },
        { id: 3, label: "Breaksfast & Dairy" },
        { id: 4, label: "Breads & Bakery" },
        { id: 5, label: "Beverages " },
        { id: 6, label: "Frozen Foods" },
        { id: 7, label: "Biscuits & Snacks" }
    ]

    const [isOpenCatFilter, setIsOpenCatFilter] = useState(true)
    const [isOpenRatingFilter, setIsOpenRatingFilter] = useState(true)

    const [price, setPrice] = useState<[number, number]>([10, 30000])

    const label = { slotProps: { input: { 'aria-label': 'Checkbox demo' } } };

    const ratings = [5, 4, 3, 2, 1]
    const [selectedRatings, setSelectedRatings] = useState<number[]>([])
    return (
        <aside className='sticky top-10 text-gray-600'>
            <div>
                <div className='flex items-center justify-between'>
                    <h3 className="text-base lg:text-lg font-bold">
                        Shop by Category
                    </h3>
                    <Button onClick={() => setIsOpenCatFilter(!isOpenCatFilter)} className="rounded-full! h-14! w-4!">
                        {
                            isOpenCatFilter === true ? <FaAngleUp size={26} /> : <FaAngleDown size={26} />
                        }
                    </Button>
                </div>

                <Collapse isOpened={isOpenCatFilter}>
                    <div className="scroll overflow-scroll max-h-60 px-2">
                        <FormGroup>
                            {
                                checkboxLabel.map((item) => (
                                    <FormControlLabel
                                        key={item.id}
                                        className="hover:bg-gray-200"
                                        control={
                                            <Checkbox
                                                // sx={{
                                                //     color: "#6b7280",
                                                //     "&.Mui-checked": {
                                                //         color: "#2563eb",
                                                //     },
                                                //     "@media (prefers-color-scheme: dark)": {
                                                //         color: "#d1d5db",
                                                //     },
                                                // }}
                                            />
                                        }
                                        label={item.label}
                                    />
                                ))
                            }
                        </FormGroup>
                    </div>
                </Collapse>
            </div>

            <div className="pt-4 space-y-4">
                <div className='flex items-center justify-between'>
                    <h3 className="text-base lg:text-lg font-bold">
                        Filter By Price
                    </h3>
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span>
                            ${price[0]}
                        </span>
                        <span>
                            ${price[1]}
                        </span>
                    </div>
                    <RangeSlider
                        value={price}
                        onInput={(val) => setPrice(val as [number, number])}
                        min={10}
                        max={30000}
                        step={5}
                    />
                </div>
            </div>

            <div className="pt-4">
                <div className='flex items-center justify-between'>
                    <h3 className="text-base lg:text-lg font-bold">
                        Filter By Rating
                    </h3>
                    <Button onClick={() => setIsOpenRatingFilter(!isOpenRatingFilter)} className="rounded-full! h-14! w-4!">
                        {
                            isOpenRatingFilter === true ? <FaAngleUp size={26} /> : <FaAngleDown size={26} />
                        }
                    </Button>
                </div>

                <Collapse isOpened={isOpenRatingFilter}>
                    <div className="scroll overflow-scroll max-h-60">
                        {ratings.map((rate) => (
                            <div
                                key={rate}
                                className="flex items-center w-full cursor-pointer hover:bg-gray-200 rounded"
                                onClick={() => {
                                    setSelectedRatings((prev) =>
                                        prev.includes(rate)
                                            ? prev.filter((r) => r !== rate)
                                            : [...prev, rate]
                                    )
                                }}
                            >
                                <Checkbox
                                    checked={selectedRatings.includes(rate)}
                                    // sx={{
                                    //     color: "#6b7280",
                                    //     "&.Mui-checked": {
                                    //         color: "#2563eb",
                                    //     },
                                    //     "@media (prefers-color-scheme: dark)": {
                                    //         color: "#d1d5db",
                                    //     },
                                    // }}
                                />
                                <Rating value={rate} size="small" readOnly />
                            </div>
                        ))}
                    </div>
                </Collapse>
            </div>
        </aside>
    )
}

export default Sidebar