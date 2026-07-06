"use client"

import { Button } from "@mui/material"
import { IoSearchOutline } from "react-icons/io5"

function Searchbar({ placeholder = "Search for products..." }: { placeholder: string }) {
    return (
        <div className="w-full h-11 lg:h-13 rounded-lg border border-gray-300 bg-white flex items-center shadow-sm transition-shadow duration-200 focus-within:border-blue-400 focus-within:shadow-md focus-within:ring-2 focus-within:ring-blue-100">
            <input
                type="text"
                placeholder={placeholder}
                aria-label="Search products"
                className="px-4 text-sm lg:text-base tracking-wider outline-none border-none w-full h-full bg-transparent text-gray-700 placeholder-gray-400"
            />
            <Button
                variant="text"
                className="h-full px-4! rounded-r-lg! flex-shrink-0 text-gray-500 hover:text-blue-600!"
                aria-label="Submit search"
            >
                <IoSearchOutline size={24} />
            </Button>
        </div>
    )
}

export default Searchbar
