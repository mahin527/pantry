import { v2 as cloudinary } from "cloudinary"
import crypto from "crypto"
import type { StorageProvider } from "./storage"
import { env } from "./env"

cloudinary.config({
  cloud_name: env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
})

export const cloudinaryStorage: StorageProvider = {
  async uploadImage(file: File, folder = "pantry"): Promise<{ url: string; publicId: string }> {
    const buffer = Buffer.from(await file.arrayBuffer())

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder, resource_type: "image" },
        (error, result) => {
          if (error || !result) {
            reject(error ?? new Error("Upload failed"))
          } else {
            resolve({ url: result.secure_url, publicId: result.public_id })
          }
        },
      )
      uploadStream.end(buffer)
    })
  },

  async deleteImage(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId)
  },

  extractPublicId(url: string): string | null {
    const match = url.match(/\/v\d+\/(.+)\.\w+$/)
    return match ? match[1] : null
  },
}

export async function deleteFromCloudinary(publicId: string) {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000)
    const signature = crypto
      .createHash("sha256")
      .update(`public_id=${publicId}&timestamp=${timestamp}${env.CLOUDINARY_API_SECRET}`)
      .digest("hex")

    const formData = new FormData()
    formData.append("public_id", publicId)
    formData.append("timestamp", timestamp.toString())
    formData.append("api_key", env.CLOUDINARY_API_KEY)
    formData.append("signature", signature)

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/destroy`,
      {
        method: "POST",
        body: formData,
      },
    )

    return await response.json()
  } catch (error) {
    console.error("Cloudinary delete error:", error)
    throw error
  }
}
