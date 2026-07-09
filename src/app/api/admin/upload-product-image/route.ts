import { NextRequest, NextResponse } from "next/server"
import { authorizeAdmin } from "@/lib/authorize"
import { cloudinaryStorage } from "@/lib/cloudinary"
import { error } from "@/lib/api-response"
import { HTTP } from "@/lib/http-status"

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
const MAX_SIZE = 5 * 1024 * 1024 // 5MB

export async function POST(request: NextRequest) {
  const auth = await authorizeAdmin(request)
  if (!auth.authorized) return auth.response

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

  // --- Upload to Cloudinary ---
  const folder = (formData.get("folder") as string) || "products"
  try {
    const result = await cloudinaryStorage.uploadImage(file, folder)

    return NextResponse.json(
      { success: true, data: { url: result.url, publicId: result.publicId } },
      { status: HTTP.OK },
    )
  } catch {
    return NextResponse.json(error("Upload failed"), {
      status: HTTP.INTERNAL_SERVER_ERROR,
    })
  }
}