import { NextRequest, NextResponse } from "next/server"
import { verifyAccessToken, type TokenPayload } from "@/lib/auth"
import { comparePassword, hashPassword } from "@/lib/auth"
import { connectDB } from "@/lib/db"
import { User } from "@/models"
import { error, success } from "@/lib/api-response"
import { MESSAGES } from "@/lib/messages"
import { HTTP } from "@/lib/http-status"
import { AUTH_COOKIE_CONFIG } from "@/constants"

export async function POST(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE_CONFIG.name)?.value
  if (!token) {
    return NextResponse.json(error(MESSAGES.NOT_AUTHENTICATED), { status: HTTP.UNAUTHORIZED })
  }

  let payload: TokenPayload
  try {
    payload = verifyAccessToken(token)
  } catch {
    return NextResponse.json(error(MESSAGES.INVALID_TOKEN), { status: HTTP.UNAUTHORIZED })
  }

  try {
    const body = await request.json()
    const { oldPassword, newPassword, confirmPassword } = body

    if (!oldPassword || typeof oldPassword !== "string") {
      return NextResponse.json(error("Validation failed", "Current password is required"), {
        status: HTTP.BAD_REQUEST,
      })
    }

    if (!newPassword || typeof newPassword !== "string" || newPassword.length < 6) {
      return NextResponse.json(error("Validation failed", "New password must be at least 6 characters"), {
        status: HTTP.BAD_REQUEST,
      })
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(error("Validation failed", "New passwords do not match"), {
        status: HTTP.BAD_REQUEST,
      })
    }

    if (oldPassword === newPassword) {
      return NextResponse.json(error("Validation failed", "New password cannot be same as current password"), {
        status: HTTP.BAD_REQUEST,
      })
    }

    await connectDB()

    const user = await User.findById(payload.userId)
    if (!user) {
      return NextResponse.json(error(MESSAGES.USER_NOT_FOUND), { status: HTTP.NOT_FOUND })
    }

    if (user.authProvider === "google") {
      return NextResponse.json(
        error("Action not allowed", "You signed up with Google. No password to change."),
        { status: HTTP.BAD_REQUEST },
      )
    }

    if (!user.password) {
      return NextResponse.json(error("Action not allowed", "No password set for this account."), {
        status: HTTP.BAD_REQUEST,
      })
    }

    const isOldPasswordValid = await comparePassword(oldPassword, user.password)
    if (!isOldPasswordValid) {
      return NextResponse.json(error("Current password is incorrect"), { status: HTTP.BAD_REQUEST })
    }

    user.password = await hashPassword(newPassword)
    await user.save()

    return NextResponse.json(success(null, "Password updated successfully"), { status: HTTP.OK })
  } catch {
    return NextResponse.json(error(MESSAGES.INTERNAL_ERROR), {
      status: HTTP.INTERNAL_SERVER_ERROR,
    })
  }
}
