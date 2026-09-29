import { NextResponse } from "next/server";
import {
  getSiteSetting,
  setSiteSetting,
  DEFAULT_HERO_CONFIG,
  DEFAULT_CATEGORIES_CONFIG,
  DEFAULT_ANNOUNCEMENT_CONFIG,
  DEFAULT_SECTION_HEADERS_CONFIG,
  DEFAULT_FOOTER_CONFIG,
  DEFAULT_BRAND_LOGOS_CONFIG,
} from "@/lib/cms";
import { DEFAULT_THEME_CONFIG, normalizeTheme, validateTheme } from "@/lib/theme";
import { getDb } from "@/lib/db";

const EDITABLE_KEYS = new Set([
  "hero_config", "categories_config", "announcement_config", "section_headers_config",
  "brand_logos_config", "footer_config", "theme_config",
]);

function isEditableSetting(value: unknown): value is { key: string; value: unknown } {
  if (!value || typeof value !== "object") return false;
  const setting = value as { key?: unknown; value?: unknown };
  if (typeof setting.key !== "string" || !EDITABLE_KEYS.has(setting.key) || setting.value === undefined) return false;
  if (setting.key === "theme_config") return validateTheme(setting.value);
  if (setting.key === "categories_config" || setting.key === "brand_logos_config") return Array.isArray(setting.value);
  return typeof setting.value === "object" && setting.value !== null && !Array.isArray(setting.value);
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key");

  if (key === "hero") {
    const data = getSiteSetting("hero_config", DEFAULT_HERO_CONFIG);
    return NextResponse.json({ success: true, data });
  }

  if (key === "categories") {
    const data = getSiteSetting("categories_config", DEFAULT_CATEGORIES_CONFIG);
    return NextResponse.json({ success: true, data });
  }

  if (key === "announcement") {
    const data = getSiteSetting("announcement_config", DEFAULT_ANNOUNCEMENT_CONFIG);
    return NextResponse.json({ success: true, data });
  }

  if (key === "section_headers") {
    const data = getSiteSetting("section_headers_config", DEFAULT_SECTION_HEADERS_CONFIG);
    return NextResponse.json({ success: true, data });
  }

  if (key === "footer") {
    const data = getSiteSetting("footer_config", DEFAULT_FOOTER_CONFIG);
    return NextResponse.json({ success: true, data });
  }

  if (key === "brand_logos") {
    const data = getSiteSetting("brand_logos_config", DEFAULT_BRAND_LOGOS_CONFIG);
    return NextResponse.json({ success: true, data });
  }

  if (key === "theme") {
    const data = normalizeTheme(getSiteSetting("theme_config", DEFAULT_THEME_CONFIG));
    return NextResponse.json({ success: true, data });
  }

  const hero = getSiteSetting("hero_config", DEFAULT_HERO_CONFIG);
  const categories = getSiteSetting("categories_config", DEFAULT_CATEGORIES_CONFIG);
  const announcement = getSiteSetting("announcement_config", DEFAULT_ANNOUNCEMENT_CONFIG);
  const sectionHeaders = getSiteSetting("section_headers_config", DEFAULT_SECTION_HEADERS_CONFIG);
  const footer = getSiteSetting("footer_config", DEFAULT_FOOTER_CONFIG);
  const brandLogos = getSiteSetting("brand_logos_config", DEFAULT_BRAND_LOGOS_CONFIG);
  const theme = normalizeTheme(getSiteSetting("theme_config", DEFAULT_THEME_CONFIG));

  return NextResponse.json({
    success: true,
    data: { hero, categories, announcement, sectionHeaders, footer, brandLogos, theme },
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const updates: unknown[] = Array.isArray(body.updates) ? body.updates : [{ key: body.key, value: body.value }];
    if (updates.length === 0 || updates.length > EDITABLE_KEYS.size || !updates.every(isEditableSetting)) {
      return NextResponse.json({ success: false, error: "Invalid setting or theme color contrast." }, { status: 400 });
    }
    const db = getDb();
    db.exec("BEGIN");
    try {
      for (const { key, value } of updates as { key: string; value: unknown }[]) setSiteSetting(key, value);
      db.exec("COMMIT");
    } catch (error) {
      db.exec("ROLLBACK");
      throw error;
    }
    return NextResponse.json({ success: true, message: "Settings saved successfully." });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || "Failed to save setting" }, { status: 500 });
  }
}
