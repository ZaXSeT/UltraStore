import assert from "node:assert/strict";
import test from "node:test";
import { r2ImageUrl, resolveR2ImageUrl, r2ProxyFallbackUrl } from "./image-url.ts";

test("R2 URLs use the public hostname when it is configured", () => {
  const publicUrl = "https://assets.ultrastore.id/";
  assert.equal(r2ImageUrl("/products/example.webp", publicUrl), "https://assets.ultrastore.id/products/example.webp");
  assert.equal(resolveR2ImageUrl("/api/r2/cms/hero.png", publicUrl), "https://assets.ultrastore.id/cms/hero.png");
  assert.equal(resolveR2ImageUrl("http://localhost:3000/api/r2/brands/logo.svg", publicUrl), "https://assets.ultrastore.id/brands/logo.svg");
  assert.equal(resolveR2ImageUrl("https://images.example.com/photo.jpg", publicUrl), "https://images.example.com/photo.jpg");
});

test("R2 URLs continue through the proxy until public access is configured", () => {
  assert.equal(r2ImageUrl("products/example.webp", ""), "/api/r2/products/example.webp");
  assert.equal(resolveR2ImageUrl("/api/r2/products/example.webp", ""), "/api/r2/products/example.webp");
});

test("a failed public R2 image can retry through the same-origin R2 proxy", () => {
  assert.equal(r2ProxyFallbackUrl("https://pub-example.r2.dev/products/example.webp"), "/api/r2/products/example.webp");
  assert.equal(r2ProxyFallbackUrl("https://assets.ultrastore.id/cms/hero.png"), "/api/r2/cms/hero.png");
  assert.equal(r2ProxyFallbackUrl("https://cdn.example.com/brands/logo.svg"), "/api/r2/brands/logo.svg");
  assert.equal(r2ProxyFallbackUrl("/api/r2/products/example.webp"), null);
  assert.equal(r2ProxyFallbackUrl("https://images.example.com/photo/example.webp"), null);
});
