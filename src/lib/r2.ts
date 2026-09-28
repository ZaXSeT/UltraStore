import { S3Client, PutObjectCommand, DeleteObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { r2ImageUrl } from "./image-url.ts";

const accountId = process.env.R2_ACCOUNT_ID || "e9f6cff37d5d30f39a1865ce7c3d765e";
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
export const r2BucketName = process.env.R2_BUCKET_NAME || "ultrastore";

// ponytail: single R2 S3 client instance. Upgrade to multi-bucket routing if storage spans regions.
export const r2Client = (accountId && accessKeyId && secretAccessKey)
  ? new S3Client({
      region: "auto",
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    })
  : null;

export async function deleteImageFromR2(keyOrUrl: string): Promise<boolean> {
  if (!r2Client) return false;
  try {
    let key = keyOrUrl;
    if (key.startsWith("http")) {
      const u = new URL(key);
      key = u.pathname.replace(/^\/+/, "");
    }
    await r2Client.send(
      new DeleteObjectCommand({
        Bucket: r2BucketName,
        Key: key,
      })
    );
    return true;
  } catch (err) {
    console.error("Failed to delete old object from R2:", err);
    return false;
  }
}

export async function uploadImageToR2(
  key: string,
  body: Buffer | Uint8Array,
  contentType: string = "image/webp",
  oldKeyOrUrl?: string
): Promise<{ success: boolean; url: string; error?: string }> {
  const cleanKey = key.replace(/^\/+/, "");
  
  if (!r2Client) {
    return {
      success: false,
      url: "",
      error: "R2 credentials not configured in environment.",
    };
  }

  try {
    // Prune previous asset version if updating to prevent orphaned bloat
    if (oldKeyOrUrl && oldKeyOrUrl !== cleanKey) {
      await deleteImageFromR2(oldKeyOrUrl);
    }

    await r2Client.send(
      new PutObjectCommand({
        Bucket: r2BucketName,
        Key: cleanKey,
        Body: body,
        ContentType: contentType,
        CacheControl: "public, max-age=31536000, immutable",
      })
    );

    const fileUrl = getR2ImageUrl(cleanKey);
    return { success: true, url: fileUrl };
  } catch (err: any) {
    return {
      success: false,
      url: "",
      error: err?.message || "Failed to upload to Cloudflare R2",
    };
  }
}

export function getR2ImageUrl(key: string): string {
  return r2ImageUrl(key);
}
