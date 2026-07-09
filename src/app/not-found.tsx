"use client"

import { Button } from "@mui/material"
import { FaHome } from "react-icons/fa"
import { useRouter } from "next/navigation"

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <h1 className="text-8xl font-extrabold text-blue-500 leading-none">404</h1>
      <h2 className="text-2xl font-bold text-gray-700 mt-4">Page Not Found</h2>
      <p className="text-gray-500 mt-2 max-w-md">
        The page you are looking for does not exist or has been moved.
      </p>
      <Button
        variant="contained"
        onClick={() => router.push("/")}
        startIcon={<FaHome />}
        className="mt-6 font-bold!"
      >
        Back to Home
      </Button>
    </div>
  )
}