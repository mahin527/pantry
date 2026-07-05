"use client"

import { useState, useRef } from "react"
import { Button, Avatar, Menu, MenuItem } from "@mui/material"
import Link from "next/link"
import { IoMdHeartEmpty } from "react-icons/io"
import { RiShoppingBag3Line } from "react-icons/ri"
import { CgProfile } from "react-icons/cg"
import { IoLocationOutline } from "react-icons/io5"
import { BsCartCheck } from "react-icons/bs"
import { FaArrowRightFromBracket } from "react-icons/fa6"
import { useAuth, setCachedUser } from "@/hooks/useAuth"
import { useCart } from "@/hooks/useCart"
import { useWishlist } from "@/hooks/useWishlist"
import { useRouter } from "next/navigation"

function NavMenus() {
  const { user } = useAuth()
  const { itemCount: cartCount } = useCart()
  const { itemCount: wishlistCount } = useWishlist()
  const router = useRouter()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const avatarRef = useRef<HTMLButtonElement>(null)

  const handleLogout = async () => {
    setAnchorEl(null)
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" })
    } catch {}
    setCachedUser(null)
    router.push("/")
  }

  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) ?? "?"

  return (
    <div className="flex items-center gap-0.5 md:gap-2 text-gray-700 flex-shrink-0">
      {user ? (
        <>
          <button
            ref={avatarRef}
            onClick={(e) => setAnchorEl(e.currentTarget)}
            className="flex items-center gap-1 md:gap-2 px-2 py-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Account menu"
          >
            <Avatar
              src={user.avatar || undefined}
              alt={user.name}
              sx={{ width: 32, height: 32, fontSize: 14, bgcolor: "primary.main" }}
            >
              {initials}
            </Avatar>
            <span className="hidden md:inline text-sm font-semibold max-w-[80px] truncate">
              {user.name}
            </span>
          </button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem onClick={() => { setAnchorEl(null); router.push("/my-account") }}>
              <CgProfile size={18} className="mr-2" /> My Profile
            </MenuItem>
            <MenuItem onClick={() => { setAnchorEl(null); router.push("/my-orders") }}>
              <BsCartCheck size={18} className="mr-2" /> My Orders
            </MenuItem>
            <MenuItem onClick={() => { setAnchorEl(null); router.push("/address") }}>
              <IoLocationOutline size={18} className="mr-2" /> Address
            </MenuItem>
            <MenuItem onClick={() => { setAnchorEl(null); router.push("/wishlist") }}>
              <IoMdHeartEmpty size={18} className="mr-2" /> Wishlist
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <FaArrowRightFromBracket size={18} className="mr-2" /> Logout
            </MenuItem>
          </Menu>
        </>
      ) : (
        <div className="hidden md:flex items-center gap-2 text-xs lg:text-base tracking-wider font-semibold">
          <Link href="/register" className="hover:text-blue-500 transition-colors duration-200">
            Register
          </Link>
          <span>|</span>
          <Link href="/login" className="hover:text-blue-500 transition-colors duration-200">
            Login
          </Link>
        </div>
      )}

      <Link href="/wishlist">
        <Button variant="text" className="rounded-full! py-1.5! md:py-3! min-w-0! px-1.5! md:px-2!">
          <div className="relative">
            <IoMdHeartEmpty size={24} className="md:size-[34]" />
            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-1 md:-right-2 bg-blue-100 size-3.5 md:size-5 text-[9px] md:text-sm font-bold rounded-full flex items-center justify-center">
                {wishlistCount > 99 ? "99+" : wishlistCount}
              </span>
            )}
          </div>
        </Button>
      </Link>
      <Link href="/cart">
        <Button variant="text" className="rounded-full! py-1.5! md:py-3! min-w-0! px-1.5! md:px-2!">
          <div className="relative">
            <RiShoppingBag3Line size={24} className="md:size-[34]" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-1 md:-right-2 bg-blue-100 size-3.5 md:size-5 text-[9px] md:text-sm font-bold rounded-full flex items-center justify-center">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </div>
        </Button>
      </Link>
    </div>
  )
}

export default NavMenus
