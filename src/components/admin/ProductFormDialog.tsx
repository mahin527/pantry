"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm, Controller, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  createProductSchema,
  updateProductSchema,
  type CreateProductInput,
  type UpdateProductInput,
} from "@/validations/product.validation"
import {
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  FormControlLabel,
  MenuItem,
  IconButton,
  Typography,
  Box,
} from "@mui/material"
import { FaPlus, FaTrash } from "react-icons/fa"

export type Product = {
  _id: string
  title: string
  slug: string
  description: string
  shortDescription?: string
  category: string
  images?: string[]
  price: number
  discountPrice?: number
  stock: number
  sku: string
  brand?: string
  isFeatured: boolean
  isPopular: boolean
  isLatest: boolean
  isActive: boolean
  tags?: string[]
}

type ActiveCategory = {
  _id: string
  name: string
  slug: string
}

type Props = {
  open: boolean
  product: Product | null
  onClose: () => void
  onSaved: () => void
  showSnackbar: (message: string, severity: "success" | "error") => void
}

export function ProductFormDialog({ open, product, onClose, onSaved, showSnackbar }: Props) {
  const [saving, setSaving] = useState(false)
  const [categories, setCategories] = useState<ActiveCategory[]>([])
  const router = useRouter()
  const isEdit = !!product

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

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateProductInput | UpdateProductInput>({
    resolver: zodResolver(isEdit ? updateProductSchema : createProductSchema),
    defaultValues: isEdit
      ? {
          title: product.title,
          slug: product.slug,
          description: product.description,
          shortDescription: product.shortDescription ?? "",
          category: product.category,
          images: product.images ?? [""],
          price: product.price,
          discountPrice: product.discountPrice ?? undefined,
          stock: product.stock,
          sku: product.sku,
          brand: product.brand ?? "",
          isFeatured: product.isFeatured,
          isPopular: product.isPopular,
          isLatest: product.isLatest,
          isActive: product.isActive,
          tags: product.tags ?? [""],
        }
      : {
          title: "",
          slug: "",
          description: "",
          shortDescription: "",
          category: "",
          images: [""],
          price: 0,
          discountPrice: undefined,
          stock: 0,
          sku: "",
          brand: "",
          isFeatured: false,
          isPopular: false,
          isLatest: false,
          isActive: true,
          tags: [""],
        },
  })

  const {
    fields: imageFields,
    append: appendImage,
    remove: removeImage,
  } = useFieldArray({ control, name: "images" as never })

  const {
    fields: tagFields,
    append: appendTag,
    remove: removeTag,
  } = useFieldArray({ control, name: "tags" as never })

  const onSubmit = async (data: CreateProductInput | UpdateProductInput) => {
    setSaving(true)
    try {
      const method = isEdit ? "PATCH" : "POST"
      const url = isEdit ? `/api/admin/products/${product._id}` : "/api/admin/products"

      const cleaned = {
        ...data,
        images: (data as CreateProductInput).images?.filter(Boolean) ?? [],
        tags: (data as CreateProductInput).tags?.filter(Boolean) ?? [],
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleaned),
        credentials: "include",
      })

      if (res.status === 401 || res.status === 403) {
        router.push("/login")
        return
      }

      const json = await res.json()

      if (json.success) {
        showSnackbar(isEdit ? "Product updated" : "Product created", "success")
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
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>{isEdit ? "Edit Product" : "Add Product"}</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: "16px!important" }}>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Controller name="title" control={control} render={({ field }) => (
                <TextField {...field} label="Title" error={!!errors.title} helperText={errors.title?.message} fullWidth />
              )} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Controller name="slug" control={control} render={({ field }) => (
                <TextField {...field} label="Slug" error={!!errors.slug} helperText={errors.slug?.message} fullWidth />
              )} />
            </Box>
          </Box>

          <Controller name="description" control={control} render={({ field }) => (
            <TextField {...field} label="Description" multiline rows={3} error={!!errors.description} helperText={errors.description?.message} fullWidth />
          )} />

          <Controller name="shortDescription" control={control} render={({ field }) => (
            <TextField {...field} label="Short Description" multiline rows={2} error={!!errors.shortDescription} helperText={errors.shortDescription?.message} fullWidth />
          )} />

          <Box sx={{ display: "flex", gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Controller name="category" control={control} render={({ field }) => (
                <TextField {...field} select label="Category" error={!!errors.category} helperText={errors.category?.message} fullWidth>
                  {categories.map((cat) => (
                    <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>
                  ))}
                </TextField>
              )} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Controller name="brand" control={control} render={({ field }) => (
                <TextField {...field} label="Brand" error={!!errors.brand} helperText={errors.brand?.message} fullWidth />
              )} />
            </Box>
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Controller name="price" control={control} render={({ field }) => (
                <TextField {...field} label="Price" type="number" onChange={(e) => field.onChange(Number(e.target.value))}
                  error={!!errors.price} helperText={errors.price?.message} fullWidth />
              )} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Controller name="discountPrice" control={control} render={({ field }) => (
                <TextField {...field} label="Discount Price" type="number" value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                  error={!!errors.discountPrice} helperText={errors.discountPrice?.message} fullWidth />
              )} />
            </Box>
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Controller name="sku" control={control} render={({ field }) => (
                <TextField {...field} label="SKU" error={!!errors.sku} helperText={errors.sku?.message} fullWidth />
              )} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Controller name="stock" control={control} render={({ field }) => (
                <TextField {...field} label="Stock" type="number" onChange={(e) => field.onChange(Number(e.target.value))}
                  error={!!errors.stock} helperText={errors.stock?.message} fullWidth />
              )} />
            </Box>
          </Box>

          <Box>
            <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 600, color: "text.secondary" }}>Image URLs</Typography>
            {imageFields.map((field, idx) => (
              <Box key={field.id} sx={{ display: "flex", gap: 1, mb: 1 }}>
                <Controller name={`images.${idx}` as never} control={control} render={({ field: f }) => (
                  <TextField {...f} size="small" placeholder="https://..." fullWidth />
                )} />
                <IconButton color="error" onClick={() => removeImage(idx)} size="small"><FaTrash size={14} /></IconButton>
              </Box>
            ))}
            <Button size="small" startIcon={<FaPlus />} onClick={() => appendImage("" as never)}>Add Image</Button>
          </Box>

          <Box>
            <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 600, color: "text.secondary" }}>Tags</Typography>
            {tagFields.map((field, idx) => (
              <Box key={field.id} sx={{ display: "flex", gap: 1, mb: 1 }}>
                <Controller name={`tags.${idx}` as never} control={control} render={({ field: f }) => (
                  <TextField {...f} size="small" placeholder="Tag name" fullWidth />
                )} />
                <IconButton color="error" onClick={() => removeTag(idx)} size="small"><FaTrash size={14} /></IconButton>
              </Box>
            ))}
            <Button size="small" startIcon={<FaPlus />} onClick={() => appendTag("" as never)}>Add Tag</Button>
          </Box>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            <Controller name="isFeatured" control={control} render={({ field }) => (
              <FormControlLabel control={<Checkbox checked={field.value ?? false} onChange={(e) => field.onChange(e.target.checked)} />} label="Featured" />
            )} />
            <Controller name="isPopular" control={control} render={({ field }) => (
              <FormControlLabel control={<Checkbox checked={field.value ?? false} onChange={(e) => field.onChange(e.target.checked)} />} label="Popular" />
            )} />
            <Controller name="isLatest" control={control} render={({ field }) => (
              <FormControlLabel control={<Checkbox checked={field.value ?? false} onChange={(e) => field.onChange(e.target.checked)} />} label="Latest" />
            )} />
            <Controller name="isActive" control={control} render={({ field }) => (
              <FormControlLabel control={<Checkbox checked={field.value ?? true} onChange={(e) => field.onChange(e.target.checked)} />} label="Active" />
            )} />
          </Box>
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
