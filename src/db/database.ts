import * as SQLite from "expo-sqlite";

export const databasePromise = SQLite.openDatabaseAsync("ion-browser.db");

export async function initializeDatabase() {
  const db = await databasePromise;
  await db.execAsync(`
        PRAGMA journal_mode = WAL;

        CREATE TABLE IF NOT EXISTS bookmarks (
            id TEXT PRIMARY KEY NOT NULL,
            url TEXT NOT NULL UNIQUE,
            title TEXT NOT NULL,
            created_at INTEGER NOT NULL
        );

        CREATE TABLE IF NOT EXISTS history (
            id TEXT PRIMARY KEY NOT NULL,
            url TEXT NOT NULL,
            title TEXT,
            visited_at INTEGER NOT NULL
        );

        CREATE INDEX IF NOT EXISTS idx_history_visited_at
        ON history(visited_at DESC);
    `);
}
