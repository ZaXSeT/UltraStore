import { NextResponse } from "next/server";
import { uploadImageToR2 } from "@/lib/r2";
import crypto from "crypto";
import sharp from "sharp";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const cropX = Number(formData.get("cropX") || 0);
    const cropY = Number(formData.get("cropY") || 0);
    const cropWidth = Number(formData.get("cropWidth") || 0);
    const cropHeight = Number(formData.get("cropHeight") || 0);

    if (!file) {
      return NextResponse.json({ success: false, error: "No image file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    let imagePipeline = sharp(Buffer.from(arrayBuffer));
    const metadata = await imagePipeline.metadata();

    // If crop coordinates provided, apply crop
    if (cropWidth > 0 && cropHeight > 0 && metadata.width && metadata.height) {
      const validLeft = Math.max(0, Math.min(Math.round(cropX), metadata.width - 1));
      const validTop = Math.max(0, Math.min(Math.round(cropY), metadata.height - 1));
      const validWidth = Math.min(Math.round(cropWidth), metadata.width - validLeft);
      const validHeight = Math.min(Math.round(cropHeight), metadata.height - validTop);

      if (validWidth > 0 && validHeight > 0) {
        imagePipeline = imagePipeline.extract({
          left: validLeft,
          top: validTop,
          width: validWidth,
          height: validHeight,
        });
      }
    }

    // Convert to webp with high quality
    const processedBuffer = await imagePipeline
      .resize({ width: 1200, height: 1200, fit: "cover", position: "center" })
      .webp({ quality: 90 })
      .toBuffer();

    // Generate unique random name (never keep original file name)
    const uniqueSuffix = crypto.randomBytes(8).toString("hex");
    const uniqueKey = `products/asset_${Date.now()}_${uniqueSuffix}.webp`;

    const upload = await uploadImageToR2(uniqueKey, processedBuffer, "image/webp");
    if (!upload.success) {
      return NextResponse.json(
        { success: false, error: upload.error || "Failed to upload image to R2" },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      url: upload.url,
      key: uniqueKey,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to upload image" },
      { status: 500 }
    );
  }
}
