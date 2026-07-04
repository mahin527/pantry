"use client"

import { Button, Typography, Box } from "@mui/material"

export default function AdminOrdersError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <Box sx={{ textAlign: "center", p: 4, mt: 8 }}>
      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
        Failed to load orders
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Something went wrong. Please try again.
      </Typography>
      <Button variant="contained" onClick={reset}>
        Try Again
      </Button>
    </Box>
  )
}
