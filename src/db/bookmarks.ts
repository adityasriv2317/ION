import { databasePromise } from "@/db/database";
import type { Bookmark } from "@/types/browser";

async function ensureSchema() {
  const db = await databasePromise;
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS bookmarks (
      id TEXT PRIMARY KEY NOT NULL,
      url TEXT NOT NULL,
      title TEXT,
      created_at INTEGER NOT NULL
    );
  `);
}

export async function saveBookmark(item: Bookmark) {
  await ensureSchema();

  const db = await databasePromise;
  await db.runAsync(
    `INSERT INTO bookmarks (id, url, title, created_at)
    VALUES(?,?,?,?)
    ON CONFLICT(url) DO UPDATE SET title = excluded.title`,
    item.id,
    item.url,
    item.title,
    item.createdAt,
  );
}

export async function listBookmarks(): Promise<Bookmark[]> {
  await ensureSchema();

  const db = await databasePromise;
  const rows = await db.getAllAsync<{
    id: string;
    url: string;
    title: string;
    created_at: number;
  }>(
    "SELECT id, url, title, created_at FROM bookmarks ORDER BY created_at DESC",
  );

  //   return rows.map((r) => ({
  //     id, url, title, createdAt:
  //   }))

  return rows.map((r) => ({
    id: r.id,
    url: r.url,
    title: r.title,
    createdAt: r.created_at,
  }));
}
