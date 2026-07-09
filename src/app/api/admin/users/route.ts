import { NextRequest, NextResponse } from "next/server"
import { authorizeAdmin } from "@/lib/authorize"
import { error } from "@/lib/api-response"
import { MESSAGES } from "@/lib/messages"
import { HTTP } from "@/lib/http-status"
import { parsePage, parseLimit } from "@/lib/query"
import { connectDB } from "@/lib/db"
import { User } from "@/models"

export async function GET(request: NextRequest) {
  const auth = await authorizeAdmin(request)
  if (!auth.authorized) return auth.response

  try {
    await connectDB()

    const { searchParams } = request.nextUrl
    const page = parsePage(searchParams.get("page"))
    const limit = parseLimit(searchParams.get("limit"))
    const skip = (page - 1) * limit

    const [users, total] = await Promise.all([
      User.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      User.countDocuments({}),
    ])

    return NextResponse.json(
      {
        success: true,
        data: {
          users: users.map((u) => ({
            _id: u._id.toString(),
            name: u.name,
            email: u.email,
            role: u.role,
            avatar: u.avatar,
            createdAt: (u.createdAt as Date).toISOString(),
          })),
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          },
        },
      },
      { status: HTTP.OK },
    )
  } catch {
    return NextResponse.json(error(MESSAGES.INTERNAL_ERROR), {
      status: HTTP.INTERNAL_SERVER_ERROR,
    })
  }
}