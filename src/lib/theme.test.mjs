import test from "node:test";
import assert from "node:assert/strict";
import { DEFAULT_THEME_CONFIG, THEME_PRESETS, normalizeTheme, validateTheme } from "./theme.ts";

test("all storefront theme presets have readable button and body text", () => {
  for (const preset of THEME_PRESETS) {
    assert.equal(validateTheme(preset.colors), true, preset.name);
  }
});

test("invalid or unreadable theme values cannot replace the safe default", () => {
  assert.equal(validateTheme({ ...DEFAULT_THEME_CONFIG, accent: "#FFFFFF" }), false);
  assert.equal(validateTheme({ ...DEFAULT_THEME_CONFIG, ink: "#EEEEEE" }), false);
  assert.equal(validateTheme({ ...DEFAULT_THEME_CONFIG, accent: "blue" }), false);
  assert.deepEqual(normalizeTheme({ ...DEFAULT_THEME_CONFIG, accent: "#FFFFFF" }), DEFAULT_THEME_CONFIG);
});
