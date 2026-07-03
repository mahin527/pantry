"use client"

import ProductSlider from './ProductSlider';
import { FaArrowRightLong } from "react-icons/fa6";
import Link from 'next/link';

function RelatedProducts() {
    return (
        <section className="py-6">
            <div className=' bg-gray-100 rounded-md'> {/* dark:bg-black */}
                <div className='container'>
                    <div className=''>
                        <div className="py-4 space-y-2 flex items-center justify-between">
                            <h2 className="text-xl font-bold tracking-wider">
                                Related Products
                            </h2>
                            <Link href={"/"} className='flex items-center gap-1 font-bold hover:text-blue-500 transition duration-150'>
                                View all
                                <FaArrowRightLong />
                            </Link>
                        </div>

                    </div>
                </div>
                <ProductSlider />
            </div>
        </section>
    )
}

export default RelatedProducts