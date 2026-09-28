import { getDb } from "./db.ts";
import { resolveR2ImageUrl } from "./image-url.ts";

export * from "./cms-types";

export function getSiteSetting<T>(key: string, fallback: T): T {
  let value = fallback;
  try {
    const db = getDb();
    const row = db.prepare("SELECT value_json FROM site_settings WHERE key = ?").get(key) as { value_json: string } | undefined;
    if (row) value = JSON.parse(row.value_json) as T;
  } catch {
    return value;
  }

  if (key === "hero_config") {
    const hero = value as Record<string, unknown>;
    return { ...hero, imageUrl: resolveR2ImageUrl(String(hero.imageUrl || "")) } as T;
  }
  if (key === "categories_config") {
    return (value as Array<Record<string, unknown>>).map((category) => ({
      ...category,
      image: resolveR2ImageUrl(String(category.image || "")),
    })) as T;
  }
  if (key === "brand_logos_config") {
    return (value as Array<Record<string, unknown>>).map((brand) => ({
      ...brand,
      logoUrl: resolveR2ImageUrl(String(brand.logoUrl || "")),
    })) as T;
  }
  return value;
}

export function setSiteSetting<T>(key: string, value: T): void {
  const db = getDb();
  db.prepare(`
    INSERT INTO site_settings (key, value_json, updated_at)
    VALUES (?, ?, datetime('now'))
    ON CONFLICT(key) DO UPDATE SET
      value_json = excluded.value_json,
      updated_at = datetime('now')
  `).run(key, JSON.stringify(value));
}
