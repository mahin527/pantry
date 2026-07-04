"use client"

import { useState, useEffect, useCallback, useTransition } from "react"
import { useRouter } from "next/navigation"
import AccountSidebar from "@/components/AccountSidebar"
import AddressList from "@/components/AddressList"
import { Button } from "@mui/material"
import { FaPlus } from "react-icons/fa"
import { CircularProgress, Box, Snackbar, Alert } from "@mui/material"
import { AddressFormDialog } from "./AddressFormDialog"
import { DeleteCategoryDialog } from "@/components/admin/DeleteCategoryDialog"

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

export default function AddressPage() {
  const router = useRouter()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)

  const [formOpen, setFormOpen] = useState(false)
  const [editAddress, setEditAddress] = useState<Address | null>(null)

  const [deleteAddress, setDeleteAddress] = useState<Address | null>(null)

  const [, startTransition] = useTransition()

  const [snackbar, setSnackbar] = useState<{
    open: boolean
    message: string
    severity: "success" | "error"
  }>({ open: false, message: "", severity: "success" })

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbar({ open: true, message, severity })
  }

  const fetchAddresses = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/addresses", { credentials: "include" })
      if (res.status === 401 || res.status === 403) {
        router.push("/login")
        return
      }
      const json = await res.json()
      if (json.success && json.data) {
        setAddresses(json.data)
      }
    } catch {
      showSnackbar("Failed to load addresses", "error")
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    startTransition(() => {
      fetchAddresses()
    })
  }, [fetchAddresses])

  const handleSetDefault = async (addressId: string) => {
    try {
      const res = await fetch(`/api/addresses/${addressId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isDefault: true }),
        credentials: "include",
      })
      const json = await res.json()
      if (json.success) {
        fetchAddresses()
      } else {
        showSnackbar(json.message || "Failed to update", "error")
      }
    } catch {
      showSnackbar("Something went wrong", "error")
    }
  }

  return (
    <section className="bg-gray-100 py-8">
      <div className="container flex gap-5">
        <div className="w-[25%]">
          <AccountSidebar />
        </div>

        <div className="wrapper w-[75%] space-y-8">
          <div className="bg-white shadow-md rounded-md">
            <div className="py-4 px-6 border-b border-gray-200 flex items-center justify-between">
              <div className="space-y-2">
                <h3 className="text-xl lg:text-2xl text-gray-700 tracking-wider font-bold">
                  Address
                </h3>
                <p className="text-base lg:text-lg text-gray-600 tracking-wider font-bold">
                  Manage Your Addresses
                </p>
              </div>
              <div>
                <Button
                  onClick={() => { setEditAddress(null); setFormOpen(true) }}
                  variant="outlined"
                  className="font-bold! flex! items-center! gap-2!"
                >
                  <FaPlus size={16} /> Add new address
                </Button>
              </div>
            </div>
            <div>
              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <AddressList
                  addresses={addresses}
                  onEdit={(addr) => { setEditAddress(addr); setFormOpen(true) }}
                  onDelete={(addr) => setDeleteAddress(addr)}
                  onSetDefault={handleSetDefault}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {formOpen && (
        <AddressFormDialog
          open={formOpen}
          address={editAddress}
          onClose={() => { setFormOpen(false); setEditAddress(null) }}
          onSaved={() => { setFormOpen(false); setEditAddress(null); fetchAddresses() }}
          showSnackbar={showSnackbar}
        />
      )}

      {deleteAddress && (
        <DeleteCategoryDialog
          open={!!deleteAddress}
          title="Address"
          itemName={deleteAddress.fullName}
          endpoint={`/api/addresses/${deleteAddress._id}`}
          onClose={() => setDeleteAddress(null)}
          onDeleted={() => { setDeleteAddress(null); fetchAddresses() }}
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
    </section>
  )
}
