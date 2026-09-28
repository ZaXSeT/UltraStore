import { S3Client, PutObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";

const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const bucketName = process.env.R2_BUCKET_NAME || "ultrastore-assets";
const publicUrl = (process.env.R2_PUBLIC_URL || "").replace(/\/$/, "");

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

export async function uploadImageToR2(
  key: string,
  body: Buffer | Uint8Array,
  contentType: string = "image/webp"
): Promise<{ success: boolean; url: string; error?: string }> {
  const cleanKey = key.replace(/^\/+/, "");
  
  if (!r2Client) {
    // If R2 credentials not configured, fallback to public URL or local path
    return {
      success: false,
      url: publicUrl ? `${publicUrl}/${cleanKey}` : `/images/products/${cleanKey}`,
      error: "R2 credentials not configured in environment.",
    };
  }

  try {
    await r2Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: cleanKey,
        Body: body,
        ContentType: contentType,
        CacheControl: "public, max-age=31536000, immutable",
      })
    );

    const fileUrl = publicUrl ? `${publicUrl}/${cleanKey}` : `https://${bucketName}.${accountId}.r2.cloudflarestorage.com/${cleanKey}`;
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
  const cleanKey = key.replace(/^\/+/, "");
  if (publicUrl) return `${publicUrl}/${cleanKey}`;
  return `/images/products/${cleanKey}`;
}
