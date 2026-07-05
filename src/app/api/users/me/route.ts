import { NextRequest, NextResponse } from "next/server"
import { verifyAccessToken, type TokenPayload } from "@/lib/auth"
import { AUTH_COOKIE_CONFIG } from "@/constants"
import { connectDB } from "@/lib/db"
import { userRepository } from "@/repositories/user.repository"
import { success, error } from "@/lib/api-response"
import { MESSAGES } from "@/lib/messages"
import { HTTP } from "@/lib/http-status"

export async function GET(request: NextRequest) {
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
    await connectDB()
    const user = await userRepository.findById(payload.userId)
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
      }),
      { status: HTTP.OK },
    )
  } catch {
    return NextResponse.json(error(MESSAGES.INTERNAL_ERROR), { status: HTTP.INTERNAL_SERVER_ERROR })
  }
}

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
    await connectDB()
    const body = await request.json()
    const allowedFields: Record<string, unknown> = {}

    if (typeof body.avatar === "string") allowedFields.avatar = body.avatar
    if (typeof body.name === "string") allowedFields.name = body.name.trim()

    if (Object.keys(allowedFields).length === 0) {
      return NextResponse.json(error("No valid fields to update"), { status: HTTP.BAD_REQUEST })
    }

    const user = await userRepository.update(payload.userId, allowedFields)
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
      }),
      { status: HTTP.OK },
    )
  } catch {
    return NextResponse.json(error(MESSAGES.INTERNAL_ERROR), { status: HTTP.INTERNAL_SERVER_ERROR })
  }
}
