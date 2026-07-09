import { headers, cookies } from "next/headers"
import Link from "next/link"
import { redirect } from "next/navigation"
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Chip,
} from "@mui/material"
import { formatPrice, formatDate } from "@/lib/utils"
import { STATUS_COLORS, AUTH_COOKIE_CONFIG } from "@/constants"
import { verifyAccessToken } from "@/lib/auth"

type Stats = {
  users: number
  products: number
  categories: number
  orders: number
  revenue: number
  pendingOrders: number
  lowStockProducts: number
}

type Order = {
  _id: string
  user: { name: string; email: string }
  total: number
  orderStatus: string
  createdAt: string
}

type User = {
  _id: string
  name: string
  email: string
  avatar?: string
  createdAt: string
}

type Product = {
  _id: string
  title: string
  sku: string
  stock: number
}

type DashboardData = {
  stats: Stats
  recentOrders: Order[]
  lowStockProductsList: Product[]
  latestUsers: User[]
}

async function getDashboard(): Promise<DashboardData | null> {
  try {
    const reqHeaders = await headers()
    const host = reqHeaders.get("host") || "localhost:3000"
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https"
    const cookie = reqHeaders.get("cookie")

    const res = await fetch(`${protocol}://${host}/api/admin/dashboard`, {
      headers: cookie ? { cookie } : undefined,
      cache: "no-store",
    })
    if (!res.ok) return null
    const json = await res.json()
    if (!json.success) return null
    return json.data as DashboardData
  } catch {
    return null
  }
}

function StatCard({ label, value, href }: { label: string; value: number | string; href?: string }) {
  const content = (
    <Card sx={{ minWidth: 160, cursor: href ? "pointer" : "default" }} variant="outlined">
      <CardContent sx={{ textAlign: "center", py: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "primary.main" }}>
          {typeof value === "number" ? value.toLocaleString() : value}
        </Typography>
        <Typography color="text.secondary" variant="body2">
          {label}
        </Typography>
      </CardContent>
    </Card>
  )

  if (href) return <Link href={href}>{content}</Link>
  return content
}

function InitialsAvatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <Box
      sx={{
        width: 40,
        height: 40,
        borderRadius: "50%",
        bgcolor: "primary.main",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "bold",
        fontSize: 14,
        flexShrink: 0,
      }}
    >
      {initials}
    </Box>
  )
}

export default async function AdminDashboardPage() {
  // Server-side auth guard (works in all modes including dev where middleware is skipped)
  const cookieStore = await cookies()
  const token = cookieStore.get(AUTH_COOKIE_CONFIG.name)?.value
  if (!token) {
    redirect(`/login?callbackUrl=${encodeURIComponent("/admin")}`)
  }

  let payload
  try {
    payload = verifyAccessToken(token)
  } catch {
    redirect(`/login?callbackUrl=${encodeURIComponent("/admin")}`)
  }

  if (payload!.role !== "admin") {
    redirect("/403")
  }

  const data = await getDashboard()

  if (!data) {
    return (
      <Box sx={{ p: 3, textAlign: "center", mt: 8 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
          Failed to load dashboard
        </Typography>
        <Typography color="text.secondary">Please try again later.</Typography>
      </Box>
    )
  }

  const { stats, recentOrders, lowStockProductsList, latestUsers } = data

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h4" sx={{ fontWeight: "bold", mb: 3 }}>
        Dashboard
      </Typography>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 4 }}>
        <StatCard label="Total Users" value={stats.users} href="/admin/users" />
        <StatCard label="Products" value={stats.products} href="/admin/products" />
        <StatCard label="Categories" value={stats.categories} href="/admin/categories" />
        <StatCard label="Orders" value={stats.orders} href="/admin/orders" />
        <StatCard label="Revenue" value={formatPrice(stats.revenue)} />
        <StatCard label="Pending Orders" value={stats.pendingOrders} href="/admin/orders" />
        <StatCard label="Low Stock" value={stats.lowStockProducts} />
      </Box>

      <Box sx={{ display: "flex", gap: 3, flexDirection: { xs: "column", lg: "row" } }}>
        <Box sx={{ flex: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
            Recent Orders
          </Typography>
          {recentOrders.length === 0 ? (
            <Paper sx={{ p: 3, textAlign: "center" }}>
              <Typography color="text.secondary">No orders yet.</Typography>
            </Paper>
          ) : (
            <Paper>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>Order ID</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Customer</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Total</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentOrders.map((o) => (
                      <TableRow key={o._id} hover>
                        <TableCell sx={{ fontFamily: "monospace", fontSize: "0.75rem" }}>
                          #{o._id.slice(-8).toUpperCase()}
                        </TableCell>
                        <TableCell>{o.user?.name ?? "—"}</TableCell>
                        <TableCell>{formatDate(o.createdAt)}</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>{formatPrice(o.total)}</TableCell>
                        <TableCell>
                          <Chip label={o.orderStatus} size="small" color={STATUS_COLORS[o.orderStatus] ?? "default"} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}

          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1, mt: 3 }}>
            Low Stock Products
          </Typography>
          {lowStockProductsList.length === 0 ? (
            <Paper sx={{ p: 3, textAlign: "center" }}>
              <Typography color="text.secondary">All products adequately stocked.</Typography>
            </Paper>
          ) : (
            <Paper>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>Product</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>SKU</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Stock</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {lowStockProductsList.map((p) => (
                      <TableRow key={p._id} hover>
                        <TableCell>{p.title}</TableCell>
                        <TableCell>{p.sku}</TableCell>
                        <TableCell>
                          <Typography
                            sx={{
                              color: p.stock <= 5 ? "error.main" : "warning.main",
                              fontWeight: "bold",
                            }}
                          >
                            {p.stock}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}
        </Box>

        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
            Latest Users
          </Typography>
          {latestUsers.length === 0 ? (
            <Paper sx={{ p: 3, textAlign: "center" }}>
              <Typography color="text.secondary">No users yet.</Typography>
            </Paper>
          ) : (
            <Paper sx={{ p: 2 }}>
              {latestUsers.map((u) => (
                <Box
                  key={u._id}
                  sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 1, borderBottom: "1px solid #eee" }}
                >
                  <InitialsAvatar name={u.name} />
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="body2" sx={{ fontWeight: "bold", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {u.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {u.email}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Joined {formatDate(u.createdAt)}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Paper>
          )}
        </Box>
      </Box>
    </Box>
  )
}
