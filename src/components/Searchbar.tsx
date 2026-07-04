"use client"

import { Button } from "@mui/material";
import { IoSearchOutline } from "react-icons/io5";

function Searchbar({ placeholder = "Search for products..." }: { placeholder: string }) {
    return (
        <div className="search-box bg-black/5 w-full max-w-md h-12 md:h-14 rounded-md flex items-center"> {/* dark:bg-white/15 */}
            <input type="text" placeholder={placeholder} className="px-4 text-sm md:text-base lg:text-lg tracking-wider outline-none border-none w-full h-full" />
            <Button variant="text" className="cursor-pointer pr-3 font-medium rounded-md h-full">
                <IoSearchOutline size={30} />
            </Button>
        </div>
    )
}

export default Searchbar