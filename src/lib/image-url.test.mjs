import assert from "node:assert/strict";
import test from "node:test";
import { r2ImageUrl, resolveR2ImageUrl } from "./image-url.ts";

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
