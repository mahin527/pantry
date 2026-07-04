import Link from "next/link"
import { Button, Typography, Box } from "@mui/material"

export default function ProductNotFound() {
  return (
    <section className="py-4 bg-gray-50 min-h-screen flex items-center justify-center">
      <Box sx={{ textAlign: "center", p: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
          Product Not Found
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          The product you are looking for does not exist or has been removed.
        </Typography>
        <Button variant="contained" component={Link} href="/products">
          Browse Products
        </Button>
      </Box>
    </section>
  )
}
