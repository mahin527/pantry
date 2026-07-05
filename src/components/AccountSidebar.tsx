"use client"

import { Avatar } from "@mui/material"
import { IconType } from "react-icons"
import { CgProfile } from "react-icons/cg"
import { IoLocationOutline } from "react-icons/io5"
import { IoMdHeartEmpty } from "react-icons/io"
import { BsCartCheck } from "react-icons/bs"
import { FaArrowRightFromBracket } from "react-icons/fa6"
import Link from "next/link"
import { Button } from "@mui/material"
import { usePathname, useRouter } from "next/navigation"
import { useAuth, setCachedUser } from "@/hooks/useAuth"
import { ImageUploader } from "@/components/ImageUploader"
import { useState } from "react"

type accountPageLinkType = {
  id: number
  title: string
  link: string
  icon: IconType
}

function AccountSidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, refresh } = useAuth()
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar ?? "")

  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) ?? "?"

  const handleAvatarUpload = async (url: string) => {
    setAvatarUrl(url)
    // Update user avatar in DB
    try {
      await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatar: url }),
        credentials: "include",
      })
      if (user) {
        setCachedUser({ ...user, avatar: url })
      }
    } catch {}
    refresh()
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" })
    } catch {}
    setCachedUser(null)
    router.push("/login")
  }

  const accountPageLinks: accountPageLinkType[] = [
    { id: 1, title: "My Profile", link: "/my-account", icon: CgProfile },
    { id: 2, title: "Address", link: "/address", icon: IoLocationOutline },
    { id: 3, title: "Wishlist", link: "/wishlist", icon: IoMdHeartEmpty },
    { id: 4, title: "My Orders", link: "/my-orders", icon: BsCartCheck },
    { id: 5, title: "Logout", link: "", icon: FaArrowRightFromBracket },
  ]

  return (
    <aside className="account-sidebar w-full h-fit shadow-md rounded-xl">
      <div className="bg-white py-4 rounded-t-xl">
        <div className="relative w-24 h-24 mx-auto">
          <Avatar
            src={avatarUrl || user?.avatar || undefined}
            alt={user?.name ?? "User"}
            sx={{ width: 96, height: 96, fontSize: 36, bgcolor: "primary.main" }}
          >
            {initials}
          </Avatar>
          <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200 z-10">
            <div className="w-full h-full rounded-full bg-black/30 flex items-center justify-center cursor-pointer">
              <span className="text-white text-xs font-bold">Change</span>
            </div>
          </div>
          <div className="absolute inset-0 z-20 opacity-0">
            <ImageUploader
              currentImage={avatarUrl || user?.avatar}
              onUpload={handleAvatarUpload}
              folder="avatars"
              label=""
            />
          </div>
        </div>
        <div className="text-center mt-2">
          <h3 className="text-base lg:text-lg xl:text-xl font-semibold text-gray-700">
            {user?.name ?? "User"}
          </h3>
          <p className="text-sm md:text-base lg:text-lg font-medium text-gray-700">
            {user?.email ?? ""}
          </p>
        </div>
      </div>

      <div className="my-account flex flex-col items-center justify-start w-full">
        {accountPageLinks.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.link

          if (link.link === "") {
            return (
              <button key={link.id} onClick={handleLogout} className="w-full py-2">
                <Button className="w-full! justify-start! gap-3! text-gray-600! font-semibold! px-3!">
                  <Icon size={26} />
                  {link.title}
                </Button>
              </button>
            )
          }

          return (
            <Link key={link.id} href={link.link} className="w-full py-2">
              <Button
                className={`w-full! justify-start! gap-3! text-gray-600! font-semibold! px-3! ${isActive === true && "active"}`}
              >
                <Icon size={26} />
                {link.title}
              </Button>
            </Link>
          )
        })}
      </div>
    </aside>
  )
}

export default AccountSidebar
