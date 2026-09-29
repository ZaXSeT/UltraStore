import test from "node:test";
import assert from "node:assert/strict";
import { translateCopy, TranslationError } from "./translate-copy.ts";

test("translation requires a configured server key", async () => {
  const previous = process.env.OPENAI_API_KEY;
  delete process.env.OPENAI_API_KEY;
  try {
    await assert.rejects(
      translateCopy("product", { description: "Mouse ringan dengan sensor PAW3950." }),
      (error) => error instanceof TranslationError && error.status === 503,
    );
  } finally {
    if (previous === undefined) delete process.env.OPENAI_API_KEY;
    else process.env.OPENAI_API_KEY = previous;
  }
});

test("translation returns reviewed fields from a structured model response", async () => {
  const previousKey = process.env.OPENAI_API_KEY;
  const previousFetch = globalThis.fetch;
  process.env.OPENAI_API_KEY = "test-key";
  globalThis.fetch = async (_url, options) => {
    const payload = JSON.parse(options.body);
    assert.equal(payload.store, false);
    assert.deepEqual(payload.text.format.schema.required, ["description", "warranty_info"]);
    assert.match(payload.instructions, /Do not invent product features/);
    assert.equal(JSON.parse(payload.input).fields.description, "Mouse ringan dengan sensor PAW3950.");
    return new Response(JSON.stringify({
      status: "completed",
      output: [{ content: [{ type: "output_text", text: JSON.stringify({
        description: "A lightweight mouse powered by the PAW3950 sensor.",
        warranty_info: "Official one-year warranty.",
      }) }] }],
    }), { status: 200 });
  };
  try {
    assert.deepEqual(await translateCopy("product", {
      description: "Mouse ringan dengan sensor PAW3950.",
      warranty_info: "Garansi resmi satu tahun.",
    }), {
      description: "A lightweight mouse powered by the PAW3950 sensor.",
      warranty_info: "Official one-year warranty.",
    });
  } finally {
    globalThis.fetch = previousFetch;
    if (previousKey === undefined) delete process.env.OPENAI_API_KEY;
    else process.env.OPENAI_API_KEY = previousKey;
  }
});
