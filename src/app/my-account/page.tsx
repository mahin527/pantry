"use client"

import { useState, useEffect, useTransition } from "react"
import AccountSidebar from "@/components/AccountSidebar"
import { Button } from "@mui/material"
import TextField from "@mui/material/TextField"
import IconButton from "@mui/material/IconButton"
import { FaEye, FaEyeSlash } from "react-icons/fa"
import { toast } from "sonner"
import { useAuth, setCachedUser } from "@/hooks/useAuth"

function MyAccount() {
  const { user } = useAuth()
  const [, startTransition] = useTransition()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")

  const [profileLoading, setProfileLoading] = useState(false)

  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordError, setPasswordError] = useState("")

  useEffect(() => {
    startTransition(() => {
      if (user) {
        setName(user.name)
        setEmail(user.email)
      }
    })
  }, [user])

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || name.trim().length < 2) {
      toast.error("Name must be at least 2 characters.")
      return
    }

    setProfileLoading(true)

    try {
      const res = await fetch("/api/auth/update-profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
        credentials: "include",
      })

      const json = await res.json()

      if (!res.ok || !json.success) {
        toast.error(json.message || "Failed to update profile.")
        return
      }

      setCachedUser({ ...user!, name: name.trim() })
      toast.success("Profile updated successfully!", { duration: 3000 })
    } catch {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setProfileLoading(false)
    }
  }

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError("")

    if (!oldPassword) {
      setPasswordError("Current password is required.")
      return
    }
    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters.")
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.")
      return
    }
    if (oldPassword === newPassword) {
      setPasswordError("New password cannot be same as current password.")
      return
    }

    setPasswordLoading(true)

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPassword, newPassword, confirmPassword }),
        credentials: "include",
      })

      const json = await res.json()

      if (!res.ok || !json.success) {
        setPasswordError(json.message || "Failed to update password.")
        toast.error(json.message || "Failed to update password.")
        return
      }

      toast.success("Password updated successfully!", { duration: 3000 })
      setOldPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch {
      setPasswordError("Something went wrong. Please try again.")
      toast.error("Something went wrong. Please try again.")
    } finally {
      setPasswordLoading(false)
    }
  }

  return (
    <section className="bg-gray-100 py-8">
      <div className="container flex flex-col md:flex-row gap-5">
        <div className="w-full md:w-[25%]">
          <AccountSidebar />
        </div>

        <div className="wrapper w-full md:w-[75%] space-y-8">
          <div className="bg-white shadow-md rounded-md">
            <div className="py-4 space-y-2 px-6 border-b border-gray-200">
              <h3 className="text-xl lg:text-2xl text-gray-700 tracking-wider font-bold">
                My Profile
              </h3>
              <p className="text-base lg:text-lg text-gray-600 tracking-wider font-bold">
                All your account information in one place
              </p>
            </div>

            <form onSubmit={handleProfileUpdate} className="py-6 px-6">
              <div className="flex flex-col sm:flex-row items-center gap-6 text-gray-600!">
                <div className="w-full">
                  <TextField
                    id="fullname"
                    name="fullname"
                    label="Fullname"
                    variant="outlined"
                    type="text"
                    className="w-full"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={profileLoading}
                    required
                  />
                </div>
                <div className="w-full">
                  <TextField
                    id="email"
                    name="email"
                    label="Email (can't be changed)"
                    variant="outlined"
                    type="text"
                    className="w-full"
                    value={email}
                    disabled
                    sx={{ "& .MuiInputBase-root": { bgcolor: "grey.100", cursor: "not-allowed" } }}
                  />
                </div>
              </div>
              <div className="py-3">
                <Button
                  type="submit"
                  variant="contained"
                  className="py-2.5! font-bold!"
                  disabled={profileLoading}
                >
                  {profileLoading ? "Updating..." : "Update"}
                </Button>
              </div>
            </form>
          </div>

          <div className="bg-white shadow-md rounded-md">
            <div className="py-4 space-y-2 px-6 border-b border-gray-200">
              <h3 className="text-xl lg:text-2xl text-gray-700 tracking-wider font-bold">
                Change Password
              </h3>
              <p className="text-base lg:text-lg text-gray-600 tracking-wider font-bold">
                Update Your Password
              </p>
            </div>

            {passwordError && (
              <p className="text-red-500 text-sm font-medium text-center mt-3">{passwordError}</p>
            )}

            <form onSubmit={handlePasswordUpdate} className="py-6 px-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-6 text-gray-600!">
                <div className="w-full relative">
                  <TextField
                    id="old-password"
                    name="oldPassword"
                    label="Old Password"
                    variant="outlined"
                    className="w-full"
                    type={showOldPassword ? "text" : "password"}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    disabled={passwordLoading}
                  />
                  <IconButton
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    size="large"
                    aria-label="old-password-show-hide"
                    className="absolute! right-2 top-1/2 -translate-y-1/2 z-10"
                  >
                    {showOldPassword ? <FaEye size={20} /> : <FaEyeSlash size={20} />}
                  </IconButton>
                </div>
                <div className="w-full relative">
                  <TextField
                    id="new-password"
                    name="newPassword"
                    label="New Password"
                    variant="outlined"
                    className="w-full"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={passwordLoading}
                  />
                  <IconButton
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    size="large"
                    aria-label="new-password-show-hide"
                    className="absolute! right-2 top-1/2 -translate-y-1/2 z-10"
                  >
                    {showNewPassword ? <FaEye size={20} /> : <FaEyeSlash size={20} />}
                  </IconButton>
                </div>
                <div className="w-full relative">
                  <TextField
                    id="confirm-password"
                    name="confirmPassword"
                    label="Confirm Password"
                    variant="outlined"
                    className="w-full"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={passwordLoading}
                  />
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    size="large"
                    aria-label="confirm-password-show-hide"
                    className="absolute! right-2 top-1/2 -translate-y-1/2 z-10"
                  >
                    {showConfirmPassword ? <FaEye size={20} /> : <FaEyeSlash size={20} />}
                  </IconButton>
                </div>
              </div>
              <div className="py-3">
                <Button
                  type="submit"
                  variant="contained"
                  className="py-2.5! font-bold!"
                  disabled={passwordLoading}
                >
                  {passwordLoading ? "Updating..." : "Change Password"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default MyAccount
