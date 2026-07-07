"use client"

import { useState } from "react"
import { Button } from "@mui/material"
import { FcGoogle } from "react-icons/fc"
import { useGoogleLogin } from "@react-oauth/google"
import { useRouter } from "next/navigation"
import { setCachedUser } from "@/hooks/useAuth"

type Props = {
  mode?: "login" | "signup"
  callbackUrl?: string
}

export function GoogleLoginButton({ mode = "login", callbackUrl = "/" }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const login = useGoogleLogin({
    scope: "openid email profile",
    onSuccess: async (tokenResponse) => {
      setLoading(true)
      setError(null)

      const credential = tokenResponse.access_token

      try {
        const res = await fetch("/api/auth/google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ credential }),
          credentials: "include",
        })

        const json = await res.json()

        if (!json.success) {
          setError(json.message || "Google sign-in failed")
          setLoading(false)
          return
        }

        if (json.data?.user) {
          setCachedUser(json.data.user)
        }

        router.push(callbackUrl)
      } catch {
        setError("Something went wrong")
        setLoading(false)
      }
    },
    onError: (errorResponse) => {
      const msg = errorResponse?.error_description || "Google sign-in was cancelled or failed"
      setError(msg)
      setLoading(false)
    },
    flow: "implicit",
  })

  const handleClick = () => {
    setLoading(true)
    setError(null)
    login()
  }

  return (
    <div>
      <Button
        onClick={handleClick}
        disabled={loading}
        startIcon={<FcGoogle />}
        variant="outlined"
        className="w-full! py-2.5! font-bold! bg-gray-100!"
        sx={{ textTransform: "none" }}
      >
        {loading
          ? "Connecting..."
          : mode === "signup"
            ? "Sign up with Google"
            : "Continue with Google"}
      </Button>
      {error && (
        <p className="text-red-500 text-xs mt-1 text-center">{error}</p>
      )}
    </div>
  )
}
