import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { connectDB } from "@/lib/db"
import { User } from "@/models"
import { sendPasswordResetEmail } from "@/lib/email"
import { error, message } from "@/lib/api-response"
import { MESSAGES } from "@/lib/messages"
import { HTTP } from "@/lib/http-status"
import { rateLimit } from "@/lib/rate-limit"

const RESET_TOKEN_EXPIRY_MS = 60 * 60 * 1000 // 1 hour

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const { success, resetTime } = rateLimit(`forgot-password:${ip}`);
    if (!success) {
      return NextResponse.json(
        error(MESSAGES.VALIDATION_FAILED, "Too many requests. Please try again later."),
        {
          status: HTTP.TOO_MANY_REQUESTS,
          headers: { "Retry-After": String(Math.ceil((resetTime - Date.now()) / 1000)) },
        },
      );
    }

    const body = await request.json()
    const { email } = body

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(error("Validation failed", "Please provide a valid email address"), {
        status: HTTP.BAD_REQUEST,
      })
    }

    await connectDB()

    const user = await User.findOne({ email: email.toLowerCase().trim() })

    // Always return the same message regardless of whether user exists (security)
    const genericMessage = "If an account with this email exists, you will receive a password reset link."

    if (!user || user.authProvider !== "email") {
      // Still return success to prevent email enumeration
      return NextResponse.json(message(genericMessage), { status: HTTP.OK })
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex")
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex")

    // Store hashed token and expiry
    user.resetPasswordToken = hashedToken
    user.resetPasswordExpires = new Date(Date.now() + RESET_TOKEN_EXPIRY_MS)
    await user.save()

    // Send email with plain token
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`

    try {
      await sendPasswordResetEmail(email, resetUrl)
    } catch (emailError) {
      // Log but don't expose email send failure to user (security)
      console.error("Failed to send password reset email:", emailError)
    }

    return NextResponse.json(message(genericMessage), { status: HTTP.OK })
  } catch {
    return NextResponse.json(error(MESSAGES.INTERNAL_ERROR), {
      status: HTTP.INTERNAL_SERVER_ERROR,
    })
  }
}
