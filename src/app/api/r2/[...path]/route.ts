import { NextResponse } from "next/server";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { r2BucketName, r2Client } from "@/lib/r2";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: segments } = await params;
  const key = segments.join("/");

  if (!r2Client) {
    return NextResponse.json({ error: "R2 credentials not configured" }, { status: 503 });
  }

  try {
    const s3Res = await r2Client.send(
      new GetObjectCommand({
        Bucket: r2BucketName,
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
