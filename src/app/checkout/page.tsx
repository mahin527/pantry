"use client"

import Image from 'next/image'
import potatoChips1 from "../../../public/potato-chips-1.jpg"
import { FaPlus } from "react-icons/fa";

import { FaRegEdit } from "react-icons/fa";
import { Button } from '@mui/material';
import Radio from '@mui/material/Radio';
import { useContext } from 'react';
import { useAppContext } from "@/context/AppContext"

function CheckoutPage() {
    const { openAddAddress } = useAppContext()
    return (
        <section className='py-10 bg-gray-100'>
            <div className="container flex flex-col md:flex-row justify-between gap-5">

                <div className='w-full md:w-[65%] py-4 bg-white rounded-md border border-gray-200'>
                    <div className=' px-6 space-y-3 py-4 border-b border-gray-200 flex justify-between'>
                        <h3 className='text-xl lg:text-2xl text-gray-700 tracking-wider font-bold'>
                            Select Delivery Address
                        </h3>
                        <Button
                            onClick={openAddAddress}
                            variant='outlined' className='font-bold! flex! items-center! gap-2!'>
                            <FaPlus size={16} /> Add new address
                        </Button>
                    </div>
                    <div className='py-6 px-6 space-y-5'>
                        {
                            [1, 2, 3].map((address, index) => (
                                <div key={index} className='flex justify-between py-4 border border-gray-200 w-full rounded-md shadow-md'>
                                    <div className=''>
                                        <label htmlFor="isHomeAddress" className='flex items-center gap-2 text-blue-500 cursor-pointer font-bold'>
                                            <Radio
                                                value="a"
                                                name="isHomeAddress"
                                                id="isHomeAddress"
                                            />

                                            Home
                                        </label>
                                        <div className='info flex flex-col gap-2 pl-12 text-gray-600 font-medium'>
                                            <span className='font-semibold'>
                                                Mahin Hasan
                                            </span>
                                            <span>
                                                Jashore, Khulna, Bangladesh
                                            </span>
                                            <span>
                                                +880 12346 7879
                                            </span>
                                        </div>
                                    </div>

                                    <div>
                                        <Button className='py-3! rounded-md! font-bold!'>
                                            <FaRegEdit size={24} />
                                        </Button>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>


                <div className='w-full md:w-[35%]'>
                    <div className='bg-white rounded-md border border-gray-200'>
                        <div className='py-4 border-b border-gray-200'>
                            <h3 className='px-5 text-xl lg:text-2xl text-gray-700 tracking-wider font-bold'>
                                Your Order
                            </h3>
                        </div>

                        <div className='space-y-3 font-medium text-gray-600'>
                            <div className='px-5 py-3 flex items-center justify-between font-bold border-b border-gray-200'>
                                <span>
                                    Product
                                </span>
                                <span>
                                    Subtotal
                                </span>
                            </div>
                            <div className='max-h-75 overflow-y-scroll'>
                                {
                                    [1, 2, 3, 4, 5,].map((item, index) => (
                                        <div key={index} className='flex px-5 py-2'>
                                            <div className='flex gap-3 w-[80%]'>
                                                <div className='w-[30%]'>
                                                    <Image src={potatoChips1} alt='product' width={100} height={100} className='h-24 sm:h-25 md:26 w-full rounded-md' />
                                                </div>
                                                <div className='flex flex-col gap-2 w-[70%]'>
                                                    <h4 className='truncate font-semibold'>
                                                        Fortune Sunlite Refined Sunflower Oil 1 L
                                                    </h4>
                                                    <p>
                                                        Qty: <span className='font-semibold'>4</span>
                                                    </p>
                                                </div>
                                            </div>

                                            <div className='w-[20%] text-right'>
                                                <p className='font-semibold text-blue-500'>
                                                    $99.08
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>

                            <div className='px-5 py-2 text-center w-full'>
                                <Button variant="contained" className='w-full py-3! font-bold!'>
                                    Checkout
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    )
}

export default CheckoutPage