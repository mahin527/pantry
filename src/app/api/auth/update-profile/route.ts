import { NextRequest, NextResponse } from "next/server"
import { verifyAccessToken, type TokenPayload } from "@/lib/auth"
import { AUTH_COOKIE_CONFIG } from "@/constants"
import { connectDB } from "@/lib/db"
import { userRepository } from "@/repositories/user.repository"
import { success, error } from "@/lib/api-response"
import { MESSAGES } from "@/lib/messages"
import { HTTP } from "@/lib/http-status"

export async function PATCH(request: NextRequest) {
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
    const { name } = body

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(error("Validation failed", "Name must be at least 2 characters"), {
        status: HTTP.BAD_REQUEST,
      })
    }

    await connectDB()

    const user = await userRepository.update(payload.userId, { name: name.trim() })
    if (!user) {
      return NextResponse.json(error(MESSAGES.USER_NOT_FOUND), { status: HTTP.NOT_FOUND })
    }

    return NextResponse.json(
      success({
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      }, "Profile updated successfully"),
      { status: HTTP.OK },
    )
  } catch {
    return NextResponse.json(error(MESSAGES.INTERNAL_ERROR), {
      status: HTTP.INTERNAL_SERVER_ERROR,
    })
  }
}
