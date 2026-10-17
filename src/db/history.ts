import { databasePromise } from "@/db/database";
import { HistoryEntry } from "@/types/browser";

// Helper to ensure the schema is initialized
async function ensureSchema() {
  const db = await databasePromise;
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS history (
      id TEXT PRIMARY KEY NOT NULL,
      url TEXT NOT NULL,
      title TEXT,
      visited_at INTEGER NOT NULL
    );
  `);
}

export async function recordVisit(item: HistoryEntry) {
  await ensureSchema();

  const db = await databasePromise;
  await db.runAsync(
    `INSERT INTO history (id, url, title, visited_at) VALUES (?, ?, ?, ?)`,
    item.id,
    item.url,
    item.title,
    item.visitedAt,
  );

  console.log("recorded history");
}

export async function listHistory(): Promise<HistoryEntry[]> {
  await ensureSchema();

  const db = await databasePromise;
  const rows = await db.getAllAsync<{
    id: string;
    url: string;
    title: string;
    visited_at: number;
  }>(
    "SELECT id,url,title,visited_at FROM history ORDER BY visited_at DESC LIMIT 50",
  );

  return rows.map((r) => ({
    id: r.id,
    url: r.url,
    title: r.title,
    visitedAt: r.visited_at,
  }));
}

export async function clearHistory() {
  await ensureSchema();

  const db = await databasePromise;
  await db.runAsync("DELETE FROM history");
}
