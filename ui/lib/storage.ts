import { createClient } from "@/lib/supabase/client";

// ============================================
// Resume constants
// ============================================

const BUCKET = "resumes";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

// ============================================
// Image constants
// ============================================

const IMAGES_BUCKET = "images";
const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2 MB
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

export type ImageCategory = "profile" | "projects" | "education" | "experience";

/**
 * Validates the file before upload.
 * Throws a user-friendly Error if invalid.
 */
export function validateResumeFile(file: File): void {
  if (file.type !== "application/pdf") {
    throw new Error("Only PDF files are allowed.");
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File size must be under 5 MB.");
  }
}

/**
 * Uploads a resume PDF to Supabase Storage and returns the public URL.
 *
 * - Path: {userId}/{username}_resume.pdf (one file per user, upsert overwrites)
 * - Requires the user to have an active Supabase auth session
 * - Caller should validate the file first with validateResumeFile()
 */
export async function uploadResume(
  userId: string,
  username: string,
  file: File,
): Promise<string> {
  const supabase = createClient();
  const filePath = `${userId}/${username}_resume.pdf`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(filePath, file, {
      upsert: true,
      contentType: "application/pdf",
    });

  if (error) throw new Error(`Upload failed: ${error.message}`);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(filePath);

  // Append a timestamp to bust browser/CDN cache on replace
  return `${data.publicUrl}?t=${Date.now()}`;
}

/**
 * Deletes the user's resume from Supabase Storage.
 */
export async function deleteResume(
  userId: string,
  username: string,
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.storage
    .from(BUCKET)
    .remove([`${userId}/${username}_resume.pdf`]);

  if (error) throw new Error(`Delete failed: ${error.message}`);
}

// ============================================
// Image helpers
// ============================================

/**
 * Validates an image file before upload.
 * Throws a user-friendly Error if invalid.
 */
export function validateImageFile(file: File): void {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error("Only JPEG, PNG, WebP, and GIF images are allowed.");
  }
  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error("Image must be under 2 MB.");
  }
}

function getFileExtension(file: File): string {
  const map: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
  };
  return map[file.type] ?? "jpg";
}

/**
 * Uploads an image to Supabase Storage and returns the public URL.
 *
 * - Profile images use a fixed path: {userId}/profile.{ext} (upsert)
 * - Other categories use: {userId}/{category}/{randomId}.{ext}
 */
export async function uploadImage(
  userId: string,
  category: ImageCategory,
  file: File,
): Promise<string> {
  const supabase = createClient();
  const ext = getFileExtension(file);
  const filePath =
    category === "profile"
      ? `${userId}/profile.${ext}`
      : `${userId}/${category}/${crypto.randomUUID().slice(0, 8)}.${ext}`;

  const { error } = await supabase.storage
    .from(IMAGES_BUCKET)
    .upload(filePath, file, {
      upsert: true,
      contentType: file.type,
    });

  if (error) throw new Error(`Upload failed: ${error.message}`);

  const { data } = supabase.storage.from(IMAGES_BUCKET).getPublicUrl(filePath);
  return `${data.publicUrl}?t=${Date.now()}`;
}

/**
 * Deletes an image from Supabase Storage given its public URL.
 * Parses the storage path from the URL automatically.
 */
export async function deleteImage(imageUrl: string): Promise<void> {
  const supabase = createClient();

  const cleanUrl = imageUrl.split("?")[0];
  const marker = `/storage/v1/object/public/${IMAGES_BUCKET}/`;
  const idx = cleanUrl.indexOf(marker);
  if (idx === -1) return; // not a storage URL, nothing to delete

  const filePath = cleanUrl.slice(idx + marker.length);

  const { error } = await supabase.storage
    .from(IMAGES_BUCKET)
    .remove([filePath]);

  if (error) throw new Error(`Delete failed: ${error.message}`);
}
