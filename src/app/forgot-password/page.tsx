"use client"

import { useState } from "react"
import TextField from "@mui/material/TextField"
import { FaArrowRightLong } from "react-icons/fa6"
import { TbLockQuestion } from "react-icons/tb"
import { Button } from "@mui/material"
import Link from "next/link"
import { toast } from "sonner"

function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address.")
      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const json = await res.json()

      if (!res.ok || !json.success) {
        toast.error(json.message || "Something went wrong. Please try again.")
        return
      }

      setSubmitted(true)
      toast.success("If an account with this email exists, you will receive a password reset link.", {
        duration: 5000,
      })
    } catch {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="relative overflow-hidden py-8 bg-gray-100 w-full h-screen flex items-center justify-center">
      <div className="container">
        <div className="bg-white border border-gray-200 py-5 px-4 sm:px-8 rounded-md shadow-md w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl m-auto">
          <div className="flex items-center justify-center text-blue-800">
            <TbLockQuestion size={70} />
          </div>
          <div className="text-center py-2">
            <h2 className="py-2 text-gray-700 text-xl lg:text-2xl font-semibold">
              Forgot Password
            </h2>
            <p className="text-gray-600 text-xs lg:text-sm font-medium tracking-wide leading-5">
              {submitted
                ? "If an account with this email exists, we've sent a password reset link. Please check your inbox."
                : "Enter your registered email address and we'll send you a link to reset your password."}
            </p>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-3 md:space-y-5 py-4">
              <div className="w-full">
                <TextField
                  id="email"
                  name="email"
                  label="Email"
                  variant="outlined"
                  className="w-full!"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
              <div className="w-full">
                <Button
                  type="submit"
                  variant="contained"
                  className="w-full! py-3! font-bold!"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Submit"}
                </Button>
              </div>
              <div className="text-center text-gray-600 font-medium flex flex-col items-center justify-center gap-y-4">
                <Link href={"/login"} className="hover:text-blue-500 font-bold flex items-center gap-2">
                  Back to login <FaArrowRightLong />
                </Link>
              </div>
            </form>
          ) : (
            <div className="text-center py-4 space-y-4">
              <p className="text-gray-500 text-sm">
                Didn&apos;t receive the email? Check your spam folder or try again.
              </p>
              <Button
                variant="outlined"
                className="font-bold!"
                onClick={() => setSubmitted(false)}
              >
                Try Again
              </Button>
              <div className="text-center text-gray-600 font-medium">
                <Link href={"/login"} className="hover:text-blue-500 font-bold flex items-center justify-center gap-2">
                  Back to login <FaArrowRightLong />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="circle-1 bg-blue-500 opacity-20 size-70 rounded-full absolute bottom-0 -left-[16%]" />
      <div className="circle-2 bg-blue-500 opacity-20 size-70 rounded-full absolute top-0 -right-[16%]" />
    </section>
  )
}

export default ForgotPassword
