import { Button } from '@mui/material';
import Link from 'next/link'
import { IoMdHeartEmpty } from "react-icons/io";
import { RiShoppingBag3Line } from "react-icons/ri";

function NavMenus() {
    return (
        <div className='flex items-center gap-2'>
            <div className='flex items-center gap-2 text-sm md:text-base lg:text-lg tracking-wider font-semibold'>
                <Link href={"/register"} className='hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200'>
                    Register
                </Link>
                <span>
                    |
                </span>
                <Link href={"/login"} className='hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200'>
                    Login
                </Link>
            </div>
            <Link href={"/cart"}>
                <Button variant='text' className='rounded-md'>
                    <div className="relative">
                        <IoMdHeartEmpty size={34} />
                        <span className="absolute -top-2 -right-2 bg-blue-100 size-5 text-sm font-bold rounded-full flex items-center justify-center">
                            3
                        </span>
                    </div>
                </Button>
            </Link>
            <Link href={"/save"}>
                <Button variant='text' className='rounded-md'>
                    <div className="relative">
                        <RiShoppingBag3Line size={34} />
                        <span className="absolute -top-2 -right-2 bg-blue-100 size-5 text-sm font-bold rounded-full flex items-center justify-center">
                            3
                        </span>
                    </div>
                </Button>
            </Link>
        </div>




    )
}

export default NavMenus