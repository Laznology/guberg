import { Database as BunDatabase } from "bun:sqlite";
import { mkdirSync } from "node:fs";

import { drizzle } from "drizzle-orm/bun-sqlite";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";

mkdirSync("./data", { recursive: true });

const sqlite = new BunDatabase("./data/gutenberg.sqlite", { create: true });

sqlite.run("PRAGMA journal_mode = WAL;");

sqlite.run("PRAGMA synchronous = NORMAL;");

sqlite.run("PRAGMA foreign_keys = ON;");

export const db = drizzle({
  client: sqlite,
});

migrate(db, { migrationsFolder: "./drizzle" });

export type Database = typeof db;
