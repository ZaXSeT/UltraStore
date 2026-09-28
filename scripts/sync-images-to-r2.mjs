import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "node:fs";
import path from "node:path";
import https from "node:https";

const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const bucketName = process.env.R2_BUCKET_NAME || "ultrastore-assets";
const publicUrl = (process.env.R2_PUBLIC_URL || "").replace(/\/$/, "");

if (!accountId || !accessKeyId || !secretAccessKey) {
  console.log("R2 credentials not provided in env. Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY to sync.");
  process.exit(0);
}

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId, secretAccessKey },
});

async function downloadBuffer(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      const data = [];
      res.on("data", (chunk) => data.push(chunk));
      res.on("end", () => resolve(Buffer.concat(data)));
    }).on("error", reject);
  });
}

async function main() {
  const catalogPath = path.resolve("./src/data/catalog-research.json");
  const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf-8"));
  console.log(`Starting R2 sync for ${catalog.items.length} items...`);

  let synced = 0;
  for (const item of catalog.items) {
    if (!item.sourceImageUrl || !item.sourceImageUrl.startsWith("http")) continue;
    const key = `products/${item.slug}.webp`;
    try {
      const buffer = await downloadBuffer(item.sourceImageUrl);
      await s3.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: key,
          Body: buffer,
          ContentType: "image/webp",
          CacheControl: "public, max-age=31536000, immutable",
        })
      );
      synced++;
      console.log(`[${synced}] Uploaded: ${key}`);
      if (publicUrl) {
        item.r2ImageUrl = `${publicUrl}/${key}`;
      }
    } catch (e) {
      console.error(`Failed ${item.slug}:`, e.message);
    }
  }

  if (publicUrl) {
    fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2));
    console.log("Catalog updated with R2 URLs.");
  }
}

main().catch(console.error);
