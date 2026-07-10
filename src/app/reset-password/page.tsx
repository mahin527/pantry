import type { Metadata } from "next"
import { Suspense } from "react"
import ResetPasswordForm from "./ResetPasswordForm"

export const metadata: Metadata = {
  title: "Reset Password - Pantry",
  description: "Set a new password",
  openGraph: {
    title: "Reset Password - Pantry",
    description: "Set a new password",
    type: "website",
  },
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  )
}
