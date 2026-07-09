"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { IoSearchOutline } from "react-icons/io5"

function Searchbar({ placeholder = "Search products, categories, brands..." }: { placeholder: string }) {
    const router = useRouter()
    const [query, setQuery] = useState("")

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        const trimmed = query.trim()
        if (trimmed) {
            router.push(`/products?search=${encodeURIComponent(trimmed)}`)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault()
            const trimmed = query.trim()
            if (trimmed) {
                router.push(`/products?search=${encodeURIComponent(trimmed)}`)
            }
        }
    }

    return (
        <form onSubmit={handleSearch} className="relative w-full max-w-lg lg:max-w-xl transition-all duration-300">
            <div className="flex items-center w-full h-12 lg:h-14 rounded-xl border-2 border-gray-200 bg-white shadow-sm transition-all duration-300 focus-within:border-blue-500 focus-within:shadow-md focus-within:shadow-blue-100">
                <span className="flex items-center justify-center pl-4 pr-2 text-gray-400 pointer-events-none">
                    <IoSearchOutline size={22} className="lg:size-[24]" />
                </span>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    aria-label="Search products"
                    className="flex-1 pr-4 text-sm lg:text-base outline-none border-none bg-transparent text-gray-700 placeholder-gray-400 h-full"
                />
            </div>
        </form>
    )
}

export default Searchbar