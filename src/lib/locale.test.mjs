import test from "node:test";
import assert from "node:assert/strict";
import { parseLocale, copy, categoryLabel, deliveryEstimate, orderStatus } from "./locale.ts";
import { localizeAnnouncement, localizeHero } from "./localized-cms.ts";
import { DEFAULT_ANNOUNCEMENT_CONFIG, DEFAULT_HERO_CONFIG } from "./cms-types.ts";

test("language preference accepts only supported locales", () => {
  assert.equal(parseLocale("en"), "en");
  assert.equal(parseLocale("id"), "id");
  assert.equal(parseLocale("fr"), "id");
  assert.equal(parseLocale(undefined), "id");
});

test("store copy and dynamic labels follow the selected language", () => {
  assert.equal(copy("id", "Lacak Pesanan", "Track Order"), "Lacak Pesanan");
  assert.equal(copy("en", "Lacak Pesanan", "Track Order"), "Track Order");
  assert.equal(categoryLabel("switches-parts", "Switches & Parts", "id"), "Switch & Komponen");
  assert.equal(deliveryEstimate("05–15 Desember 2026", "en"), "05–15 December 2026");
  assert.equal(orderStatus("waiting_supplier", "en"), "Awaiting Supplier");
});

test("merchant English copy overrides defaults while blank fields keep the authored fallback", () => {
  const announcement = localizeAnnouncement({
    ...DEFAULT_ANNOUNCEMENT_CONFIG,
    english: { primaryText: "A message written for English customers", secondaryText: "" },
  }, "en");
  assert.equal(announcement.primaryText, "A message written for English customers");
  assert.equal(announcement.secondaryText, "Ships from Jakarta");

  const hero = localizeHero({ ...DEFAULT_HERO_CONFIG, english: { description: "Custom product story" } }, "en");
  assert.equal(hero.description, "Custom product story");
  assert.equal(hero.titleLine1, DEFAULT_HERO_CONFIG.titleLine1);
  assert.equal(localizeHero(DEFAULT_HERO_CONFIG, "id").description, DEFAULT_HERO_CONFIG.description);
});
