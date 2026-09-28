import { NextResponse } from "next/server";
import { getSiteSetting, setSiteSetting, DEFAULT_HERO_CONFIG, DEFAULT_CATEGORIES_CONFIG } from "@/lib/cms";

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

  const hero = getSiteSetting("hero_config", DEFAULT_HERO_CONFIG);
  const categories = getSiteSetting("categories_config", DEFAULT_CATEGORIES_CONFIG);

  return NextResponse.json({ success: true, data: { hero, categories } });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { key, value } = body;

    if (!key || !value) {
      return NextResponse.json({ success: false, error: "Key and value are required" }, { status: 400 });
    }

    setSiteSetting(key, value);
    return NextResponse.json({ success: true, message: `Setting '${key}' saved successfully.` });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || "Failed to save setting" }, { status: 500 });
  }
}
