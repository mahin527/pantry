"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import TextField from "@mui/material/TextField"
import IconButton from "@mui/material/IconButton"
import { Button } from "@mui/material"
import { FaArrowRightLong } from "react-icons/fa6"
import { FaEye, FaEyeSlash } from "react-icons/fa"
import { TbLockQuestion } from "react-icons/tb"
import { toast } from "sonner"

export default function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!token) {
      setError("Invalid or missing reset token.")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      })

      const json = await res.json()

      if (!res.ok || !json.success) {
        setError(json.message || "Failed to reset password.")
        toast.error(json.message || "Failed to reset password.")
        return
      }

      toast.success("Password has been reset successfully!", { duration: 3000 })
      router.push("/login")
    } catch {
      setError("Something went wrong. Please try again.")
      toast.error("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <section className="relative overflow-hidden py-8 bg-gray-100 w-full h-screen flex items-center justify-center">
        <div className="container">
          <div className="bg-white border border-gray-200 py-8 px-4 sm:px-8 rounded-md shadow-md w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl m-auto text-center">
            <div className="flex items-center justify-center text-red-500">
              <TbLockQuestion size={70} />
            </div>
            <h2 className="py-2 text-gray-700 text-xl lg:text-2xl font-semibold">Invalid Reset Link</h2>
            <p className="text-gray-600 text-xs lg:text-sm font-medium tracking-wide leading-5 mb-4">
              This password reset link is invalid or has expired. Please request a new one.
            </p>
            <Link href="/forgot-password">
              <Button variant="contained" className="font-bold!">
                Request New Link
              </Button>
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative overflow-hidden py-8 bg-gray-100 w-full h-screen flex items-center justify-center">
      <div className="container">
        <div className="bg-white border border-gray-200 py-5 px-4 sm:px-8 rounded-md shadow-md w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl m-auto">
          <div className="flex items-center justify-center text-blue-800">
            <TbLockQuestion size={70} />
          </div>
          <div className="text-center py-2">
            <h2 className="py-2 text-gray-700 text-xl lg:text-2xl font-semibold">Reset Password</h2>
            <p className="text-gray-600 text-xs lg:text-sm font-medium tracking-wide leading-5">
              Enter your new password below.
            </p>
          </div>

          {error && (
            <p className="text-red-500 text-sm font-medium text-center mb-2">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-3 md:space-y-5 py-4">
            <div className="w-full relative">
              <TextField
                id="password"
                name="password"
                label="New Password"
                variant="outlined"
                className="w-full!"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                size="large"
                aria-label="password-show-hide"
                className="absolute! right-2 top-1/2 -translate-y-1/2 z-10"
              >
                {showPassword ? <FaEye size={20} /> : <FaEyeSlash size={20} />}
              </IconButton>
            </div>
            <div className="w-full relative">
              <TextField
                id="confirmPassword"
                name="confirmPassword"
                label="Confirm Password"
                variant="outlined"
                className="w-full!"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                required
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
            <div className="w-full">
              <Button
                type="submit"
                variant="contained"
                className="w-full! py-3! font-bold!"
                disabled={loading}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </Button>
            </div>
            <div className="text-center text-gray-600 font-medium flex flex-col items-center justify-center gap-y-4">
              <Link href={"/login"} className="hover:text-blue-500 font-bold flex items-center gap-2">
                Back to login <FaArrowRightLong />
              </Link>
            </div>
          </form>
        </div>
      </div>

      <div className="circle-1 bg-blue-500 opacity-20 size-70 rounded-full absolute bottom-0 -left-[16%]" />
      <div className="circle-2 bg-blue-500 opacity-20 size-70 rounded-full absolute top-0 -right-[16%]" />
    </section>
  )
}
