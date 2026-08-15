import { getAccessToken } from "@/lib/auth/session";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

export type UploadPurpose = "avatar" | "post" | "verification" | "resume";

export interface UploadedFile {
  id: string;
  purpose: UploadPurpose;
  originalName: string;
  mimeType: string;
  size: number;
  visibility: "public" | "private";
  url: string;
}

export async function uploadFile(file: File, purpose: UploadPurpose): Promise<UploadedFile> {
  const token = getAccessToken();
  if (!token) {
    throw new Error("Sign in to upload a file.");
  }
  const body = new FormData();
  body.append("file", file);
  body.append("purpose", purpose);
  const response = await fetch(`${BACKEND_URL}/uploads`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body,
  });
  const payload = (await response.json().catch(() => null)) as
    | UploadedFile
    | { error?: { message?: string } }
    | null;
  if (!response.ok) {
    const message =
      payload && "error" in payload ? payload.error?.message : "Upload failed.";
    throw new Error(message || `Upload failed (${response.status}).`);
  }
  return payload as UploadedFile;
}

export function asFile(value: unknown): File | null {
  return value instanceof File ? value : null;
}

export function authorizedFileUrl(pathOrUrl: string | null | undefined): string | null {
  if (!pathOrUrl) return null;
  if (/^https?:\/\//.test(pathOrUrl)) return pathOrUrl;
  const token = getAccessToken();
  const url = new URL(pathOrUrl, BACKEND_URL);
  if (token) url.searchParams.set("token", token);
  return url.toString();
}
