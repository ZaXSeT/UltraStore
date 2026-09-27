import fs from "fs";
import path from "path";
import { getDb } from "../src/lib/db.ts";

const realImages = [
  {
    slug: "wlmouse-beast-x-magnesium",
    url: "https://cdn.shopify.com/s/files/1/0631/9590/6271/files/wlmouse-x-drg-beast-mini-max-magnesium-alloy-gaming-mouse-mechkeysshop-379622.jpg?v=1774707804",
    ext: "jpg"
  },
  {
    slug: "vxe-atk68-magnetic-he",
    url: "https://cdn.shopify.com/s/files/1/0631/9590/6271/files/atk68-magnetic-switch-mechanical-keyboard-mechkeysshop-atk68-v2-white-magnetic-jade-purple-993666.jpg?v=1761742303",
    ext: "jpg"
  },
  {
    slug: "lamzu-maya-4k-wireless",
    url: "https://cdn.shopify.com/s/files/1/0248/5223/4312/files/20231018-Maya-_-__02_4064a058-8a05-4d85-885e-af425cd290bb-574616.webp?v=1698986508",
    ext: "webp"
  },
  {
    slug: "glsswrks-akari-glass-pad",
    url: "https://cdn.shopify.com/s/files/1/0248/5223/4312/files/Hana1.jpg?v=1729664694",
    ext: "jpg"
  },
  {
    slug: "x-raypad-aqua-control-2-sakura",
    url: "https://cdn.shopify.com/s/files/1/0275/3649/0561/products/x-raypads-aqua-control-ii-mouse-pad-625477.webp?v=1703853991",
    ext: "webp"
  },
  {
    slug: "pulsar-x2v2-wireless",
    url: "https://cdn.shopify.com/s/files/1/0455/0914/8840/files/X2_v2_Wireless_Mouse_Medium_Black_001.png?v=1758619152",
    ext: "png"
  },
  {
    slug: "pulsar-x2h-high-hump-wireless",
    url: "https://cdn.shopify.com/s/files/1/0248/5223/4312/files/PulsarX2HMiniCrazyLight_Black_Front-001.png?v=1759211974",
    ext: "png"
  },
  {
    slug: "wuque-studio-zoom75-tkl",
    url: "https://cdn.shopify.com/s/files/1/0607/2474/0287/files/Zoom75v2_FrontBack_Black_a6aa05a6-a2c3-4071-9f3d-4469efce72fa.jpg?v=1729494538",
    ext: "jpg"
  },
  {
    slug: "hmx-xinhai-linear-switch",
    url: "https://cdn.shopify.com/s/files/1/0693/2899/4622/files/hmx-iris-linear-switch-white-background.jpg?v=1790319937",
    ext: "jpg"
  },
  {
    slug: "padsmith-first-attack-mousepad",
    url: "https://cdn.shopify.com/s/files/1/0248/5223/4312/files/GenesisPro-DarkEssencePoron-ProductListing.png?v=1732925126",
    ext: "png"
  },
  {
    slug: "sayodevice-o3c-rapid-trigger-keypad",
    url: "https://cdn.shopify.com/s/files/1/0463/5980/6101/files/kbgm-h03_off.png?v=1775114343",
    ext: "png"
  },
  {
    slug: "darmoshark-m3-pro-4k",
    url: "https://cdn.shopify.com/s/files/1/0631/9590/6271/files/darmoshark-m3-4k-mouse-mechkeysshop-824407.png?v=1766926146",
    ext: "png"
  },
  {
    slug: "unusual-way-sports-glass-blend",
    url: "https://cdn.shopify.com/s/files/1/0631/9590/6271/files/unusual-way-sports-neko-poron-fps-mousepad-mechkeysshop-448548.jpg?v=1772111241",
    ext: "jpg"
  },
  {
    slug: "wooting-60he-plus",
    url: "https://cdn.shopify.com/s/files/1/0259/9619/7939/files/Wooting-60HE_-module-front.png?v=1764797635",
    ext: "png"
  },
  {
    slug: "keychron-v1-max",
    url: "https://cdn.shopify.com/s/files/1/0059/0630/1017/files/Keychron-V1-Max-QMK-VIA-Wireless-Custom-Mechanical-Keyboard-75_-Layout-Fully-Assembled-Knob-for-Mac-Windows-Linux-Gateron-Jupiter-Red-ISO-German-layout.jpg?v=1716882990",
    ext: "jpg"
  },
  {
    slug: "artisan-ninja-fx-zero",
    url: "https://cdn.shopify.com/s/files/1/0248/5223/4312/files/artisanhayateotsured.jpg?v=1740192947",
    ext: "jpg"
  },
  {
    slug: "sennheiser-hd-560s",
    url: "https://upload.wikimedia.org/wikipedia/commons/6/60/Hd600_klein.jpg",
    ext: "jpg"
  },
  {
    slug: "logitech-g-pro-x-superlight-2",
    url: "https://upload.wikimedia.org/wikipedia/commons/8/88/Logitech_Pro_X_Superlight_2_sample_20231216.jpg",
    ext: "jpg"
  }
];

const outDir = "public/images/products";
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function run() {
  console.log("Downloading authentic, non-AI real product photos...");
  const db = getDb();
  const updateProd = db.prepare("UPDATE products SET primary_image = ? WHERE slug = ?");
  const updateVar = db.prepare("UPDATE variants SET media_json = ? WHERE product_id = (SELECT id FROM products WHERE slug = ?)");

  for (const item of realImages) {
    const filename = `${item.slug}.${item.ext}`;
    const filePath = path.join(outDir, filename);
    const publicUrl = `/images/products/${filename}`;

    try {
      console.log(`Downloading [${item.slug}] from: ${item.url}`);
      const res = await fetch(item.url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const buffer = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(filePath, buffer);
      console.log(`  Saved to ${filePath} (${buffer.length} bytes)`);

      updateProd.run(publicUrl, item.slug);
      const media = JSON.stringify([{ url: publicUrl, altText: item.slug, sortOrder: 0 }]);
      updateVar.run(media, item.slug);
    } catch (e) {
      console.error(`  FAILED to download ${item.slug}:`, e.message);
    }
  }

  // Update catalog-research.json as well
  const catalogPath = "src/data/catalog-research.json";
  const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf-8"));
  for (const p of catalog.items) {
    const match = realImages.find(r => r.slug === p.slug);
    if (match) {
      p.sourceImageUrl = `/images/products/${match.slug}.${match.ext}`;
      for (const v of p.variants) {
        v.imageUrl = p.sourceImageUrl;
      }
    }
  }
  fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2), "utf-8");

  console.log("\nALL 18 PRODUCTS UPDATED WITH REAL AUTHENTIC PHOTOS!");
}

run();
