"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa"
import { IoArrowBack } from "react-icons/io5"
import { Button, CircularProgress, Radio, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, FormLabel, RadioGroup, FormControlLabel } from "@mui/material"
import { useAppContext } from "@/providers/AppProvider"
import { useCart } from "@/hooks/useCart"
import { useRouter } from "next/navigation"
import { formatPrice } from "@/lib/utils"
import { toast } from "sonner"
import Link from "next/link"

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

function CheckoutPage() {
  const { openAddAddress, setOnAddressAdded } = useAppContext()
  const router = useRouter()
  const { items, subtotal, itemCount, loading: cartLoading, clearCart } = useCart()

  const [addresses, setAddresses] = useState<Address[]>([])
  const [addressLoading, setAddressLoading] = useState(true)
  const [selectedAddressId, setSelectedAddressId] = useState("")
  const [submitting, setSubmitting] = useState(false)

  // Edit address dialog
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [editForm, setEditForm] = useState({ fullName: "", phone: "", street: "", city: "", area: "", postalCode: "", label: "Home" })
  const [editSaving, setEditSaving] = useState(false)

  // Delete confirm dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingAddressId, setDeletingAddressId] = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const fetchAddresses = useCallback(async () => {
    try {
      const res = await fetch("/api/addresses", { credentials: "include" })
      if (res.status === 401 || res.status === 403) {
        router.push("/login")
        return
      }
      const json = await res.json()
      if (json?.success && json.data) {
        setAddresses(json.data)
        const defaultAddr = json.data.find((a: Address) => a.isDefault)
        if (defaultAddr) setSelectedAddressId(defaultAddr._id)
      }
    } catch {
      toast.error("Failed to load addresses")
    } finally {
      setAddressLoading(false)
    }
  }, [router])

  useEffect(() => {
    fetchAddresses()
    setOnAddressAdded(() => fetchAddresses)
    return () => setOnAddressAdded(null)
  }, [fetchAddresses, setOnAddressAdded])

  const shippingFee = subtotal >= 100 || subtotal === 0 ? 0 : 5.99
  const total = subtotal + shippingFee

  const placeOrder = async () => {
    if (!selectedAddressId) {
      toast.error("Please select a delivery address")
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ addressId: selectedAddressId }),
        credentials: "include",
      })

      if (res.status === 401 || res.status === 403) {
        router.push("/login")
        return
      }

      const json = await res.json()
      if (json.success) {
        toast.success("Order placed successfully!")
        clearCart()
        setTimeout(() => router.push("/my-orders"), 1000)
      } else {
        toast.error(json.message || "Failed to place order")
      }
    } catch {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const openEditDialog = (address: Address) => {
    setEditingAddress(address)
    setEditForm({
      fullName: address.fullName,
      phone: address.phone,
      street: address.street || "",
      city: address.city,
      area: address.area || "",
      postalCode: address.postalCode,
      label: address.label,
    })
    setEditDialogOpen(true)
  }

  const handleEditSave = async () => {
    if (!editingAddress) return
    if (!editForm.fullName.trim() || !editForm.phone.trim() || !editForm.city.trim() || !editForm.postalCode.trim()) {
      toast.error("Please fill all required fields")
      return
    }
    setEditSaving(true)
    try {
      const res = await fetch(`/api/addresses/${editingAddress._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(editForm),
      })
      const json = await res.json()
      if (json.success) {
        toast.success("Address updated")
        setEditDialogOpen(false)
        fetchAddresses()
      } else {
        toast.error(json.message || "Failed to update address")
      }
    } catch {
      toast.error("Failed to update address")
    } finally {
      setEditSaving(false)
    }
  }

  const openDeleteConfirm = (addressId: string) => {
    setDeletingAddressId(addressId)
    setDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!deletingAddressId) return
    setDeleteLoading(true)
    try {
      const res = await fetch(`/api/addresses/${deletingAddressId}`, {
        method: "DELETE",
        credentials: "include",
      })
      const json = await res.json()
      if (json.success) {
        toast.success("Address deleted")
        setDeleteDialogOpen(false)
        setDeletingAddressId(null)
        if (selectedAddressId === deletingAddressId) setSelectedAddressId("")
        fetchAddresses()
      } else {
        toast.error(json.message || "Failed to delete address")
      }
    } catch {
      toast.error("Failed to delete address")
    } finally {
      setDeleteLoading(false)
    }
  }

  const isLoading = cartLoading || addressLoading

  if (isLoading) {
    return (
      <section className="py-10 bg-gray-100 min-h-screen flex items-center justify-center">
        <CircularProgress />
      </section>
    )
  }

  if (items.length === 0) {
    return (
      <section className="py-10 bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-4">Add some items before checkout.</p>
          <Button variant="contained" href="/products">Browse Products</Button>
        </div>
      </section>
    )
  }

  return (
    <section className="py-10 bg-gray-100">
      <div className="container flex flex-col md:flex-row justify-between gap-5">
        <div className="w-full md:w-[65%] py-4 bg-white rounded-md border border-gray-200">
          <div className="px-6 space-y-3 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-xl lg:text-2xl text-gray-700 tracking-wider font-bold">
              Select Delivery Address
            </h3>
            <Button onClick={openAddAddress} variant="outlined" className="font-bold! flex! items-center! gap-2!">
              <FaPlus size={16} /> Add new address
            </Button>
          </div>

          <div className="py-4 px-6 space-y-4">
            {addresses.length === 0 ? (
              <p className="text-gray-500 text-center py-6">No addresses found. Add one to continue.</p>
            ) : (
              addresses.map((address) => (
                <div key={address._id}
                  className={`flex items-start gap-3 p-4 border rounded-md cursor-pointer transition-colors ${
                    selectedAddressId === address._id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedAddressId(address._id)}
                >
                  <Radio checked={selectedAddressId === address._id} readOnly />
                  <div className="flex-1 text-gray-600 font-medium">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-700">{address.label}</span>
                      {address.isDefault && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-bold">Default</span>
                      )}
                    </div>
                    <p className="font-semibold">{address.fullName}</p>
                    <p>{[address.street, address.area, address.city, address.country].filter(Boolean).join(", ")}</p>
                    <p>{address.phone}</p>
                  </div>
                  <div className="flex flex-col gap-2 shrink-0">
                    <button onClick={(e) => { e.stopPropagation(); openEditDialog(address); }}
                      className="text-blue-500 hover:text-blue-700 text-xs flex items-center gap-1 cursor-pointer">
                      <FaEdit /> Edit
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); openDeleteConfirm(address._id); }}
                      className="text-red-500 hover:text-red-700 text-xs flex items-center gap-1 cursor-pointer">
                      <FaTrash /> Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="w-full lg:w-[35%]">
          <div className="bg-white rounded-md border border-gray-200">
            <div className="py-4 border-b border-gray-200">
              <h3 className="px-5 text-xl lg:text-2xl text-gray-700 tracking-wider font-bold">Your Order</h3>
            </div>

            <div className="space-y-3 font-medium text-gray-600">
              <div className="px-5 py-3 flex items-center justify-between font-bold border-b border-gray-200">
                <span>Product</span>
                <span>Subtotal</span>
              </div>

              <div className="max-h-75 overflow-y-scroll">
                {items.map((item) => (
                  <div key={item.productId} className="flex px-5 py-2">
                    <div className="flex gap-3 w-[80%]">
                      <div className="w-[30%]">
                        <Image src={item.image} alt={item.title} width={100} height={100}
                          className="h-24 sm:h-25 md:26 w-full rounded-md object-cover" />
                      </div>
                      <div className="flex flex-col gap-2 w-[70%]">
                        <h4 className="truncate font-semibold">{item.title}</h4>
                        <p>Qty: <span className="font-semibold">{item.quantity}</span></p>
                      </div>
                    </div>
                    <div className="w-[20%] text-right">
                      <p className="font-semibold text-blue-500">{formatPrice(item.subtotal)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="px-5 flex items-center justify-between text-sm">
                <span>Subtotal ({itemCount} items)</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="px-5 flex items-center justify-between text-sm">
                <span>Shipping</span>
                <span>{shippingFee === 0 ? "Free" : formatPrice(shippingFee)}</span>
              </div>
              {subtotal > 0 && (
                <div className="px-5 flex items-center justify-between text-sm text-gray-400">
                  <span>Free shipping on orders over $100</span>
                  <span />
                </div>
              )}

              <div className="px-5 py-3 border-t border-gray-200 flex items-center justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-blue-500">{formatPrice(total)}</span>
              </div>

              <div className="px-5 py-3 flex flex-col gap-2">
                <Button variant="contained" className="w-full py-3! font-bold!"
                  disabled={submitting || !selectedAddressId} onClick={placeOrder}>
                  {submitting ? "Placing Order..." : "Place Order"}
                </Button>
                <Button variant="text" component={Link} href="/cart"
                  className="font-bold! flex! items-center! gap-2!" startIcon={<IoArrowBack />}>
                  Back to Cart
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Address Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Address</DialogTitle>
        <DialogContent>
          <div className="space-y-4 mt-2">
            <TextField label="Full Name" fullWidth value={editForm.fullName}
              onChange={(e) => setEditForm((f) => ({ ...f, fullName: e.target.value }))} />
            <TextField label="Phone" fullWidth value={editForm.phone}
              onChange={(e) => setEditForm((f) => ({ ...f, phone: e.target.value }))} />
            <TextField label="Street" fullWidth value={editForm.street}
              onChange={(e) => setEditForm((f) => ({ ...f, street: e.target.value }))} />
            <TextField label="City" fullWidth value={editForm.city}
              onChange={(e) => setEditForm((f) => ({ ...f, city: e.target.value }))} />
            <TextField label="Area" fullWidth value={editForm.area}
              onChange={(e) => setEditForm((f) => ({ ...f, area: e.target.value }))} />
            <TextField label="Postal Code" fullWidth value={editForm.postalCode}
              onChange={(e) => setEditForm((f) => ({ ...f, postalCode: e.target.value }))} />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleEditSave} disabled={editSaving}>
            {editSaving ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Delete Address?</DialogTitle>
        <DialogContent>
          <p className="text-gray-600">Are you sure you want to delete this address? This action cannot be undone.</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDelete} disabled={deleteLoading}>
            {deleteLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </section>
  )
}

export default CheckoutPage
