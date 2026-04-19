import { Button } from "@mui/material";
import { IoSearchOutline } from "react-icons/io5";

function Searchbar() {
    return (
        <div className="search-box bg-black/15 dark:bg-white/15 w-150 h-14 rounded-md flex items-center">
            <input type="text" placeholder="Search for products..." className="px-4 text-sm md:text-base lg:text-lg tracking-wider outline-none border-none w-full h-full" />
            <Button variant="text" className="cursor-pointer pr-3 font-medium rounded-md h-full">
                <IoSearchOutline size={30} />
            </Button>
        </div>
    )
}

export default Searchbar