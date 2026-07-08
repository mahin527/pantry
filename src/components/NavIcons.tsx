"use client"

import { useState } from "react"
import { Button, Avatar, Menu, MenuItem, Divider } from "@mui/material"
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

  const handleLogout = async () => {
    setAnchorEl(null)
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" })
    } catch { }
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
    <div className="flex items-center gap-1 lg:gap-2 text-gray-700 flex-shrink-0">
      {/* Heart / Wishlist */}
      <Link href="/wishlist" className="hidden md:block">
        <Button
          variant="text"
          className="rounded-full! min-w-0! px-2! lg:px-3! h-10! lg:h-12! hover:bg-gray-100!"
        >
          <div className="relative">
            <IoMdHeartEmpty size={24} className="lg:size-7" />
            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-blue-500 text-white size-4 lg:size-5 text-[10px] lg:text-xs font-bold rounded-full flex items-center justify-center">
                {wishlistCount > 99 ? "99+" : wishlistCount}
              </span>
            )}
          </div>
        </Button>
      </Link>

      {/* Cart */}
      <Link href="/cart">
        <Button
          variant="text"
          className="rounded-full! min-w-0! px-2! lg:px-3! h-10! lg:h-12! hover:bg-gray-100!"
        >
          <div className="relative">
            <RiShoppingBag3Line size={22} className="md:size-6 lg:size-7" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-blue-500 text-white size-4 lg:size-5 text-[10px] lg:text-xs font-bold rounded-full flex items-center justify-center">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </div>
        </Button>
      </Link>

      {/* Account — desktop */}
      <div className="hidden md:flex items-center">
        <Divider orientation="vertical" flexItem sx={{ height: 28, mx: 1 }} />
        {user ? (
          <>
            <button
              onClick={(e) => setAnchorEl(e.currentTarget)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label="Account menu"
            >
              <Avatar
                src={user.avatar || undefined}
                alt={user.name}
                sx={{ width: 34, height: 34, fontSize: 14, bgcolor: "primary.main" }}
              >
                {initials}
              </Avatar>
              <div className="text-left leading-tight">
                <p className="text-xs text-gray-500">Account</p>
                <p className="text-sm font-semibold text-gray-800 max-w-[100px] truncate">
                  {user.name}
                </p>
              </div>
            </button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              slotProps={{ paper: { sx: { minWidth: 200, mt: 1, borderRadius: 2, boxShadow: "0 4px 20px rgba(0,0,0,0.12)" } } }}
            >
              <MenuItem onClick={() => { setAnchorEl(null); router.push("/my-account") }}>
                <CgProfile size={18} className="mr-3 text-gray-500" /> My Profile
              </MenuItem>
              <MenuItem onClick={() => { setAnchorEl(null); router.push("/my-orders") }}>
                <BsCartCheck size={18} className="mr-3 text-gray-500" /> My Orders
              </MenuItem>
              <MenuItem onClick={() => { setAnchorEl(null); router.push("/address") }}>
                <IoLocationOutline size={18} className="mr-3 text-gray-500" /> Addresses
              </MenuItem>
              <MenuItem onClick={() => { setAnchorEl(null); router.push("/wishlist") }}>
                <IoMdHeartEmpty size={18} className="mr-3 text-gray-500" /> Wishlist
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <FaArrowRightFromBracket size={18} className="mr-3 text-gray-500" /> Logout
              </MenuItem>
            </Menu>
          </>
        ) : (
          <div className="flex items-center gap-3 ml-2">
            <Link
              href="/register"
              className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors"
            >
              Sign Up
            </Link>
            <Link
              href="/login"
              className="text-sm font-semibold bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Sign In
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default NavMenus
