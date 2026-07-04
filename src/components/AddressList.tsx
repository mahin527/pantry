"use client"

import { FaRegEdit } from "react-icons/fa"
import { Button } from "@mui/material"
import Radio from "@mui/material/Radio"
import { RiDeleteBin6Line } from "react-icons/ri"

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

function AddressList({
  addresses,
  onEdit,
  onDelete,
  onSetDefault,
}: {
  addresses?: Address[]
  onEdit?: (address: Address) => void
  onDelete?: (address: Address) => void
  onSetDefault?: (addressId: string) => void
}) {
  if (!addresses || addresses.length === 0) {
    return (
      <div className="py-10 px-6 text-center">
        <p className="text-gray-500 font-medium">No addresses yet.</p>
        <p className="text-gray-400 text-sm mt-1">Add your first address to get started.</p>
      </div>
    )
  }

  return (
    <div className="py-6 px-6 space-y-5">
      {addresses.map((address) => (
        <div
          key={address._id}
          className="flex justify-between py-4 border border-gray-200 w-full rounded-md shadow-md"
        >
          <div>
            <label className="flex items-center gap-2 text-blue-500 cursor-pointer font-bold">
              <Radio
                checked={address.isDefault}
                onChange={() => onSetDefault?.(address._id)}
                value={address._id}
                name="default-address"
              />
              {address.label}
            </label>
            <div className="info flex flex-col gap-2 pl-12 text-gray-600 font-medium">
              <span className="font-semibold">{address.fullName}</span>
              <span>
                {[address.street, address.area, address.city, address.country]
                  .filter(Boolean)
                  .join(", ")}
              </span>
              {address.postalCode && <span>Postal: {address.postalCode}</span>}
              <span>{address.phone}</span>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center">
            <Button
              className="py-5! rounded-full! font-bold!"
              onClick={() => onEdit?.(address)}
            >
              <FaRegEdit size={20} />
            </Button>
            <Button
              className="py-5! rounded-full! font-bold! text-red-600!"
              onClick={() => onDelete?.(address)}
            >
              <RiDeleteBin6Line size={20} />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AddressList
