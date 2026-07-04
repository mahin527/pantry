import { Skeleton } from "@mui/material"

export default function AdminLoading() {
  return (
    <div style={{ padding: 24 }}>
      <Skeleton variant="text" width={200} height={40} sx={{ mb: 2 }} />
      <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <Skeleton key={i} variant="rectangular" width={160} height={100} sx={{ borderRadius: 1 }} />
        ))}
      </div>
      <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 1, mb: 2 }} />
      <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 1 }} />
    </div>
  )
}
