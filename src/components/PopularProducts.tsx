"use client"

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useState } from 'react';
import ProductSlider from './ProductSlider';


function PopularProducts() {
    const [value, setValue] = useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

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

            <ProductSlider />
        </div>
        </section>
    )
}

export default PopularProducts