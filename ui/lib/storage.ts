import { createClient } from "@/lib/supabase/client";

const BUCKET = "resumes";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

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
