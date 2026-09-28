import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import https from "node:https";
import http from "node:http";
import sharp from "sharp";
import { getDb } from "../src/lib/db.ts";
import { r2ImageUrl } from "../src/lib/image-url.ts";

const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const bucketName = process.env.R2_BUCKET_NAME || "ultrastore";

if (!accountId || !accessKeyId || !secretAccessKey) {
  throw new Error("R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, and R2_SECRET_ACCESS_KEY are required");
}

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId, secretAccessKey },
});

async function downloadBuffer(url) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith("https") ? https : http;
    const req = mod.get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      const data = [];
      res.on("data", (chunk) => data.push(chunk));
      res.on("end", () => resolve(Buffer.concat(data)));
    });
    req.on("error", reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error("Timeout"));
    });
  });
}

async function main() {
  const db = getDb();
  const prods = db.prepare("SELECT id, slug, name, primary_image FROM products").all();
  console.log(`Starting R2 WebP Sync for ${prods.length} catalog items into bucket '${bucketName}'...`);

  let successCount = 0;
  let failCount = 0;

  const updateProdStmt = db.prepare("UPDATE products SET primary_image = ? WHERE id = ?");
  const updateVarStmt = db.prepare(`
    UPDATE variants
    SET media_json = ?
    WHERE product_id = ?
  `);

  for (let i = 0; i < prods.length; i++) {
    const p = prods[i];
    if (!p.primary_image || !p.primary_image.startsWith("http")) continue;

    const r2Key = `products/${p.slug}.webp`;

    try {
      // 1. Download source image
      const rawBuf = await downloadBuffer(p.primary_image);

      // 2. High-precision WebP conversion (sharp quality 92, lossless preset, high sharpness)
      const webpBuf = await sharp(rawBuf)
        .webp({ quality: 92, effort: 4 })
        .toBuffer();

      // 3. Upload directly to Cloudflare R2
      await s3.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: r2Key,
          Body: webpBuf,
          ContentType: "image/webp",
          CacheControl: "public, max-age=31536000, immutable",
        })
      );

      const targetUrl = r2ImageUrl(r2Key);

      // 4. Update SQLite record so no local PC image is stored
      updateProdStmt.run(targetUrl, p.id);
      const mediaJson = JSON.stringify([{ url: targetUrl, alt: p.name, isPrimary: true }]);
      updateVarStmt.run(mediaJson, p.id);

      successCount++;
      console.log(`[${successCount}/${prods.length}] Uploaded: ${r2Key} (${(webpBuf.length / 1024).toFixed(1)} KB)`);
    } catch (err) {
      failCount++;
      console.error(`[FAIL] ${p.slug}: ${err.message}`);
    }
  }

  console.log(`\nR2 WebP Sync Complete! Uploaded: ${successCount}, Failed: ${failCount}`);
}

main().catch(console.error);
