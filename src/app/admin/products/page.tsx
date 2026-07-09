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
} from "@mui/material"
import { FaPlus, FaEdit, FaTrash, FaSearch } from "react-icons/fa"
import { ProductFormDialog, type Product as ProductFull } from "@/components/admin/ProductFormDialog"
import { DeleteCategoryDialog } from "@/components/admin/DeleteCategoryDialog"

type Product = ProductFull & {
  category: { _id: string; name: string } | string
}

type ActiveCategory = {
  _id: string
  name: string
}

function parseBool(value: string | null): boolean | undefined {
  if (value === "true") return true
  if (value === "false") return false
  return undefined
}

export default function AdminProductsPage() {
  const router = useRouter()

  const [products, setProducts] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState("")
  const [searchInput, setSearchInput] = useState("")
  const [loading, setLoading] = useState(true)

  const [filterCat, setFilterCat] = useState("")
  const [filterFeatured, setFilterFeatured] = useState("")
  const [filterActive, setFilterActive] = useState("")
  const [categories, setCategories] = useState<ActiveCategory[]>([])

  const [formOpen, setFormOpen] = useState(false)
  const [editProduct, setEditProduct] = useState<Product | null>(null)

  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null)

  const [snackbar, setSnackbar] = useState<{
    open: boolean
    message: string
    severity: "success" | "error"
  }>({ open: false, message: "", severity: "success" })
  const [, startTransition] = useTransition()

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbar({ open: true, message, severity })
  }

  useEffect(() => {
    fetch("/api/admin/categories?limit=100", { credentials: "include" })
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setCategories(json.data.categories)
        }
      })
      .catch(() => {})
  }, [])

  const loadProducts = () => {
    setLoading(true)

    const params = new URLSearchParams()
    params.set("page", String(page + 1))
    params.set("limit", String(limit))
    if (search) params.set("search", search)
    if (filterCat) params.set("category", filterCat)
    const featured = parseBool(filterFeatured)
    if (featured !== undefined) params.set("featured", String(featured))
    const active = parseBool(filterActive)
    if (active !== undefined) params.set("active", String(active))

    fetch(`/api/admin/products?${params}`, { credentials: "include" })
      .then((res) => {
        if (res.status === 401 || res.status === 403) {
          router.push("/login")
          return null
        }
        return res.json()
      })
      .then((json) => {
        if (json && json.success && json.data) {
          setProducts(json.data.products)
          setTotal(json.data.pagination.total)
        }
      })
      .catch(() => showSnackbar("Failed to fetch products", "error"))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    startTransition(() => {
      loadProducts()
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, search, filterCat, filterFeatured, filterActive])

  const handleSearch = () => {
    setPage(0)
    setSearch(searchInput)
  }

  const clearFilters = () => {
    setFilterCat("")
    setFilterFeatured("")
    setFilterActive("")
    setPage(0)
  }

  const getCategoryName = (cat: { _id: string; name: string } | string): string => {
    if (typeof cat === "object" && cat !== null) return cat.name
    const found = categories.find((c) => c._id === cat)
    return found?.name ?? cat
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" component="h4" sx={{ fontWeight: "bold" }}>Products</Typography>
        <Button variant="contained" startIcon={<FaPlus />} onClick={() => { setEditProduct(null); setFormOpen(true) }}>
          Add Product
        </Button>
      </Box>

      <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap", alignItems: "center" }}>
        <TextField
          size="small"
          placeholder="Search products..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          slotProps={{
            input: {
              startAdornment: <InputAdornment position="start"><FaSearch size={14} /></InputAdornment>,
            },
          }}
          sx={{ width: 220 }}
        />
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Category</InputLabel>
          <Select value={filterCat} label="Category" onChange={(e) => setFilterCat(e.target.value)}>
            <MenuItem value="">All</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 110 }}>
          <InputLabel>Featured</InputLabel>
          <Select value={filterFeatured} label="Featured" onChange={(e) => setFilterFeatured(e.target.value)}>
            <MenuItem value="">All</MenuItem>
            <MenuItem value="true">Featured</MenuItem>
            <MenuItem value="false">Not Featured</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 110 }}>
          <InputLabel>Active</InputLabel>
          <Select value={filterActive} label="Active" onChange={(e) => setFilterActive(e.target.value)}>
            <MenuItem value="">All</MenuItem>
            <MenuItem value="true">Active</MenuItem>
            <MenuItem value="false">Inactive</MenuItem>
          </Select>
        </FormControl>
        <Button variant="outlined" size="small" onClick={handleSearch}>Search</Button>
        {(filterCat || filterFeatured || filterActive || search) && (
          <Button size="small" onClick={clearFilters}>Clear</Button>
        )}
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : products.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography color="text.secondary">No products found.</Typography>
        </Paper>
      ) : (
        <Paper>
          <TableContainer sx={{ overflowX: "auto" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Title</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Price</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Stock</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((p) => (
                  <TableRow key={p._id} hover>
                    <TableCell>{p.title}</TableCell>
                    <TableCell>{getCategoryName(p.category)}</TableCell>
                    <TableCell>${p.price}</TableCell>
                    <TableCell>{p.stock}</TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                        {p.isActive && <Chip label="Active" size="small" color="success" variant="outlined" />}
                        {!p.isActive && <Chip label="Inactive" size="small" color="default" variant="outlined" />}
                        {p.isFeatured && <Chip label="Featured" size="small" color="primary" variant="outlined" />}
                        {p.isPopular && <Chip label="Popular" size="small" color="secondary" variant="outlined" />}
                        {p.isLatest && <Chip label="Latest" size="small" color="info" variant="outlined" />}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <IconButton color="primary" onClick={() => {
                        const catId = typeof p.category === "string" ? p.category : (p.category as { _id: string })._id
                        setEditProduct({ ...p, category: catId } as Product)
                        setFormOpen(true)
                      }}>
                        <FaEdit size={16} />
                      </IconButton>
                      <IconButton color="error" onClick={() => setDeleteProduct(p)}>
                        <FaTrash size={16} />
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
            onPageChange={(_, newPage) => setPage(newPage)}
            rowsPerPage={limit}
            onRowsPerPageChange={(e) => { setLimit(parseInt(e.target.value, 10)); setPage(0) }}
            rowsPerPageOptions={[5, 10, 25, 50]}
          />
        </Paper>
      )}

      {formOpen && (
        <ProductFormDialog
          open={formOpen}
          product={editProduct as unknown as ProductFull | null}
          onClose={() => { setFormOpen(false); setEditProduct(null) }}
          onSaved={() => { setFormOpen(false); setEditProduct(null); loadProducts() }}
          showSnackbar={showSnackbar}
        />
      )}

      {deleteProduct && (
        <DeleteCategoryDialog
          open={!!deleteProduct}
          title="Product"
          itemName={deleteProduct.title}
          endpoint={`/api/admin/products/${deleteProduct._id}`}
          onClose={() => setDeleteProduct(null)}
          onDeleted={() => { setDeleteProduct(null); loadProducts() }}
          showSnackbar={showSnackbar}
        />
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}
