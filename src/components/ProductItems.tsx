"use client"

import Image from "next/image"
import productImg from "../../public/product-1-colorful-fruit-juices-in-glass-bottles-with-fresh-fruit.png"
import { Button } from "@mui/material"
import Rating from '@mui/material/Rating';
import Link from "next/link"

function ProductItems() {
    return (
        <div className="space-y-3 group py-2 px-3 overflow-hidden bg-white dark:bg-white/20 shadow-md rounded-md w-50 h-88">
            <Link href={"/"} className="hover:text-blue-500 transition-colors duration-150">
                <div className="relative img flex items-center justify-center py-3">
                    <Image src={productImg} alt="product" height={140} width={140} className="object-contain transition duration-200 group-hover:scale-105" />
                    <span className="z-2 absolute left-0 top-0 border-2 font-bold border-gray-500 text-gray-500 py-0.5 px-1 rounded-md">Bingo</span>
                </div>
                <h3 className="font-bold tracking-wider">
                    Colorful fruit juices - 64 fl oz Bottle
                </h3>
            </Link>
            <Rating name="read-only" value={4} size="small" readOnly className="pt-2" />
            <div className="price flex items-center justify-between">
                <p className="text-blue-500 font-bold">
                    $24.09
                </p>
                <p className="text-gray-400 font-bold line-through">
                    $32.21
                </p>
            </div>
            <div className="flex flex-col items-center w-full">
                <Button variant="contained" className="text-center w-full font-bold">
                    Add to cart
                </Button>
            </div>
        </div>
    )
}

export default ProductItems