"use client"

import { Button, Typography, Box, Container } from "@mui/material"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { FaLock } from "react-icons/fa6"

export default function AccessDeniedPage() {
  const router = useRouter()

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          textAlign: "center",
          py: 8,
        }}
      >
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            bgcolor: "error.main",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 3,
          }}
        >
          <FaLock size={32} className="text-white" />
        </Box>

        <Typography
          variant="h3"
          component="h1"
          sx={{ fontWeight: "bold", mb: 1, fontSize: { xs: "1.75rem", sm: "2.5rem" } }}
        >
          Access Denied
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mb: 4, maxWidth: 400 }}
        >
          You do not have permission to access this page.
        </Typography>

        <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" } }}>
          <Button
            variant="contained"
            size="large"
            component={Link}
            href="/"
            sx={{ minWidth: 140 }}
          >
            Go Home
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => router.back()}
            sx={{ minWidth: 140 }}
          >
            Go Back
          </Button>
        </Box>
      </Box>
    </Container>
  )
}
