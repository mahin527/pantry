"use client"

import { useEffect } from "react"
import { Button } from "@mui/material"
import { FaHome } from "react-icons/fa"
import { useRouter } from "next/navigation"

type Props = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: Props) {
  const router = useRouter()

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.error("[Error page]", error)
    }
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <h1 className="text-9xl font-extrabold text-blue-500 leading-none">500</h1>
      <h2 className="text-2xl font-bold text-gray-700 mt-4">Something went wrong</h2>
      <p className="text-gray-500 mt-2 max-w-md">
        An unexpected error occurred. Please try again.
      </p>
      <div className="flex items-center gap-3 mt-6">
        <Button variant="contained" onClick={reset} className="font-bold!">
          Try Again
        </Button>
        <Button
          variant="outlined"
          onClick={() => router.push("/")}
          startIcon={<FaHome />}
          className="font-bold!"
        >
          Home
        </Button>
      </div>
    </div>
  )
}