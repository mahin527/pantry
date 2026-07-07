"use client"

import { Avatar, Button, Snackbar, Alert, CircularProgress } from "@mui/material"
import { IconType } from "react-icons"
import { CgProfile } from "react-icons/cg"
import { IoLocationOutline } from "react-icons/io5"
import { IoMdHeartEmpty } from "react-icons/io"
import { BsCartCheck } from "react-icons/bs"
import { FaArrowRightFromBracket } from "react-icons/fa6"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth, setCachedUser } from "@/hooks/useAuth"
import { useState, useRef, useCallback } from "react"

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
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [previewFile, setPreviewFile] = useState<File | null>(null)

  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) ?? "?"

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const [snackbar, setSnackbar] = useState<{
    open: boolean
    message: string
    severity: "success" | "error" | "info"
  }>({ open: false, message: "", severity: "success" })

  const showSnackbar = useCallback((message: string, severity: "success" | "error" | "info") => {
    setSnackbar({ open: true, message, severity })
  }, [])

  const handleCloseSnackbar = useCallback(() => {
    setSnackbar((s) => ({ ...s, open: false }))
  }, [])

  const handleAvatarClick = () => {
    if (uploading) return
    fileInputRef.current?.click()
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
    if (!allowed.includes(file.type)) {
      showSnackbar("Invalid file type. Accepted: jpg, jpeg, png, webp", "error")
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      showSnackbar("File size must be less than 5 MB", "error")
      return
    }

    const objectUrl = URL.createObjectURL(file)
    setPreviewUrl(objectUrl)
    setPreviewFile(file)

    if (e.target) e.target.value = ""
  }

  const handleSaveAvatar = async () => {
    if (!previewFile || uploading) return

    setUploading(true)
    showSnackbar("Uploading avatar...", "info")
    try {
      const formData = new FormData()
      formData.append("file", previewFile)
      formData.append("folder", "avatars")

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      })
      const json = await res.json()
      if (json.success && json.data?.url) {
        setAvatarUrl(json.data.url)
        await fetch("/api/users/me", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ avatar: json.data.url }),
          credentials: "include",
        })
        if (user) {
          setCachedUser({ ...user, avatar: json.data.url })
        }
        showSnackbar("Avatar updated successfully.", "success")
      } else {
        showSnackbar("Failed to upload avatar. Please try again.", "error")
      }
    } catch {
      showSnackbar("Failed to upload avatar. Please try again.", "error")
    }
    setUploading(false)
    setPreviewUrl(null)
    setPreviewFile(null)
    refresh()
  }

  const handleCancelPreview = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(null)
    setPreviewFile(null)
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" })
    } catch { }
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

  const currentSrc = previewUrl || avatarUrl || user?.avatar || undefined

  return (
    <aside className="account-sidebar w-full h-fit shadow-md rounded-xl">
      <div className="bg-white py-4 rounded-t-xl">
        <div className="relative w-24 h-24 mx-auto overflow-hidden rounded-full">
          <div className="relative w-full h-full">
            <Avatar
              src={currentSrc}
              alt={user?.name ?? "User"}
              sx={{ width: "100%", height: "100%", fontSize: 36, bgcolor: "primary.main" }}
            >
              {initials}
            </Avatar>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFileSelect}
              className="hidden"
              id="avatar-upload"
              disabled={uploading}
            />
            {uploading ? (
              <div className="absolute inset-0 w-full h-full rounded-full bg-black/40 flex items-center justify-center z-10">
                <CircularProgress size={24} sx={{ color: "white" }} />
              </div>
            ) : (
              <button
                type="button"
                onClick={handleAvatarClick}
                className="absolute inset-0 w-full h-full rounded-full bg-black/40 flex items-center justify-center cursor-pointer opacity-0 hover:opacity-100 transition-opacity duration-200 z-10 border-0"
                aria-label="Change avatar"
              >
                <span className="text-white text-xs font-bold">Change</span>
              </button>
            )}
          </div>
        </div>
        {previewUrl && (
          <div className="flex justify-center gap-2 mt-3">
            <Button
              size="small"
              variant="contained"
              onClick={handleSaveAvatar}
              disabled={uploading}
            >
              Save
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={handleCancelPreview}
              disabled={uploading}
            >
              Cancel
            </Button>
          </div>
        )}
        <div className="text-center mt-2">
          <h3 className="text-base lg:text-lg xl:text-xl font-semibold text-gray-700">
            {user?.name ?? "User"}
          </h3>
          <p className="text-xs md:text-sm font-medium text-gray-700">
            {user?.email ?? ""}
          </p>
        </div>
      </div>

      <div className="my-account flex flex-col items-center justify-start w-full">
        {user ? (
          accountPageLinks.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.link

            if (link.link === "") {
              return (
                <Button
                  key={link.id}
                  onClick={handleLogout}
                  className="w-full! justify-start! gap-3! text-gray-600! font-semibold! px-3! py-2!"
                >
                  <Icon size={26} />
                  {link.title}
                </Button>
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
          })
        ) : (
          <div className="w-full px-4 py-4 space-y-2">
            <Link href="/login" className="block w-full">
              <Button variant="contained" className="w-full! font-bold!">
                Login
              </Button>
            </Link>
            <Link href="/register" className="block w-full">
              <Button variant="outlined" className="w-full! font-bold!">
                Register
              </Button>
            </Link>
          </div>
        )}
      </div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={snackbar.severity === "info" ? null : 4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </aside>
  )
}

export default AccountSidebar
