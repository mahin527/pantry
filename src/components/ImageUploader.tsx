"use client"

import { useState, useRef } from "react"
import { Button, CircularProgress, Box, Typography } from "@mui/material"
import Image from "next/image"
import { FaTrash, FaUpload } from "react-icons/fa"

type Props = {
  currentImage?: string
  onUpload: (url: string) => void
  folder?: string
  label?: string
  uploadUrl?: string
}

export function ImageUploader({ currentImage, onUpload, folder = "pantry", label = "Choose Image", uploadUrl = "/api/upload" }: Props) {
  const [preview, setPreview] = useState<string | null>(currentImage ?? null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setError(null)

    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
    if (!allowed.includes(file.type)) {
      setError("Invalid file type. Use jpg, png, or webp.")
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("File too large. Max 5MB.")
      return
    }

    setPreview(URL.createObjectURL(file))
    setUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("folder", folder)

      const res = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
        credentials: "include",
      })

      if (res.status === 401 || res.status === 403) {
        window.location.href = "/login"
        return
      }

      const json = await res.json()
      if (json.success && json.data?.url) {
        onUpload(json.data.url)
      } else {
        setError(json.message || "Upload failed")
      }
    } catch {
      setError("Upload failed. Try again.")
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = () => {
    setPreview(null)
    onUpload("")
    if (inputRef.current) inputRef.current.value = ""
  }

  return (
    <Box>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFile}
        style={{ display: "none" }}
        id="image-upload-input"
      />
      <label htmlFor="image-upload-input">
        <Button
          variant="outlined"
          component="span"
          startIcon={uploading ? <CircularProgress size={16} /> : <FaUpload />}
          disabled={uploading}
          sx={{ cursor: "pointer" }}
        >
          {uploading ? "Uploading..." : label}
        </Button>
      </label>

      {preview && (
        <Box sx={{ mt: 1, position: "relative", display: "inline-block" }}>
          <Image
            src={preview}
            alt="Preview"
            width={100}
            height={100}
            style={{ objectFit: "cover", borderRadius: 8, border: "1px solid #ddd" }}
          />
          <Button
            size="small"
            color="error"
            onClick={handleRemove}
            sx={{ position: "absolute", top: -8, right: -8, minWidth: 24, height: 24, borderRadius: "50%", bgcolor: "white" }}
          >
            <FaTrash size={10} />
          </Button>
        </Box>
      )}

      {error && (
        <Typography variant="caption" color="error" sx={{ display: "block", mt: 0.5 }}>
          {error}
        </Typography>
      )}
    </Box>
  )
}
