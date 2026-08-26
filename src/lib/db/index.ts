import BetterSqlite3 from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";

export const DB_FILE = process.env.DATABASE_FILE ?? "ticketbro.db";

/**
 * Reuse the connection across dev-server hot reloads — otherwise every reload
 * opens another handle to the file and they are never closed.
 */
const globalForDb = globalThis as typeof globalThis & {
  sqlite?: BetterSqlite3.Database;
};

const sqlite = (globalForDb.sqlite ??= new BetterSqlite3(DB_FILE));
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");

export const db = drizzle(sqlite, { schema });
export { schema };
