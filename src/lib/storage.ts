export interface StorageProvider {
  uploadImage(file: File, folder?: string): Promise<{ url: string; publicId: string }>
  deleteImage(publicId: string): Promise<void>
  extractPublicId(url: string): string | null
}
