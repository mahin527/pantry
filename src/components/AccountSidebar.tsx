"use client"

import { Avatar } from "@mui/material"
import { IconType } from "react-icons"
import { MdCloudUpload } from "react-icons/md"
import { CgProfile } from "react-icons/cg"
import { IoLocationOutline } from "react-icons/io5"
import { IoMdHeartEmpty } from "react-icons/io"
import { BsCartCheck } from "react-icons/bs"
import { FaArrowRightFromBracket } from "react-icons/fa6"
import Link from "next/link"
import { Button } from "@mui/material"
import { usePathname, useRouter } from "next/navigation"
import { useAuth, setCachedUser } from "@/hooks/useAuth"

type accountPageLinkType = {
  id: number
  title: string
  link: string
  icon: IconType
}

function AccountSidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const { user } = useAuth()

  const accountPageLinks: accountPageLinkType[] = [
    { id: 1, title: "My Profile", link: "/my-account", icon: CgProfile },
    { id: 2, title: "Address", link: "/address", icon: IoLocationOutline },
    { id: 3, title: "Wishlist", link: "/wishlist", icon: IoMdHeartEmpty },
    { id: 4, title: "My Orders", link: "/my-orders", icon: BsCartCheck },
    { id: 5, title: "Logout", link: "", icon: FaArrowRightFromBracket },
  ]

  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) ?? "?"

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" })
    } catch {}
    setCachedUser(null)
    router.push("/login")
  }

  return (
    <aside className="account-sidebar w-full h-fit shadow-md rounded-xl">
      <div className="bg-white py-4 rounded-t-xl">
        <div className="group profile-block relative bg-white shadow-md w-1/3 xl:w-1/2 mx-auto flex items-center justify-center rounded-full">
          <Avatar
            src={user?.avatar || undefined}
            alt={user?.name ?? "User"}
            sx={{ width: 100, height: 100, fontSize: 36, bgcolor: "primary.main" }}
          >
            {initials}
          </Avatar>
          <div className="overlay w-full h-full overflow-hidden rounded-full bg-black/20 z-10 absolute top-0 left-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out">
            <MdCloudUpload size={48} className="text-white" />
            <input type="file" name="profile-pic" id="profile-pic" className="w-full h-full absolute top-0 left-0 z-12 cursor-pointer" />
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
