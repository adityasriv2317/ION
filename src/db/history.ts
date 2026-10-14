import { databasePromise } from "@/db/database";
import { HistoryEntry } from "@/types/browser";

export async function recordVisit(item: HistoryEntry) {
  const db = await databasePromise;
  await db.runAsync(`
    INSERT INTO history(id,url,title,visited_at)
    VALUES(?,?,?,?)`);
}

export async function listHistory(): Promise<HistoryEntry[]> {
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
