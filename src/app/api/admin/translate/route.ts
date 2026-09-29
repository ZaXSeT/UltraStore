import { NextResponse } from "next/server";
import { translateCopy, TranslationError } from "@/lib/translate-copy";
import { isAdminTranslationRequest } from "@/lib/admin-translation-request";

const FIELDS_BY_CONTEXT: Record<string, Set<string>> = {
  product: new Set(["description", "warranty_info"]),
  hero: new Set(["badgeText", "description", "availability", "ctaText", "secondaryCtaText"]),
  announcement: new Set(["primaryText", "secondaryText", "trackLinkText"]),
  headings: new Set(["tickerLabel", "categoryEyebrow", "categoryTitle", "categoryTagline", "readyEyebrow", "readyTitle", "readyCtaText", "preorderEyebrow", "preorderTitle", "preorderCtaText"]),
  categories: new Set(["title", "spec"]),
};

export async function POST(req: Request) {
  if (!isAdminTranslationRequest(req)) {
    return NextResponse.json({ success: false, error: "Terjemahan hanya tersedia di panel admin." }, { status: 403 });
  }
  try {
    const { context, fields } = await req.json();
    if (typeof context !== "string" || !FIELDS_BY_CONTEXT[context] || !fields || typeof fields !== "object" || Array.isArray(fields) || Object.entries(fields).some(([key, value]) => !FIELDS_BY_CONTEXT[context].has(key) || typeof value !== "string")) {
      return NextResponse.json({ success: false, error: "Teks terjemahan tidak valid." }, { status: 400 });
    }
    const translated = await translateCopy(context, fields as Record<string, string>);
    return NextResponse.json({ success: true, translated });
  } catch (error) {
    const status = error instanceof TranslationError ? error.status : 500;
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Terjemahan gagal." }, { status });
  }
}
