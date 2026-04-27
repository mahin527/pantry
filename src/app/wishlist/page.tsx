"use client"

import AccountSidebar from "@/components/AccountSidebar"
import Image from 'next/image'
import potatoChips1 from "../../../public/potato-chips-1.jpg"
import Rating from '@mui/material/Rating';
import { RiDeleteBin6Line } from "react-icons/ri";
import { Button } from '@mui/material';

function MyList() {
    return (
        <section className='bg-gray-100 py-8'>
            <div className="container flex gap-5">
                <div className="w-[25%]">
                    <AccountSidebar />
                </div>

                <div className="wrapper w-[75%] space-y-8">
                    <div className="bg-white shadow-md rounded-md">
                        <div className="py-6 px-6 border-b border-gray-200 flex items-center justify-between">
                            <div className='space-y-2'>
                                <h3 className="text-xl lg:text-2xl text-gray-700 tracking-wider font-bold">
                                    Wishlist
                                </h3>
                                <p className="text-base lg:text-lg text-gray-600 tracking-wider font-bold">
                                    There are <span className="text-blue-500 font-semibold">4</span> products in your Wishlist
                                </p>
                            </div>

                        </div>
                        {
                            [1, 2, 3, 4].map((item, index) => (

                                <div key={index} className='px-5 flex justify-between py-4 border-b border-gray-200'>
                                    <div className='flex items-center gap-4'>
                                        <Image src={potatoChips1} alt='product' width={100} height={100} className='h-28 w-20 rounded-md' />
                                        <div className='space-y-2'>
                                            <span className='text-xs lg:text-sm text-gray-500'>
                                                Bingo
                                            </span>
                                            <h4 className='font-bold text-base lg:text-lg text-gray-700'>
                                                Fortune Sunlite Refined Sunflower Oil 1 L
                                            </h4>
                                            <Rating name="read-only" value={5} readOnly />
                                            <div className='flex items-center gap-3 text-gray-600'>
                                                {/* <QuantityBox /> */}
                                                <p className="text-blue-500 font-bold">
                                                    $24.09
                                                </p>
                                                <p className="text-gray-400 font-bold line-through">
                                                    $32.21
                                                </p>
                                                <p className='font-bold text-green-700'>
                                                    14% OFF
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <Button className='py-5! rounded-full! font-bold! text-red-600!'>
                                            <RiDeleteBin6Line size={20} />
                                        </Button>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </section>
    )
}

export default MyList