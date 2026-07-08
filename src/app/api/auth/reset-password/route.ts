import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { connectDB } from "@/lib/db"
import { User } from "@/models"
import { hashPassword } from "@/lib/auth"
import { error, success } from "@/lib/api-response"
import { MESSAGES } from "@/lib/messages"
import { HTTP } from "@/lib/http-status"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, password } = body

    // --- Validate ---
    if (!token || typeof token !== "string") {
      return NextResponse.json(error("Validation failed", "Reset token is required"), {
        status: HTTP.BAD_REQUEST,
      })
    }

    if (!password || typeof password !== "string" || password.length < 6) {
      return NextResponse.json(error("Validation failed", "Password must be at least 6 characters"), {
        status: HTTP.BAD_REQUEST,
      })
    }

    await connectDB()

    // Hash the incoming token to match against stored hash
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex")

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    })

    if (!user) {
      return NextResponse.json(error("Invalid or expired reset token"), {
        status: HTTP.BAD_REQUEST,
      })
    }

    // Hash new password and update user
    user.password = await hashPassword(password)
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined
    await user.save()

    return NextResponse.json(success(null, "Password has been reset successfully"), {
      status: HTTP.OK,
    })
  } catch {
    return NextResponse.json(error(MESSAGES.INTERNAL_ERROR), {
      status: HTTP.INTERNAL_SERVER_ERROR,
    })
  }
}
