export class TranslationError extends Error {
  status: number;

  constructor(message: string, status = 502) {
    super(message);
    this.status = status;
  }
}

export async function translateCopy(context: string, fields: Record<string, string>): Promise<Record<string, string>> {
  const entries = Object.entries(fields).filter(([, value]) => value.trim());
  if (!context.trim() || context.length > 200 || !entries.length || entries.length > 12 || entries.some(([key, value]) => !/^[a-zA-Z][\w]*$/.test(key) || value.length > 3000)) {
    throw new TranslationError("Tambahkan teks bahasa Indonesia yang valid sebelum menerjemahkan.", 400);
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new TranslationError("Fitur terjemahan belum aktif. Admin perlu mengatur OPENAI_API_KEY di server.", 503);
  }

  const source = Object.fromEntries(entries);
  const keys = Object.keys(source);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: process.env.OPENAI_TRANSLATION_MODEL || "gpt-5.4-mini",
        store: false,
        instructions: [
          "You are a native-English ecommerce copy editor for a specialist gaming-gear shop.",
          "Rewrite each Indonesian field as natural, concise English suitable for its UI context; do not translate word for word.",
          "Keep the original meaning and tone. Preserve brand names, model names, technical specifications, measurements, prices, availability, and warranty terms exactly.",
          "Do not invent product features, performance claims, stock, shipping promises, or warranty coverage.",
          "For short labels, write idiomatic English UI copy. For descriptions, use fluent editorial prose without hype or filler.",
          "Return one English string for every supplied field and nothing else.",
        ].join(" "),
        input: JSON.stringify({ context, fields: source }),
        text: {
          format: {
            type: "json_schema",
            name: "english_storefront_copy",
            strict: true,
            schema: {
              type: "object",
              properties: Object.fromEntries(keys.map((key) => [key, { type: "string" }])),
              required: keys,
              additionalProperties: false,
            },
          },
        },
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new TranslationError("Layanan terjemahan gagal. Periksa konfigurasi API dan coba lagi.", 502);
    }

    const result = await response.json() as {
      status?: string;
      output?: Array<{ content?: Array<{ type?: string; text?: string }> }>;
    };
    const outputText = result.output?.flatMap((item) => item.content || [])
      .filter((part) => part.type === "output_text")
      .map((part) => part.text || "")
      .join("") || "";
    if (result.status !== "completed" || !outputText) {
      throw new TranslationError("Terjemahan belum selesai. Coba lagi.");
    }

    let translated: Record<string, unknown>;
    try {
      translated = JSON.parse(outputText);
    } catch {
      throw new TranslationError("Hasil terjemahan tidak valid. Coba lagi.");
    }
    if (keys.some((key) => typeof translated[key] !== "string" || !(translated[key] as string).trim())) {
      throw new TranslationError("Hasil terjemahan tidak lengkap. Coba lagi.");
    }

    return Object.fromEntries(keys.map((key) => [key, (translated[key] as string).trim()]));
  } catch (error) {
    if (error instanceof TranslationError) throw error;
    throw new TranslationError("Layanan terjemahan tidak dapat dihubungi. Coba lagi.");
  } finally {
    clearTimeout(timeout);
  }
}
