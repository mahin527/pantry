"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  createCategorySchema,
  updateCategorySchema,
  type CreateCategoryInput,
  type UpdateCategoryInput,
} from "@/validations/category.validation"
import {
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  FormControlLabel,
} from "@mui/material"

type Category = {
  _id: string
  name: string
  slug: string
  image?: string
  description?: string
  isActive: boolean
  sortOrder: number
}

type Props = {
  open: boolean
  category: Category | null
  onClose: () => void
  onSaved: () => void
  showSnackbar: (message: string, severity: "success" | "error") => void
}

export function CategoryFormDialog({ open, category, onClose, onSaved, showSnackbar }: Props) {
  const [saving, setSaving] = useState(false)
  const router = useRouter()
  const isEdit = !!category

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateCategoryInput | UpdateCategoryInput>({
    resolver: zodResolver(isEdit ? updateCategorySchema : createCategorySchema),
    defaultValues: isEdit
      ? {
          name: category.name,
          slug: category.slug,
          image: category.image ?? "",
          description: category.description ?? "",
          sortOrder: category.sortOrder,
          isActive: category.isActive,
        }
      : { name: "", slug: "", image: "", description: "", sortOrder: 0, isActive: true },
  })

  const onSubmit = async (data: CreateCategoryInput | UpdateCategoryInput) => {
    setSaving(true)
    try {
      const method = isEdit ? "PATCH" : "POST"
      const url = isEdit ? `/api/admin/categories/${category._id}` : "/api/admin/categories"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      })

      if (res.status === 401 || res.status === 403) {
        router.push("/login")
        return
      }

      const json = await res.json()

      if (json.success) {
        showSnackbar(isEdit ? "Category updated" : "Category created", "success")
        reset()
        onSaved()
      } else {
        showSnackbar(json.message || "Operation failed", "error")
      }
    } catch {
      showSnackbar("Something went wrong. Please try again.", "error")
    } finally {
      setSaving(false)
    }
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>{isEdit ? "Edit Category" : "Add Category"}</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: "16px!important" }}>
          <Controller name="name" control={control} render={({ field }) => (
            <TextField {...field} label="Name" error={!!errors.name} helperText={errors.name?.message} fullWidth />
          )} />
          <Controller name="slug" control={control} render={({ field }) => (
            <TextField {...field} label="Slug" error={!!errors.slug} helperText={errors.slug?.message} fullWidth />
          )} />
          <Controller name="image" control={control} render={({ field }) => (
            <TextField {...field} label="Image URL" error={!!errors.image} helperText={errors.image?.message} fullWidth />
          )} />
          <Controller name="description" control={control} render={({ field }) => (
            <TextField {...field} label="Description" multiline rows={3} error={!!errors.description} helperText={errors.description?.message} fullWidth />
          )} />
          <Controller name="sortOrder" control={control} render={({ field }) => (
            <TextField {...field} label="Sort Order" type="number"
              onChange={(e) => field.onChange(Number(e.target.value))}
              error={!!errors.sortOrder} helperText={errors.sortOrder?.message} fullWidth />
          )} />
          <Controller name="isActive" control={control} render={({ field }) => (
            <FormControlLabel control={
              <Checkbox checked={field.value ?? true} onChange={(e) => field.onChange(e.target.checked)} />
            } label="Active" />
          )} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
