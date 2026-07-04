"use client"

import { useState, useEffect, useTransition } from "react"
import { useRouter } from "next/navigation"
import {
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Snackbar,
  Alert,
  IconButton,
  Typography,
  CircularProgress,
  Box,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material"
import { FaSearch, FaEye } from "react-icons/fa"
import { formatPrice, formatDate } from "@/lib/utils"
import { STATUS_COLORS } from "@/constants"

type OrderItem = {
  product: { _id: string; title: string; slug: string; price: number; images: string[]; brand?: string }
  title: string
  quantity: number
  price: number
  image: string
}

type ShippingAddress = {
  fullName: string
  phone: string
  country: string
  city: string
  area: string
  street: string
  postalCode: string
  label: string
}

type User = {
  _id: string
  name: string
  email: string
}

type Order = {
  _id: string
  user: User
  items: OrderItem[]
  shippingAddress: ShippingAddress
  subtotal: number
  shippingFee: number
  discount: number
  total: number
  paymentMethod: string
  paymentStatus: string
  orderStatus: string
  createdAt: string
}

const allowedStatuses = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"]

export default function AdminOrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState("")
  const [searchInput, setSearchInput] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [filterPayment, setFilterPayment] = useState("")
  const [loading, setLoading] = useState(true)

  const [detailOrder, setDetailOrder] = useState<Order | null>(null)
  const [newStatus, setNewStatus] = useState("")

  const [snackbar, setSnackbar] = useState<{
    open: boolean
    message: string
    severity: "success" | "error"
  }>({ open: false, message: "", severity: "success" })
  const [, startTransition] = useTransition()

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbar({ open: true, message, severity })
  }

  const loadOrders = () => {
    setLoading(true)
    const params = new URLSearchParams()
    params.set("page", String(page + 1))
    params.set("limit", String(limit))
    if (search) params.set("search", search)
    if (filterStatus) params.set("status", filterStatus)
    if (filterPayment) params.set("paymentStatus", filterPayment)

    fetch(`/api/admin/orders?${params}`, { credentials: "include" })
      .then((res) => {
        if (res.status === 401 || res.status === 403) {
          router.push("/login")
          return null
        }
        return res.json()
      })
      .then((json) => {
        if (json && json.success && json.data) {
          setOrders(json.data.orders)
          setTotal(json.data.pagination.total)
        }
      })
      .catch(() => showSnackbar("Failed to load orders", "error"))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    startTransition(() => loadOrders())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, search, filterStatus, filterPayment])

  const handleUpdateStatus = async () => {
    if (!detailOrder || !newStatus) return
    try {
      const res = await fetch(`/api/admin/orders/${detailOrder._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderStatus: newStatus }),
        credentials: "include",
      })
      const json = await res.json()
      if (json.success) {
        showSnackbar("Order status updated", "success")
        setDetailOrder(null)
        loadOrders()
      } else {
        showSnackbar(json.message || "Failed to update", "error")
      }
    } catch {
      showSnackbar("Something went wrong", "error")
    }
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h4" sx={{ fontWeight: "bold", mb: 3 }}>
        Orders
      </Typography>

      <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap", alignItems: "center" }}>
        <TextField
          size="small"
          placeholder="Search order ID..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (setSearch(searchInput), setPage(0))}
          slotProps={{
            input: {
              startAdornment: <InputAdornment position="start"><FaSearch size={14} /></InputAdornment>,
            },
          }}
          sx={{ width: 220 }}
        />
        <FormControl size="small" sx={{ minWidth: 130 }}>
          <InputLabel>Status</InputLabel>
          <Select value={filterStatus} label="Status" onChange={(e) => { setFilterStatus(e.target.value); setPage(0) }}>
            <MenuItem value="">All</MenuItem>
            {allowedStatuses.map((s) => (
              <MenuItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 130 }}>
          <InputLabel>Payment</InputLabel>
          <Select value={filterPayment} label="Payment" onChange={(e) => { setFilterPayment(e.target.value); setPage(0) }}>
            <MenuItem value="">All</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="paid">Paid</MenuItem>
            <MenuItem value="failed">Failed</MenuItem>
            <MenuItem value="refunded">Refunded</MenuItem>
          </Select>
        </FormControl>
        <Button variant="outlined" size="small" onClick={() => { setSearch(searchInput); setPage(0) }}>Search</Button>
        {(search || filterStatus || filterPayment) && (
          <Button size="small" onClick={() => { setSearch(""); setSearchInput(""); setFilterStatus(""); setFilterPayment(""); setPage(0) }}>Clear</Button>
        )}
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}><CircularProgress /></Box>
      ) : orders.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}><Typography color="text.secondary">No orders found.</Typography></Paper>
      ) : (
        <Paper>
          <TableContainer sx={{ overflowX: "auto" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Order ID</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Customer</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Total</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Payment</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((o) => (
                  <TableRow key={o._id} hover>
                    <TableCell sx={{ fontFamily: "monospace", fontSize: "0.75rem" }}>
                      #{o._id.slice(-8).toUpperCase()}
                    </TableCell>
                    <TableCell>{o.user?.name ?? "—"}</TableCell>
                    <TableCell>{formatDate(o.createdAt)}</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>{formatPrice(o.total)}</TableCell>
                    <TableCell>
                      <Chip label={o.paymentStatus.charAt(0).toUpperCase() + o.paymentStatus.slice(1)} size="small" color={STATUS_COLORS[o.paymentStatus] ?? "default"} variant="outlined" />
                    </TableCell>
                    <TableCell>
                      <Chip label={o.orderStatus.charAt(0).toUpperCase() + o.orderStatus.slice(1)} size="small" color={STATUS_COLORS[o.orderStatus] ?? "default"} />
                    </TableCell>
                    <TableCell>
                      <IconButton color="primary" onClick={() => { setDetailOrder(o); setNewStatus(o.orderStatus) }} aria-label={`View order ${o._id.slice(-8).toUpperCase()}`}>
                        <FaEye size={16} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={total}
            page={page}
            onPageChange={(_, np) => setPage(np)}
            rowsPerPage={limit}
            onRowsPerPageChange={(e) => { setLimit(parseInt(e.target.value, 10)); setPage(0) }}
            rowsPerPageOptions={[5, 10, 25, 50]}
          />
        </Paper>
      )}

      <Dialog open={!!detailOrder} onClose={() => setDetailOrder(null)} maxWidth="md" fullWidth>
        {detailOrder && (
          <>
            <DialogTitle>Order #{detailOrder._id.slice(-8).toUpperCase()}</DialogTitle>
            <DialogContent dividers>
              <Typography variant="subtitle2" sx={{ mt: 1, fontWeight: "bold" }}>Customer</Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>{detailOrder.user?.name} ({detailOrder.user?.email})</Typography>

              <Typography variant="subtitle2" sx={{ mt: 2, fontWeight: "bold" }}>Shipping Address</Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                {detailOrder.shippingAddress.fullName}, {detailOrder.shippingAddress.phone}
                <br />
                {[detailOrder.shippingAddress.street, detailOrder.shippingAddress.area, detailOrder.shippingAddress.city, detailOrder.shippingAddress.country].filter(Boolean).join(", ")}
                <br />
                {detailOrder.shippingAddress.postalCode} ({detailOrder.shippingAddress.label})
              </Typography>

              <Typography variant="subtitle2" sx={{ mt: 2, fontWeight: "bold" }}>Products</Typography>
              {detailOrder.items.map((item, idx) => (
                <Box key={idx} sx={{ display: "flex", justifyContent: "space-between", py: 0.5, borderBottom: "1px solid #eee" }}>
                  <Typography variant="body2">{item.title} × {item.quantity}</Typography>
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>{formatPrice(item.price * item.quantity)}</Typography>
                </Box>
              ))}

              <Box sx={{ mt: 2, borderTop: "1px solid #ddd", pt: 1 }}>
                <Typography variant="body2">Subtotal: {formatPrice(detailOrder.subtotal)}</Typography>
                <Typography variant="body2">Shipping: {detailOrder.shippingFee === 0 ? "Free" : formatPrice(detailOrder.shippingFee)}</Typography>
                <Typography variant="body2">Discount: {formatPrice(detailOrder.discount)}</Typography>
                <Typography variant="body2" sx={{ fontWeight: "bold", fontSize: "1rem" }}>Total: {formatPrice(detailOrder.total)}</Typography>
              </Box>

              <Typography variant="subtitle2" sx={{ mt: 2, fontWeight: "bold" }}>Payment</Typography>
              <Typography variant="body2">{detailOrder.paymentMethod.toUpperCase()} — <Chip label={detailOrder.paymentStatus} size="small" color={STATUS_COLORS[detailOrder.paymentStatus] ?? "default"} variant="outlined" /></Typography>

              <Typography variant="subtitle2" sx={{ mt: 2, fontWeight: "bold" }}>Order Status</Typography>
              <FormControl size="small" sx={{ minWidth: 160, mt: 0.5 }}>
                <Select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                  {allowedStatuses.map((s) => (
                    <MenuItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Typography variant="caption" component="span" sx={{ mt: 2, color: "text.secondary", display: "block" }}>
                Created: {new Date(detailOrder.createdAt).toLocaleString()}
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDetailOrder(null)}>Cancel</Button>
              <Button variant="contained" onClick={handleUpdateStatus} disabled={newStatus === detailOrder.orderStatus}>Save</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={() => setSnackbar((s) => ({ ...s, open: false }))} severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}
