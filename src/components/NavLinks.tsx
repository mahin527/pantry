"use client"

import { useState } from "react"
import Link from "next/link"
import { FaBars, FaXmark } from "react-icons/fa6"
import { IoMdHeartEmpty } from "react-icons/io"
import { BsCartCheck } from "react-icons/bs"
import { CgProfile } from "react-icons/cg"
import { FaArrowRightFromBracket } from "react-icons/fa6"
import Drawer from "@mui/material/Drawer"
import { Button, Divider } from "@mui/material"
import { useAuth, setCachedUser } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"

export function MobileDrawer() {
    const [open, setOpen] = useState(false)
    const { user } = useAuth()
    const router = useRouter()

    const categories = [
        { id: 1, title: "Home", link: "/" },
        { id: 2, title: "Fruits & Vegetables", link: "/products" },
        { id: 3, title: "Meats & Seafood", link: "/products" },
        { id: 4, title: "Breakfast & Dairy", link: "/products" },
        { id: 5, title: "Breads & Bakery", link: "/products" },
        { id: 6, title: "Beverages", link: "/products" },
        { id: 7, title: "Snacks & Biscuits", link: "/products" },
        { id: 8, title: "Frozen Foods", link: "/products" },
        { id: 9, title: "Grocery & Staples", link: "/products" },
    ]

    const accountLinks = [
        { id: 1, title: "My Account", link: "/my-account", icon: CgProfile },
        { id: 2, title: "My Orders", link: "/my-orders", icon: BsCartCheck },
        { id: 3, title: "Wishlist", link: "/wishlist", icon: IoMdHeartEmpty },
    ]

    const handleLogout = async () => {
        setOpen(false)
        try { await fetch("/api/auth/logout", { method: "POST", credentials: "include" }) } catch { }
        setCachedUser(null)
        router.push("/")
    }

    const close = () => setOpen(false)

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="flex items-center justify-center size-10 text-gray-600 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                aria-label="Open menu"
            >
                <FaBars size={20} />
            </button>
            <Drawer open={open} onClose={close} anchor="left">
                <div className="w-72 p-4 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-lg text-gray-700">Menu</h3>
                        <Button onClick={close}><FaXmark size={20} /></Button>
                    </div>

                    {user && (
                        <div className="flex items-center gap-3 px-3 py-3 mb-3 bg-blue-50 rounded-lg">
                            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                                {user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                            </div>
                            <div>
                                <p className="font-semibold text-gray-800 text-sm">{user.name}</p>
                                <p className="text-xs text-gray-500">{user.email}</p>
                            </div>
                        </div>
                    )}

                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-3">Shop</p>
                    <ul className="space-y-0.5 mb-4">
                        {categories.map((link) => (
                            <li key={link.id}>
                                <Link href={link.link} onClick={close}
                                    className="block px-3 py-2.5 rounded-md font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                >
                                    {link.title}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {user && (
                        <>
                            <Divider />
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 mt-4 px-3">Account</p>
                            <ul className="space-y-0.5">
                                {accountLinks.map((link) => {
                                    const Icon = link.icon
                                    return (
                                        <li key={link.id}>
                                            <Link href={link.link} onClick={close}
                                                className="flex items-center gap-3 px-3 py-2.5 rounded-md font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                            >
                                                <Icon size={18} className="text-gray-500" />
                                                {link.title}
                                            </Link>
                                        </li>
                                    )
                                })}
                                <li>
                                    <button onClick={handleLogout}
                                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-md font-semibold text-red-600 hover:bg-red-50 transition-colors"
                                    >
                                        <FaArrowRightFromBracket size={18} />
                                        Logout
                                    </button>
                                </li>
                            </ul>
                        </>
                    )}

                    {!user && (
                        <div className="mt-auto flex gap-2">
                            <Link href="/login" onClick={close}
                                className="flex-1 text-center bg-blue-600 text-white py-2.5 rounded-lg font-bold text-sm hover:bg-blue-700 transition-colors"
                            >
                                Sign In
                            </Link>
                            <Link href="/register" onClick={close}
                                className="flex-1 text-center bg-gray-100 text-gray-700 py-2.5 rounded-lg font-bold text-sm hover:bg-gray-200 transition-colors"
                            >
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>
            </Drawer>
        </>
    )
}

function NavLinks() {
    const navLinks = [
        { id: 1, title: "Home", link: "/" },
        { id: 2, title: "Fruits & Vegetables", link: "/products" },
        { id: 3, title: "Meats & Seafood", link: "/products" },
        { id: 4, title: "Breakfast & Dairy", link: "/products" },
        { id: 5, title: "Breads & Bakery", link: "/products" },
        { id: 6, title: "Beverages", link: "/products" },
        { id: 7, title: "Snacks & Biscuits", link: "/products" },
        { id: 8, title: "Frozen Foods", link: "/products" },
        { id: 9, title: "Grocery & Staples", link: "/products" },
    ]

    const visible = navLinks.slice(0, 7)
    const overflow = navLinks.slice(7)

    return (
        <nav className="hidden md:block bg-white border-b border-gray-200">
            <div className="container flex items-center justify-between overflow-hidden">
                <ul className="flex items-center gap-0 lg:gap-1">
                    {visible.map((link) => (
                        <li key={link.id} className="shrink-0">
                            <Link href={link.link}
                                className="inline-block whitespace-nowrap px-2 lg:px-4 py-3 text-xs lg:text-sm font-semibold text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-blue-600 after:transition-all hover:after:w-full"
                            >
                                {link.title}
                            </Link>
                        </li>
                    ))}
                    {/* {overflow.length > 0 && (
                        <li className="group relative shrink-0">
                            <span className="inline-flex items-center gap-1 whitespace-nowrap px-2 lg:px-4 py-3 text-xs lg:text-sm font-semibold text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer">
                                More <FaChevronDown size={10} className="lg:size-3" />
                            </span>
                            <div className="absolute top-full right-0 z-50 min-w-45 bg-white rounded-lg shadow-lg border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-1 group-hover:translate-y-0">
                                {overflow.map((link) => (
                                    <Link key={link.id} href={link.link}
                                        className="block px-4 py-2.5 text-sm font-semibold text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors whitespace-nowrap"
                                    >
                                        {link.title}
                                    </Link>
                                ))}
                            </div>
                        </li>
                    )} */}
                </ul>
            </div>
        </nav>
    )
}

export default NavLinks
