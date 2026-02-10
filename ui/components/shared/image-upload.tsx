"use client"

import { useRef, useState } from "react"
import { toast } from "sonner"
import { ImageIcon, RefreshCw, Trash2 } from "lucide-react"

import {
  uploadImage,
  validateImageFile,
  type ImageCategory,
} from "@/lib/storage"
import { Button } from "@/components/ui/button"

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  userId: string
  category: ImageCategory
  label?: string
  className?: string
}

export function ImageUpload({
  value,
  onChange,
  userId,
  category,
  label = "image",
  className,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      validateImageFile(file)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Invalid file.")
      return
    }

    setIsUploading(true)
    try {
      const publicUrl = await uploadImage(userId, category, file)
      onChange(publicUrl)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed.")
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleFileSelect}
        disabled={isUploading}
      />

      {value ? (
        <div className="flex items-center gap-3 rounded-md border border-border bg-muted/50 px-3 py-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt={label}
            className="h-10 w-10 shrink-0 rounded-md object-cover"
          />
          <span className="min-w-0 flex-1 truncate text-sm text-muted-foreground">
            {label}
          </span>
          <div className="flex items-center gap-1.5">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
              title={`Replace ${label}`}
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-destructive hover:bg-destructive/10"
              onClick={() => onChange("")}
              title={`Remove ${label}`}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          disabled={isUploading}
          onClick={() => fileInputRef.current?.click()}
          className="flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-border px-3 py-6 text-sm transition-colors hover:border-primary/50 hover:bg-muted/50 disabled:pointer-events-none disabled:opacity-50"
        >
          <ImageIcon className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">
            {isUploading ? "Uploading..." : `Upload ${label}`}
          </span>
        </button>
      )}
    </div>
  )
}
