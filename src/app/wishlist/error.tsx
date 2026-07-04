"use client"

import { Button, Typography, Box } from "@mui/material"

export default function WishlistError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <section className="py-4 bg-gray-50 min-h-screen flex items-center justify-center">
      <Box sx={{ textAlign: "center", p: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
          Failed to load wishlist
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Something went wrong. Please try again.
        </Typography>
        <Button variant="contained" onClick={reset}>
          Try Again
        </Button>
      </Box>
    </section>
  )
}
