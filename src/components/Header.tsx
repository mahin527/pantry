"use client"

import { useState } from "react"
import Image from "next/image"
import logoImg from "../../public/logo-img.png"
import Link from "next/link"
import Searchbar from "./Searchbar"
import NavMenus from "./NavIcons"
import NavLinks from "./NavLinks"
import { FiSearch } from "react-icons/fi"

const Header = () => {
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false)

    return (
        <header>
            <div className="border-b border-gray-300">
                <div className="container py-2 md:py-4">
                    <div className="flex items-center justify-between gap-1 md:gap-2 min-h-[44px]">
                        <div className="logo flex-shrink-0">
                            <Link href={"/"} className="flex items-center justify-center gap-1 md:gap-2 bg-black/10 dark:bg-white/15 py-1 md:py-2 px-2 md:px-5 rounded-full">
                                <Image src={logoImg} alt="Pantry logo" width={120} height={120} className="size-8 md:size-14 lg:size-16 2xl:size-18" />
                                <h3 className="text-lg md:text-2xl lg:text-3xl font-black font-sans text-blue-500 dark:text-blue-400">Pantry</h3>
                            </Link>
                        </div>

                        {/* Search — hidden on mobile, shown on md+ */}
                        <div className="hidden md:block flex-1 max-w-md mx-2">
                            <Searchbar placeholder="Search for products..." />
                        </div>

                        {/* Mobile search toggle */}
                        <button
                            className="md:hidden flex items-center justify-center size-10 text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                            aria-label="Toggle search"
                        >
                            <FiSearch size={20} />
                        </button>

                        <NavMenus />
                    </div>

                    {/* Mobile search panel */}
                    <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${mobileSearchOpen ? 'max-h-16 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                        {mobileSearchOpen && <Searchbar placeholder="Search for products..." />}
                    </div>
                </div>
            </div>
            <NavLinks />
        </header>
    )
}

export default Header
