"use client"

import { IoSearchOutline } from "react-icons/io5"

function Searchbar({
  placeholder = "Search products, categories, brands...",
  onOpenModal,
}: {
  placeholder?: string
  onOpenModal: () => void
}) {
  return (
    <button
      type="button"
      onClick={onOpenModal}
      aria-label="Search products"
      className="relative w-full max-w-lg lg:max-w-xl transition-all duration-300 text-left"
    >
      <div className="flex items-center w-full h-12 lg:h-14 rounded-xl border-2 border-gray-200 bg-white shadow-sm transition-all duration-300 hover:border-blue-400 hover:shadow-md">
        <span className="flex items-center justify-center pl-4 pr-2 text-gray-400 pointer-events-none">
          <IoSearchOutline size={22} className="lg:size-[24]" />
        </span>
        <span className="flex-1 pr-4 text-sm lg:text-base text-gray-400 truncate h-full flex items-center">
          {placeholder}
        </span>
      </div>
    </button>
  )
}

export default Searchbar
