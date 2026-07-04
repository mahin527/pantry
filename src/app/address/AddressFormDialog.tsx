"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  createAddressSchema,
  updateAddressSchema,
  type CreateAddressInput,
  type UpdateAddressInput,
} from "@/validations/address.validation"
import {
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Box,
} from "@mui/material"

type Address = {
  _id: string
  fullName: string
  phone: string
  country: string
  city: string
  area?: string
  street?: string
  postalCode: string
  label: string
  isDefault: boolean
}

type Props = {
  open: boolean
  address: Address | null
  onClose: () => void
  onSaved: () => void
  showSnackbar: (message: string, severity: "success" | "error") => void
}

export function AddressFormDialog({ open, address, onClose, onSaved, showSnackbar }: Props) {
  const [saving, setSaving] = useState(false)
  const router = useRouter()
  const isEdit = !!address

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateAddressInput | UpdateAddressInput>({
    resolver: zodResolver(isEdit ? updateAddressSchema : createAddressSchema),
    defaultValues: isEdit
      ? {
          fullName: address.fullName,
          phone: address.phone,
          country: address.country,
          city: address.city,
          area: address.area ?? "",
          street: address.street ?? "",
          postalCode: address.postalCode,
          label: address.label as "Home" | "Office" | "Other",
          isDefault: address.isDefault,
        }
      : {
          fullName: "",
          phone: "",
          country: "",
          city: "",
          area: "",
          street: "",
          postalCode: "",
          label: "Home",
          isDefault: false,
        },
  })

  const onSubmit = async (data: CreateAddressInput | UpdateAddressInput) => {
    setSaving(true)
    try {
      const method = isEdit ? "PATCH" : "POST"
      const url = isEdit ? `/api/addresses/${address._id}` : "/api/addresses"

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
        showSnackbar(isEdit ? "Address updated" : "Address added", "success")
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
        <DialogTitle>{isEdit ? "Edit Address" : "Add Address"}</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: "16px!important" }}>
          <Controller name="fullName" control={control} render={({ field }) => (
            <TextField {...field} label="Full Name" error={!!errors.fullName} helperText={errors.fullName?.message} fullWidth />
          )} />
          <Controller name="phone" control={control} render={({ field }) => (
            <TextField {...field} label="Phone" error={!!errors.phone} helperText={errors.phone?.message} fullWidth />
          )} />
          <Box sx={{ display: "flex", gap: 2 }}>
            <Controller name="country" control={control} render={({ field }) => (
              <TextField {...field} label="Country" error={!!errors.country} helperText={errors.country?.message} fullWidth />
            )} />
            <Controller name="city" control={control} render={({ field }) => (
              <TextField {...field} label="City" error={!!errors.city} helperText={errors.city?.message} fullWidth />
            )} />
          </Box>
          <Controller name="street" control={control} render={({ field }) => (
            <TextField {...field} label="Street" error={!!errors.street} helperText={errors.street?.message} fullWidth />
          )} />
          <Box sx={{ display: "flex", gap: 2 }}>
            <Controller name="area" control={control} render={({ field }) => (
              <TextField {...field} label="Area" error={!!errors.area} helperText={errors.area?.message} fullWidth />
            )} />
            <Controller name="postalCode" control={control} render={({ field }) => (
              <TextField {...field} label="Postal Code" error={!!errors.postalCode} helperText={errors.postalCode?.message} fullWidth />
            )} />
          </Box>
          <Controller name="label" control={control} render={({ field }) => (
            <FormControl>
              <FormLabel>Address Type</FormLabel>
              <RadioGroup row value={field.value} onChange={(e) => field.onChange(e.target.value)}>
                <FormControlLabel value="Home" control={<Radio />} label="Home" />
                <FormControlLabel value="Office" control={<Radio />} label="Office" />
                <FormControlLabel value="Other" control={<Radio />} label="Other" />
              </RadioGroup>
            </FormControl>
          )} />
          <Controller name="isDefault" control={control} render={({ field }) => (
            <FormControlLabel
              control={<Checkbox checked={field.value ?? false} onChange={(e) => field.onChange(e.target.checked)} />}
              label="Set as default address"
            />
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


