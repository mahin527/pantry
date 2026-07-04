"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from "@mui/material"

type Category = {
  _id: string
  name: string
}

type Props = {
  open: boolean
  category: Category
  onClose: () => void
  onDeleted: () => void
  showSnackbar: (message: string, severity: "success" | "error") => void
}

export function DeleteCategoryDialog({ open, category, onClose, onDeleted, showSnackbar }: Props) {
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/categories/${category._id}`, {
        method: "DELETE",
        credentials: "include",
      })

      if (res.status === 401 || res.status === 403) {
        router.push("/login")
        return
      }

      const json = await res.json()

      if (json.success) {
        showSnackbar("Category deleted", "success")
        onDeleted()
      } else {
        showSnackbar(json.message || "Failed to delete", "error")
      }
    } catch {
      showSnackbar("Something went wrong. Please try again.", "error")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Delete Category</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete <strong>{category.name}</strong>? This action cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={deleting}>Cancel</Button>
        <Button onClick={handleDelete} color="error" variant="contained" disabled={deleting}>
          {deleting ? "Deleting..." : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
