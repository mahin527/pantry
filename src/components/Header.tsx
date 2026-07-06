"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import logoImg from "../../public/logo-img.png"
import Link from "next/link"
import Searchbar from "./Searchbar"
import NavMenus from "./NavIcons"
import NavLinks, { MobileDrawer } from "./NavLinks"
import { FiSearch, FiX } from "react-icons/fi"

const Header = () => {
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
    const searchInputRef = useRef<HTMLInputElement>(null)

    const openSearch = () => {
        setMobileSearchOpen(true)
        setTimeout(() => searchInputRef.current?.focus(), 100)
    }

    return (
        <header className="sticky top-0 z-50 bg-white shadow-sm">
            <div className="border-b border-gray-200">
                <div className="container py-3 md:py-4">
                    {/* Desktop layout — hidden below md */}
                    <div className="hidden md:flex items-center justify-between gap-6">
                        <Link href={"/"} className="flex items-center gap-3 shrink-0">
                            <Image src={logoImg} alt="Pantry logo" width={120} height={120} className="size-10 lg:size-12" />
                            <h3 className="text-2xl lg:text-3xl font-black text-blue-600 tracking-tight">Pantry</h3>
                        </Link>
                        <div className="flex-1 max-w-xl mx-4">
                            <Searchbar placeholder="Search products, categories, brands..." />
                        </div>
                        <NavMenus />
                    </div>

                    {/* Mobile layout — visible below md */}
                    <div className="flex md:hidden items-center justify-between gap-1 min-h-11">
                        <MobileDrawer />
                        <Link href={"/"} className="flex items-center gap-1">
                            <Image src={logoImg} alt="Pantry" width={120} height={120} className="size-8" />
                            <h3 className="text-base font-black text-blue-600">Pantry</h3>
                        </Link>
                        <div className="flex items-center gap-0.5">
                            <button
                                onClick={openSearch}
                                className="flex items-center justify-center size-10 text-gray-600 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                                aria-label="Search"
                            >
                                <FiSearch size={20} />
                            </button>
                            <NavMenus />
                        </div>
                    </div>

                    {/* Mobile search bar — always present below header on mobile */}
                    <div className={`md:hidden transition-all duration-300 ease-in-out ${mobileSearchOpen ? "max-h-16 opacity-100 mt-2" : "max-h-0 opacity-0 overflow-hidden"}`}>
                        <div className="flex items-center gap-2 pb-1">
                            <div className="flex-1">
                                <Searchbar placeholder="Search products..." />
                            </div>
                            <button
                                onClick={() => setMobileSearchOpen(false)}
                                className="flex items-center justify-center size-10 text-gray-500 rounded-full hover:bg-gray-100 shrink-0"
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
