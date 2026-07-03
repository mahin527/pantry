"use client"

import Product from "../../public/potato-chips-1.jpg"
import { Button } from "@mui/material";
import ProfilePic from "../../public/profile-pic1.jpg"
import Image from "next/image"
import { useState } from "react"
import { FaAngleDown } from "react-icons/fa6";
import IconButton from '@mui/material/IconButton';
import Link from "next/link"

function OrderTableRow() {
    const [expandIndex, setExpandIndex] = useState<boolean>(false)
    return (
        <>
            <tr className="border-b border-gray-200 hover:bg-blue-100">
                <td>
                    <div className="py-4">
                        <IconButton
                            size="large"
                            className="bg-gray-100 shadow-md"
                            onClick={() => setExpandIndex(!expandIndex)}
                            aria-label={expandIndex ? "Collapse" : "Expand"}
                            aria-expanded={expandIndex}
                        >
                            <FaAngleDown size={24} className={`transition-transform duration-200 ease-in-out ${expandIndex && 'rotate-180'}`} />

                        </IconButton>
                    </div>
                </td>
                <td className="px-3 h-8 whitespace-nowrap border-x border-gray-200">
                    #3456345466789
                </td>
                <td className="px-3 py-1.5 h-8 whitespace-nowrap border-r border-gray-200">
                    <Link href={"#"} className="flex flex-col md:flex-row items-center justify-center gap-3">
                        <Image src={ProfilePic} height={50} width={50} alt="Profile pic" className="size-10 rounded-full" />
                        <span className="font-bold">
                            John Doe
                        </span>
                    </Link>
                </td>
                <td className="px-3 h-8 whitespace-nowrap border-r border-gray-200">
                    647657687
                </td>
                <td className="px-3 h-8 whitespace-nowrap border-r border-gray-200">
                    123@example.com
                </td>
                <td className="px-3 h-8 whitespace-nowrap border-r border-gray-200">
                    (+12)123 456 789
                </td>
                <td className="p-2 space-y-2 h-8 w-fit border-r border-gray-200">
                    <p className="p-1 rounded-sm w-fit bg-gray-200">
                        Home
                    </p>
                    <p>
                        Los Angeles, California, USA
                    </p>
                </td>
                <td className="px-3 h-8 whitespace-nowrap border-r border-gray-200">
                    7800
                </td>
                <td className="px-3 h-8 whitespace-nowrap border-r border-gray-200 font-semibold">
                    $126.56
                </td>
                <td className="px-3 h-8 whitespace-nowrap border-r border-gray-200">
                    #4566789
                </td>
                <td className="px-3 h-8 whitespace-nowrap border-r border-gray-200">
                    Pending
                </td>
                <td className="px-3 h-8 whitespace-nowrap border-r border-gray-200">
                    2026-27-04
                </td>
            </tr>

            {
                [1, 2, 3].map((item, index) => {
                    if (expandIndex === true) {
                        return (
                            <tr key={index} className="hover:bg-blue-100">
                                <td>
                                    {""}
                                </td>
                                <td colSpan={1} className="p-3 border-l border-gray-200">
                                    <Link href={"#"} className="flex flex-col items-center justify-center gap-3">
                                        <Image src={Product} height={100} width={100} alt="Profile pic" className="h-24 w-20 xl:h-30 xl:w-24 rounded-sm" />
                                    </Link>
                                </td>
                                <td colSpan={3} className="">
                                    <div className="space-y-2">
                                        <p className="font-bold text-base md:text-lg">
                                            Potato Chips
                                        </p>
                                        <p className="font-semibold">
                                            Unit Price: <span>02.98</span>
                                        </p>
                                        <p className="font-semibold">
                                            Quantity: <span>02</span>
                                        </p>
                                    </div>
                                </td>
                                <td className="font-semibold text-base">
                                    $123.80
                                </td>
                                <td>
                                    <Button variant="contained" className="py-2! font-bold!">
                                        Cancel
                                    </Button>
                                </td>
                            </tr>
                        )
                    }

                })
            }

        </>
    )
}

export default OrderTableRow