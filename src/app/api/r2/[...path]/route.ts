import { NextResponse } from "next/server";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

const accountId = process.env.R2_ACCOUNT_ID || "e9f6cff37d5d30f39a1865ce7c3d765e";
const accessKeyId = process.env.R2_ACCESS_KEY_ID || "b741bf9cf99ebc693bde29efc570fe02";
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY || "e4e3b6bfc50f2a619f17431722490bb8d9f2ad4f21e4f4172fe5879fe217ea38";
const bucketName = process.env.R2_BUCKET_NAME || "ultrastore";

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId, secretAccessKey },
});

export async function GET(
  req: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: segments } = await params;
  const key = segments.join("/");

  try {
    const s3Res = await s3.send(
      new GetObjectCommand({
        Bucket: bucketName,
        Key: key,
      })
    );

    const bodyStream = s3Res.Body as any;
    return new Response(bodyStream, {
      headers: {
        "Content-Type": s3Res.ContentType || "image/webp",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: "Image not found on R2", key }, { status: 404 });
  }
}
