"use client"

import { useState } from "react"
import Link from "next/link"
import { FaAngleDown, FaBars, FaXmark } from "react-icons/fa6"
import Drawer from "@mui/material/Drawer"
import { Button } from "@mui/material"

function NavLinks() {
    const [mobileOpen, setMobileOpen] = useState(false)

    const navLinks = [
        { id: 1, title: "Home", link: "/" },
        { id: 2, title: "Fruits & Vegetables", link: "/products" },
        { id: 3, title: "Meats & Seafood", link: "/products" },
        { id: 4, title: "Breaksfast & Dairy", link: "/products" },
        { id: 5, title: "Breads & Bakery", link: "/products" },
        { id: 6, title: "Beverages", link: "/products" },
        { id: 7, title: "Frozen Foods", link: "/products" },
        { id: 8, title: "Biscuits & Snacks", link: "/products" },
        { id: 9, title: "Grocery & Staples", link: "/products" },
    ]

    return (
        <>
            {/* Mobile menu button — visible below md */}
            <div className="md:hidden container py-2">
                <Button
                    variant="text"
                    onClick={() => setMobileOpen(true)}
                    className="w-full! justify-start! gap-2!"
                >
                    <FaBars size={20} />
                    <span className="font-bold text-gray-700">Categories</span>
                </Button>
            </div>

            {/* Mobile Drawer */}
            <Drawer
                open={mobileOpen}
                onClose={() => setMobileOpen(false)}
                anchor="left"
            >
                <div className="w-72 p-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-lg text-gray-700">Categories</h3>
                        <Button onClick={() => setMobileOpen(false)}>
                            <FaXmark size={20} />
                        </Button>
                    </div>
                    <ul className="space-y-1">
                        {navLinks.map((link) => (
                            <li key={link.id}>
                                <Link
                                    href={link.link}
                                    onClick={() => setMobileOpen(false)}
                                    className="block px-3 py-2.5 rounded-md font-bold text-gray-600 hover:bg-blue-50 hover:text-blue-500 transition-colors"
                                >
                                    {link.title}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </Drawer>

            {/* Desktop navigation — hidden below md */}
            <nav className="hidden md:block container py-6 text-gray-700">
                <ul className="flex items-center gap-2 whitespace-nowrap">
                    {navLinks.map((link) => (
                        <li key={link.id} className="text-sm md:text-base tracking-wide font-bold">
                            <Link href={link.link} className="hover:text-blue-500 transition-colors duration-200">
                                {link.title}
                            </Link>
                        </li>
                    ))}
                    <li className="group relative text-sm md:text-base tracking-wider font-semibold">
                        <span className="flex items-center justify-center cursor-pointer hover:text-blue-500 transition-colors duration-200">
                            More
                            <FaAngleDown size={20} />
                        </span>
                        <div className="w-50 absolute top-full right-0 z-50 flex flex-col items-start bg-white shadow-md rounded-md overflow-hidden opacity-0 invisible transition-all duration-200 group-hover:opacity-100 group-hover:visible">
                            {navLinks.map((link) => (
                                <Link key={link.id} href={link.link} className="px-4 py-2 w-full hover:bg-blue-100 transition-colors">
                                    {link.title}
                                </Link>
                            ))}
                        </div>
                    </li>
                </ul>
            </nav>
        </>
    )
}

export default NavLinks
