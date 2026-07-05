"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import logoImg from "../../public/logo-img.png"
import Link from "next/link"
import Searchbar from "./Searchbar"
import NavMenus from "./NavIcons"
import NavLinks, { MobileToggle } from "./NavLinks"
import { FiSearch, FiX } from "react-icons/fi"

const Header = () => {
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
    const searchInputRef = useRef<HTMLInputElement>(null)

    const openSearch = () => {
        setMobileSearchOpen(true)
        setTimeout(() => searchInputRef.current?.focus(), 100)
    }

    return (
        <header>
            <div className="border-b border-gray-300">
                <div className="container py-2 md:py-4">
                    {/* Desktop layout */}
                    <div className="hidden md:flex items-center justify-between gap-2">
                        <div className="logo flex-shrink-0">
                            <Link href={"/"} className="flex items-center justify-center gap-1 md:gap-2 bg-black/10 dark:bg-white/15 py-1 md:py-2 px-2 md:px-5 rounded-full">
                                <Image src={logoImg} alt="Pantry logo" width={120} height={120} className="size-8 md:size-14 lg:size-16 2xl:size-18" />
                                <h3 className="text-lg md:text-2xl lg:text-3xl font-black font-sans text-blue-500 dark:text-blue-400">Pantry</h3>
                            </Link>
                        </div>
                        <div className="flex-1 max-w-md mx-2">
                            <Searchbar placeholder="Search for products..." />
                        </div>
                        <NavMenus />
                    </div>

                    {/* Mobile layout */}
                    <div className="flex md:hidden items-center justify-between gap-1 min-h-[44px]">
                        <MobileToggle />
                        <Link href={"/"} className="flex items-center gap-1">
                            <Image src={logoImg} alt="Pantry" width={120} height={120} className="size-8" />
                            <h3 className="text-base font-black text-blue-500">Pantry</h3>
                        </Link>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={openSearch}
                                className="flex items-center justify-center size-10 text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                                aria-label="Search"
                            >
                                <FiSearch size={20} />
                            </button>
                            <NavMenus />
                        </div>
                    </div>

                    {/* Mobile search overlay */}
                    <div
                        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
                            mobileSearchOpen ? "max-h-16 opacity-100 mt-2" : "max-h-0 opacity-0"
                        }`}
                    >
                        <div className="flex items-center gap-2">
                            <div className="flex-1">
                                <Searchbar placeholder="Search products..." />
                            </div>
                            <button
                                onClick={() => setMobileSearchOpen(false)}
                                className="flex items-center justify-center size-10 text-gray-500 rounded-full hover:bg-gray-100 flex-shrink-0"
                                aria-label="Close search"
                            >
                                <FiX size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <NavLinks />
        </header>
    )
}

export default Header
