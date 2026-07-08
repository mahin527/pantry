import { NextRequest, NextResponse } from "next/server"
import { verifyAccessToken, type TokenPayload } from "@/lib/auth"
import { cloudinaryStorage, deleteFromCloudinary } from "@/lib/cloudinary"
import { error } from "@/lib/api-response"
import { HTTP } from "@/lib/http-status"
import { AUTH_COOKIE_CONFIG } from "@/constants"
import { connectDB } from "@/lib/db"
import { User } from "@/models"

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
const MAX_SIZE = 5 * 1024 * 1024 // 5MB

export async function POST(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE_CONFIG.name)?.value
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: HTTP.UNAUTHORIZED })
  }

  let payload: TokenPayload
  try {
    payload = verifyAccessToken(token)
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: HTTP.UNAUTHORIZED })
  }

  // --- Validate file ---
  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return NextResponse.json(error("Invalid form data"), { status: HTTP.BAD_REQUEST })
  }

  const file = formData.get("file") as File | null
  if (!file) {
    return NextResponse.json(error("No file provided"), { status: HTTP.BAD_REQUEST })
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      error("Invalid file type. Allowed: jpg, jpeg, png, webp"),
      { status: HTTP.BAD_REQUEST },
    )
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      error("File too large. Maximum size is 5MB"),
      { status: HTTP.BAD_REQUEST },
    )
  }

  // --- 1. Upload new avatar to Cloudinary ---
  const folder = (formData.get("folder") as string) || "avatars"
  let result: { url: string; publicId: string }
  try {
    result = await cloudinaryStorage.uploadImage(file, folder)
  } catch {
    return NextResponse.json(error("Upload failed"), {
      status: HTTP.INTERNAL_SERVER_ERROR,
    })
  }

  // --- 2. Upload succeeded → connect DB, get old publicId ---
  await connectDB()
  const user = await User.findById(payload.userId)
  const oldPublicId = user?.avatarPublicId

  // --- 3. Update user with new avatar URL and publicId ---
  if (user) {
    user.avatar = result.url
    user.avatarPublicId = result.publicId
    await user.save()
  }

  // --- 4. Delete old avatar (best-effort, only after user is updated) ---
  if (oldPublicId) {
    try {
      await deleteFromCloudinary(oldPublicId)
    } catch (deleteError) {
      // Delete failed but user already has the new avatar — just log
      console.error("Failed to delete old avatar:", deleteError)
    }
  }

  // --- 5. Return success ---
  return NextResponse.json(
    { success: true, data: { url: result.url, publicId: result.publicId } },
    { status: HTTP.OK },
  )
}
