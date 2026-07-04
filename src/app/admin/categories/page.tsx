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
} from "@mui/material"
import { FaPlus, FaEdit, FaTrash, FaSearch } from "react-icons/fa"
import { CategoryFormDialog } from "@/components/admin/CategoryFormDialog"
import { DeleteCategoryDialog } from "@/components/admin/DeleteCategoryDialog"

type Category = {
  _id: string
  name: string
  slug: string
  image?: string
  description?: string
  isActive: boolean
  sortOrder: number
}

export default function AdminCategoriesPage() {
  const router = useRouter()

  const [categories, setCategories] = useState<Category[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState("")
  const [searchInput, setSearchInput] = useState("")
  const [loading, setLoading] = useState(true)

  const [formOpen, setFormOpen] = useState(false)
  const [editCategory, setEditCategory] = useState<Category | null>(null)
  const [deleteCategory, setDeleteCategory] = useState<Category | null>(null)

  const [snackbar, setSnackbar] = useState<{
    open: boolean
    message: string
    severity: "success" | "error"
  }>({ open: false, message: "", severity: "success" })
  const [, startTransition] = useTransition()

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbar({ open: true, message, severity })
  }

  const loadCategories = () => {
    setLoading(true)

    const params = new URLSearchParams()
    params.set("page", String(page + 1))
    params.set("limit", String(limit))
    if (search) params.set("search", search)

    fetch(`/api/admin/categories?${params}`, { credentials: "include" })
      .then((res) => {
        if (res.status === 401 || res.status === 403) {
          router.push("/login")
          return null
        }
        return res.json()
      })
      .then((json) => {
        if (json && json.success && json.data) {
          setCategories(json.data.categories)
          setTotal(json.data.pagination.total)
        }
      })
      .catch(() => showSnackbar("Failed to fetch categories", "error"))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    startTransition(() => {
      loadCategories()
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, search])

  const handleSearch = () => {
    setPage(0)
    setSearch(searchInput)
  }

  const openCreateForm = () => {
    setEditCategory(null)
    setFormOpen(true)
  }

  const openEditForm = (cat: Category) => {
    setEditCategory(cat)
    setFormOpen(true)
  }

  const openDelete = (cat: Category) => {
    setDeleteCategory(cat)
  }

  const onFormSaved = () => {
    setFormOpen(false)
    setEditCategory(null)
    loadCategories()
  }

  const onDeleted = () => {
    setDeleteCategory(null)
    loadCategories()
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" component="h4" sx={{ fontWeight: "bold" }}>Categories</Typography>
        <Button variant="contained" startIcon={<FaPlus />} onClick={openCreateForm}>
          Add Category
        </Button>
      </Box>

      <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
        <TextField
          size="small"
          placeholder="Search categories..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start"><FaSearch size={14} /></InputAdornment>
              ),
            },
          }}
          sx={{ width: 300 }}
        />
        <Button variant="outlined" onClick={handleSearch}>Search</Button>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : categories.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography color="text.secondary">No categories found.</Typography>
        </Paper>
      ) : (
        <Paper>
          <TableContainer sx={{ overflowX: "auto" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Slug</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Active</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Sort Order</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categories.map((cat) => (
                  <TableRow key={cat._id} hover>
                    <TableCell>{cat.name}</TableCell>
                    <TableCell>{cat.slug}</TableCell>
                    <TableCell>{cat.isActive ? "Yes" : "No"}</TableCell>
                    <TableCell>{cat.sortOrder}</TableCell>
                    <TableCell>
                      <IconButton color="primary" onClick={() => openEditForm(cat)}>
                        <FaEdit size={16} />
                      </IconButton>
                      <IconButton color="error" onClick={() => openDelete(cat)}>
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
        <CategoryFormDialog
          open={formOpen}
          category={editCategory}
          onClose={() => { setFormOpen(false); setEditCategory(null) }}
          onSaved={onFormSaved}
          showSnackbar={showSnackbar}
        />
      )}

      {deleteCategory && (
        <DeleteCategoryDialog
          open={!!deleteCategory}
          title="Category"
          itemName={deleteCategory.name}
          endpoint={`/api/admin/categories/${deleteCategory._id}`}
          onClose={() => setDeleteCategory(null)}
          onDeleted={onDeleted}
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
