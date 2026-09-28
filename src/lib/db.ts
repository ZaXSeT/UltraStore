import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";

let dbInstance: DatabaseSync | null = null;

export function getDb(): DatabaseSync {
  if (dbInstance) return dbInstance;

  const dbDir = path.resolve(process.cwd(), "data");
  const defaultPath = path.join(dbDir, "ultrastore.db");

  // In read-only serverless lambdas (like Netlify/AWS Lambda), /var/task is read-only.
  // If write fails, fallback to copying SQLite to /tmp so app can read and write in serverless.
  let dbPath = process.env.DATABASE_PATH || defaultPath;

  if (process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    const tmpDbPath = path.join("/tmp", "ultrastore.db");
    if (!fs.existsSync(tmpDbPath)) {
      if (fs.existsSync(defaultPath)) {
        fs.copyFileSync(defaultPath, tmpDbPath);
      }
    }
    dbPath = tmpDbPath;
  } else {
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }
  }

  const db = new DatabaseSync(dbPath);

  // Performance & Concurrency settings
  db.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA synchronous = NORMAL;
    PRAGMA foreign_keys = ON;
  `);

  initSchema(db);
  dbInstance = db;
  return dbInstance;
}

function initSchema(db: DatabaseSync) {
  // Read schema.sql from src/db/schema.sql
  const schemaPath = path.resolve(process.cwd(), "src/db/schema.sql");
  if (fs.existsSync(schemaPath)) {
    const sql = fs.readFileSync(schemaPath, "utf-8");
    db.exec(sql);
  }
}

// Transaction helper for safe atomic operations
export function runInTransaction<T>(fn: (db: DatabaseSync) => T): T {
  const db = getDb();
  db.exec("BEGIN IMMEDIATE;");
  try {
    const result = fn(db);
    db.exec("COMMIT;");
    return result;
  } catch (err) {
    db.exec("ROLLBACK;");
    throw err;
  }
}
