import { v2 as cloudinary } from "cloudinary"
import type { StorageProvider } from "./storage"

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
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
