import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";
import { r2Client, r2BucketName } from "../src/lib/r2.ts";

if (!r2Client) throw new Error("R2 credentials are required");

const sources = [
  "cms/hero-zofia.png",
  "cms/category-glasspads.png",
  "cms/category-preorder.png",
];

for (const sourceKey of sources) {
  const targetKey = sourceKey.replace(/\.png$/, ".webp");
  const source = await r2Client.send(new GetObjectCommand({ Bucket: r2BucketName, Key: sourceKey }));
  const original = Buffer.from(await source.Body.transformToByteArray());
  const optimized = await sharp(original)
    .resize({ width: 1000, withoutEnlargement: true })
    .webp({ quality: 82, effort: 5 })
    .toBuffer();

  await r2Client.send(new PutObjectCommand({
    Bucket: r2BucketName,
    Key: targetKey,
    Body: optimized,
    ContentType: "image/webp",
    CacheControl: "public, max-age=31536000, immutable",
  }));
  console.log(`${targetKey}: ${original.length} -> ${optimized.length} bytes`);
}
