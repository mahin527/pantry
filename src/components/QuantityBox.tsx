"use client"

import { useState } from "react"
import { FaPlus } from "react-icons/fa6"
import { FaMinus } from "react-icons/fa6"
import { Button } from "@mui/material"

function QuantityBox({
  value,
  disabled,
  onChange,
}: {
  value?: number
  disabled?: boolean
  onChange?: (val: number) => void
}) {
  const [qtyValue, setqtyValue] = useState(value ?? 1)

  const minusQty = () => {
    if (qtyValue > 1) {
      const next = qtyValue - 1
      setqtyValue(next)
      onChange?.(next)
    }
  }

  const plusQty = () => {
    const next = qtyValue + 1
    setqtyValue(next)
    onChange?.(next)
  }

  return (
    <div className="flex items-center border border-gray-300 rounded-lg w-fit overflow-hidden">
      <Button className="py-3!" onClick={minusQty} disabled={disabled} aria-label="Decrease quantity">
        <FaMinus className="20" />
      </Button>
      <span className="px-3 font-bold text-base xl:text-lg text-gray-600" aria-live="polite" aria-atomic="true">{qtyValue}</span>
      <Button className="py-3!" onClick={plusQty} disabled={disabled} aria-label="Increase quantity">
        <FaPlus className="20" />
      </Button>
    </div>
  )
}

export default QuantityBox
