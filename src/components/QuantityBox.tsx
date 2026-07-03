"use client"
import { FaPlus } from "react-icons/fa6";
import { FaMinus } from "react-icons/fa6";
import { Button } from "@mui/material"
import { useState } from "react";

function QuantityBox() {
    const [qtyValue, setqtyValue] = useState(0)

    const minusQty = () => {
        if (qtyValue > 0) {
            setqtyValue(qtyValue - 1)
        }
    }

    const plusQty = () => {
        setqtyValue(qtyValue + 1)
    }

    return (
        <div className="flex items-center border border-gray-300 rounded-lg w-fit overflow-hidden">
            <Button className="py-3!" onClick={minusQty}>
                <FaMinus className="20" />
            </Button>

            <span className="px-3 font-bold text-base xl:text-lg text-gray-600">{qtyValue}</span>

            <Button className="py-3!" onClick={plusQty}>
                <FaPlus className="20" />
            </Button>
        </div>
    )
}

export default QuantityBox