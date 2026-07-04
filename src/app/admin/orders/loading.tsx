import { Skeleton } from "@mui/material"

export default function AdminOrdersLoading() {
  return (
    <div style={{ padding: 24 }}>
      <Skeleton variant="text" width={200} height={40} sx={{ mb: 2 }} />
      <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 1 }} />
    </div>
  )
}
