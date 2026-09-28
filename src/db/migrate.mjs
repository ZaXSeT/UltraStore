import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "../..");
const dataDir = path.resolve(rootDir, "data");

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = process.env.DATABASE_PATH || path.join(dataDir, "ultrastore.db");
console.log(`[UltraStore DB] Running migration on: ${dbPath}`);

const schemaSqlPath = path.join(__dirname, "schema.sql");
const schemaSql = fs.readFileSync(schemaSqlPath, "utf-8");

const db = new DatabaseSync(dbPath);

db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA synchronous = NORMAL;
  PRAGMA foreign_keys = ON;
`);

db.exec(schemaSql);
const productColumns = db.prepare("PRAGMA table_info(products)").all();
if (!productColumns.some((column) => column.name === "description_en")) {
  db.exec("ALTER TABLE products ADD COLUMN description_en TEXT NOT NULL DEFAULT ''");
}

// Verify tables created
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name").all();
console.log(`[UltraStore DB] Migration successful. Active tables (${tables.length}):`);
for (const t of tables) {
  console.log(` - ${t.name}`);
}
