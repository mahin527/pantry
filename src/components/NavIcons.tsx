"use client"

import { Button } from '@mui/material';
import Link from 'next/link'
import { IoMdHeartEmpty } from "react-icons/io";
import { RiShoppingBag3Line } from "react-icons/ri";

function NavMenus() {
    return (
        <div className='flex items-center gap-0.5 md:gap-2 text-gray-700 flex-shrink-0'>
            <div className='hidden md:flex items-center gap-2 text-xs lg:text-base lg:text-lg tracking-wider font-semibold'>
                <Link href={"/register"} className='hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200'>
                    Register
                </Link>
                <span>|</span>
                <Link href={"/login"} className='hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200'>
                    Login
                </Link>
            </div>
            <Link href={"/wishlist"}>
                <Button variant='text' className='rounded-full! py-1.5! md:py-3! min-w-0! px-1.5! md:px-2!'>
                    <div className="relative">
                        <IoMdHeartEmpty size={24} className="md:size-[34]" />
                        <span className="absolute -top-2 -right-1 md:-right-2 bg-blue-100 size-3.5 md:size-5 text-[9px] md:text-sm font-bold rounded-full flex items-center justify-center">
                            0
                        </span>
                    </div>
                </Button>
            </Link>
            <Link href={"/cart"}>
                <Button variant='text' className='rounded-full! py-1.5! md:py-3! min-w-0! px-1.5! md:px-2!'>
                    <div className="relative">
                        <RiShoppingBag3Line size={24} className="md:size-[34]" />
                        <span className="absolute -top-2 -right-1 md:-right-2 bg-blue-100 size-3.5 md:size-5 text-[9px] md:text-sm font-bold rounded-full flex items-center justify-center">
                            0
                        </span>
                    </div>
                </Button>
            </Link>
        </div>
    )
}

export default NavMenus
