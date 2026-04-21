import Image from 'next/image'
import potatoChips1 from "../../../public/potato-chips-1.jpg"
import Rating from '@mui/material/Rating';
import QuantityBox from '@/components/QuantityBox';
import { RiDeleteBin6Line } from "react-icons/ri";
import { Button } from '@mui/material';

function CartPage() {
    return (
        <section className='py-10 bg-gray-100'>
            <div className="container flex justify-between gap-5">

                <div className='w-[75%] bg-white rounded-md border border-gray-200'>
                    <div className='space-y-3 py-4 border-b border-gray-200'>
                        <h3 className='px-5 text-xl lg:text-2xl text-gray-700 tracking-wider font-bold'>
                            Your Cart
                        </h3>
                        <h6 className='px-5 text-base lg:text-lg text-gray-600 tracking-wide font-semibold'>
                            There are 7 products in your cart
                        </h6>
                    </div>

                    {
                        [1, 2, 3, 4].map((item, index) => (

                            <div key={index} className='px-5 flex justify-between py-4 border-b border-gray-200'>
                                <div className='flex items-center gap-4'>
                                    <Image src={potatoChips1} alt='product' width={100} height={100} className='h-28 w-20' />
                                    <div className='space-y-2'>
                                        <span className='text-xs lg:text-sm text-gray-500'>
                                            Bingo
                                        </span>
                                        <h4 className='font-bold text-base lg:text-lg text-gray-700'>
                                            Fortune Sunlite Refined Sunflower Oil 1 L
                                        </h4>
                                        <Rating name="read-only" value={5} readOnly />
                                        <div className='flex items-center gap-3 text-gray-600'>
                                            <QuantityBox />
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
                                    <Button className='py-3! rounded-md! font-bold! text-red-600!'>
                                        <RiDeleteBin6Line size={20} />
                                    </Button>
                                </div>
                            </div>
                        ))
                    }

                </div>


                <div className='w-[25%]'>
                    <div className='bg-white rounded-md border border-gray-200'>
                        <div className='py-4 border-b border-gray-200'>
                            <h3 className='px-5 text-xl lg:text-2xl text-gray-700 tracking-wider font-bold'>
                                Cart Totals
                            </h3>
                        </div>

                        <div className='space-y-3 py-3 font-medium text-gray-600'>
                            <div className='px-5 flex items-center justify-between'>
                                <span>
                                    Subtotal
                                </span>
                                <span className='text-blue-500'>
                                    $2,133
                                </span>
                            </div>

                            <div className='px-5 flex items-center justify-between'>
                                <span>
                                    Shipping
                                </span>
                                <span>
                                    Free
                                </span>
                            </div>

                            <div className='px-5 flex items-center justify-between'>
                                <span>
                                    Estimate for
                                </span>
                                <span>
                                    Global
                                </span>
                            </div>
                            <div className='px-5 py-2 flex items-center justify-between'>
                                <span className='font-bold text-xl'>
                                    Total
                                </span>
                                <span className='font-bold text-blue-500 text-xl'>
                                    $2,133
                                </span>
                            </div>

                            <div className='px-5 py-2 text-center w-full'>
                                <Button variant="contained" className='w-full'>
                                    Next
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    )
}

export default CartPage