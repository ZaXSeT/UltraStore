import { getDb } from "./db.ts";

export * from "./cms-types";

export function getSiteSetting<T>(key: string, fallback: T): T {
  try {
    const db = getDb();
    const row = db.prepare("SELECT value_json FROM site_settings WHERE key = ?").get(key) as { value_json: string } | undefined;
    if (!row) return fallback;
    return JSON.parse(row.value_json) as T;
  } catch {
    return fallback;
  }
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
