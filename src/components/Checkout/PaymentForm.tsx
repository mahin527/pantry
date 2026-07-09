"use client"

import { useState } from "react"
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js"
import { Button, CircularProgress } from "@mui/material"
import { toast } from "sonner"

type Props = {
  amount: number
  onSuccess: (paymentIntentId: string) => void
  onBack: () => void
}

export function PaymentForm({ amount, onSuccess, onBack }: Props) {
  const stripe = useStripe()
  const elements = useElements()
  const [processing, setProcessing] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setProcessing(true)
    try {
      const res = await fetch("/api/payments/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ amount }),
      })
      const json = await res.json()
      if (!json.success) {
        toast.error(json.message || "Failed to initialize payment")
        setProcessing(false)
        return
      }

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        json.clientSecret,
        {
          payment_method: { card: elements.getElement(CardElement)! },
        },
      )

      if (stripeError) {
        toast.error(stripeError.message || "Payment failed")
        setProcessing(false)
        return
      }

      if (paymentIntent?.status === "succeeded") {
        toast.success("Payment successful!")
        onSuccess(paymentIntent.id)
      } else {
        toast.error("Payment was not completed")
        setProcessing(false)
      }
    } catch {
      toast.error("Something went wrong")
      setProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 border border-gray-200 rounded-md bg-white">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#374151",
                "::placeholder": { color: "#9CA3AF" },
              },
              invalid: { color: "#DC2626" },
            },
          }}
        />
      </div>
      <div className="flex gap-2">
        <Button variant="outlined" onClick={onBack} className="flex-1 font-bold!" disabled={processing}>
          Back
        </Button>
        <Button
          type="submit"
          variant="contained"
          className="flex-1 font-bold! py-3!"
          disabled={!stripe || processing}
        >
          {processing ? <CircularProgress size={20} color="inherit" /> : `Pay $${amount.toFixed(2)}`}
        </Button>
      </div>
    </form>
  )
}