# Persistence with SQLite

This guide describes how to persist browser tabs, bookmarks, and browsing history
in Ion. It is intentionally a design and implementation guide; it does not modify
the application code.

The project already includes `expo-sqlite` (`~57.0.4`) and opens
`ion-browser.db` in `src/db/database.ts`. The database should be the durable
source of truth for browser data. Zustand should remain the fast, in-memory UI
state that is hydrated from SQLite when the app starts and written back whenever
the user changes browser data.

For the Expo SDK version used by this project, use the SQLite API documented at:
<https://docs.expo.dev/versions/v57.0.0/sdk/sqlite/>.

## 1. Recommended responsibilities

Use one layer for each responsibility:

| Layer | Responsibility |
| --- | --- |
| `src/db/database.ts` | Open the database, enable database settings, create tables, and run migrations. |
| Database repository modules | Execute parameterized SQL for tabs, bookmarks, and history. |
| `src/stores/browserStore.ts` | Hold the current UI state and expose actions such as `addTab`, `closeTab`, and `setActiveTab`. |
| Screens and browser events | Call store actions and persistence repository functions at the appropriate lifecycle events. |

Do not make screens directly responsible for the schema or for keeping two
copies of the same SQL. Bookmarks and history currently have database functions
inside screen files; moving those functions into database/repository modules
will make startup hydration and writes consistent across every screen.

`AsyncStorage` is suitable for small preferences such as whether the welcome
screen was shown. It is not the best source of truth for relational browser
records, ordering, uniqueness, retention queries, or migrations.

## 2. Database schema

### Tabs

Persist one row per open tab. The order must be stored explicitly; an array
position in JavaScript is not durable.

```sql
CREATE TABLE IF NOT EXISTS tabs (
  id TEXT PRIMARY KEY NOT NULL,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  position INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tabs_position
ON tabs(position);
```

Store only properties that need to survive relaunch. The current tab type also
contains `isLoading`, `canGoBack`, and `canGoForward`. Those are runtime
WebView/navigation values and should be recalculated after restoring a tab,
rather than persisted as authoritative state.

### Active tab

Keep the active tab ID in a singleton settings table rather than duplicating an
`is_active` value across every tab row:

```sql
CREATE TABLE IF NOT EXISTS browser_state (
  key TEXT PRIMARY KEY NOT NULL,
  value TEXT NOT NULL
);
```

The active tab is stored as:

```sql
INSERT INTO browser_state(key, value)
VALUES ('active_tab_id', ?)
ON CONFLICT(key) DO UPDATE SET value = excluded.value;
```

This makes selecting a tab a single-row update and guarantees that there is at
most one persisted active tab. On restore, verify that the saved ID still
exists. If it does not, use the first restored tab, or create a new home tab if
the table is empty.

An alternative is an `is_active INTEGER NOT NULL DEFAULT 0` column on `tabs`.
The singleton approach is preferable because it avoids a multi-row update and
the possibility of restoring multiple active tabs.

### Bookmarks

The existing bookmark shape maps to:

```sql
CREATE TABLE IF NOT EXISTS bookmarks (
  id TEXT PRIMARY KEY NOT NULL,
  url TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  created_at INTEGER NOT NULL
);
```

The unique URL constraint prevents duplicate bookmarks. Use an upsert when a
bookmark for the URL already exists, and use a `DELETE ... WHERE id = ?` for
deletion. Bookmarks should not be removed by history-retention cleanup.

### History

History should retain each visit event, including repeated visits to the same
URL. Use a separate ID for every event:

```sql
CREATE TABLE IF NOT EXISTS history (
  id TEXT PRIMARY KEY NOT NULL,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  visited_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_history_visited_at
ON history(visited_at DESC);
```

Use Unix milliseconds consistently for `created_at`, `updated_at`, and
`visited_at`, for example `Date.now()`. Do not mix milliseconds, seconds, and
formatted date strings in the same columns.

## 3. Database initialization

The app should open and initialize the database before any screen attempts to
read or write browser data:

1. Await the existing `databasePromise`.
2. Enable the chosen journal mode (WAL is appropriate for this local database).
3. Create the tables and indexes with `IF NOT EXISTS`.
4. Run migrations in version order.
5. Only then hydrate Zustand and render browser content.

Initialization must be idempotent: it should be safe to run on every app
startup. Keep a schema version using SQLite's `PRAGMA user_version`, or an
equivalent migration table. Never change an existing table definition and
assume old installations will automatically receive the new columns.

For example, a future migration that adds a tab timestamp should:

```sql
ALTER TABLE tabs ADD COLUMN updated_at INTEGER NOT NULL DEFAULT 0;
PRAGMA user_version = 2;
```

In the real migration runner, check the current version, apply each missing
migration exactly once, and advance the version only after that migration
succeeds. If a migration fails, surface the error and do not report the
database as ready.

## 4. Startup restore flow

Restore browser state before allowing actions that could overwrite it:

1. Initialize the database.
2. Query tabs ordered by `position ASC`.
3. Query `active_tab_id` from `browser_state`.
4. Validate and normalize the result:
   - discard rows with an invalid empty ID or URL;
   - sort by `position`;
   - repair duplicate or missing positions if necessary;
   - ensure the active ID belongs to the restored tab list.
5. If no tabs exist, create one home tab and persist it.
6. Set the hydrated tabs and active ID in Zustand in one state update.
7. Load bookmarks and history separately and set their in-memory values.
8. Mark hydration complete, then enable normal user actions.

Use a `hydrating` or `isPersistenceReady` flag so a default in-memory tab
cannot overwrite the saved tab list while the first database query is still
running. This race is one of the most common causes of “persistence sometimes
works” behavior.

## 5. Persisting tab changes

Every store action that changes durable tab state should have a corresponding
database write:

| User action | Database operation |
| --- | --- |
| Create tab | Insert the new tab with the next `position`, then save it as active. |
| Close tab | Delete the row. If it was active, choose and persist the replacement active ID. |
| Select tab | Update `browser_state.active_tab_id`. |
| Navigate | Update that tab's `url`, `title`, and `updated_at`. |
| Reorder tabs | Update all affected `position` values in one transaction. |
| App background/termination | Flush any pending writes before the app is suspended. |

Persist the URL and title after navigation has committed, not on every
intermediate WebView loading callback. Debounce frequent title/URL updates if
the browser emits several events for one navigation.

When reordering, write the complete intended order in a transaction:

```sql
BEGIN;
UPDATE tabs SET position = ?, updated_at = ? WHERE id = ?;
UPDATE tabs SET position = ?, updated_at = ? WHERE id = ?;
COMMIT;
```

Use bound parameters for every value. Do not concatenate URLs, titles, IDs, or
user-provided strings into SQL. If any update fails, roll back the transaction
and keep the in-memory state consistent with the last successful persistence
operation.

## 6. Persisting bookmarks and history

### Bookmarks

When the user adds a bookmark:

1. Validate that the URL is non-empty and supported by the browser.
2. Insert or upsert the bookmark in SQLite.
3. Update Zustand only after the write succeeds, or deliberately mark the UI
   item as pending and handle a failed write visibly.

When the user deletes a bookmark, delete by its stable ID and then remove it
from the store. Do not delete by title because titles are not unique.

### History

Record a visit after a successful page navigation. Pass all values explicitly:

```sql
INSERT INTO history(id, url, title, visited_at)
VALUES (?, ?, ?, ?);
```

Do not deduplicate history unless that is an explicit product requirement. If
the desired behavior is “one latest row per URL,” use a separate last-visited
model or a deliberate upsert policy; otherwise, repeated visits will be lost.

The current store keeps only 500 entries and the current history query returns
50 entries. Decide whether those are UI display limits, database retention
limits, or both. They should not be confused:

- **Display limit:** query the newest 50 rows but retain older rows.
- **Retention limit:** delete rows beyond a configured count.
- **Time retention:** delete rows older than a configured number of days.

For time-based retention, run a maintenance query at startup or after recording
a visit:

```sql
DELETE FROM history
WHERE visited_at < ?;
```

Calculate the cutoff in JavaScript using the selected retention setting, and
bind it as a parameter. If a count-based limit is required, delete older rows
using a subquery ordered by `visited_at`, and document whether the limit is
global or per profile.

## 7. Transactions and concurrency

Use a transaction when multiple records must change together. Examples include
closing the active tab and selecting its replacement, or replacing the entire
tab order. A transaction prevents a crash between two statements from leaving
the active ID pointing to a deleted tab.

Avoid issuing writes from several independent UI callbacks without ordering.
A simple approach is a small persistence queue that serializes writes per
database connection. The queue should:

- preserve operation order;
- reject and report failed writes;
- avoid silently swallowing errors;
- allow the next write to proceed after a failure;
- be flushed when the app enters the background where the platform lifecycle
  permits it.

The store and database can be synchronized in either direction, but choose one
consistent rule. A reliable rule is: validate the action, write the durable
change, then publish the successful result to the store. For latency-sensitive
actions such as selecting a tab, update the store immediately and queue the
single active-ID write, but make failures observable and retryable.

## 8. Important issues to fix when implementing

The current database code is a starting point, but it should be corrected as
part of the eventual persistence implementation:

- The `history` table definition is missing a comma after `id TEXT PRIMARY KEY
  NOT NULL`.
- The column names are inconsistent: the table definition uses `visited_ar`,
  while queries use `visited_at`. Use `visited_at` consistently.
- The history insert function currently has placeholders but does not pass the
  `HistoryEntry` values as bound arguments.
- The database initialization function must actually be called during app
  startup before `listBookmarks`, `listHistory`, or any tab repository method.
- The current Zustand store starts with a generated default tab. It must not
  overwrite restored tabs during hydration.
- The current tab type has no persisted order field. Derive order from the
  array when writing, or add a repository mapping that assigns `position`.
- Bookmark/history repository functions should not be defined inside route
  screen files if startup hydration and background events also need them.

These are integration concerns, not reasons to store browser data in
`AsyncStorage`; SQLite remains the appropriate durable store.

## 9. Error handling and recovery

Database errors should be logged with enough context to diagnose the failed
operation, without logging sensitive page contents or credentials. The UI
should not show a successful bookmark or claim that a tab was saved if the
write failed.

Consider these recovery paths:

- If initialization fails, show a recoverable storage error and prevent
  destructive actions until the database is ready.
- If one tab row is malformed, skip or repair that row and keep valid tabs.
- If the active tab is missing, select the first valid tab and persist the
  repaired active ID.
- If a write fails temporarily, retry through the persistence queue.
- If schema migration fails, preserve the database and report the migration
  failure rather than deleting user bookmarks or history.

Do not clear or recreate the database as a general error fallback. That would
destroy bookmarks and history.

## 10. Verification checklist

Test on a fresh install and on an installation containing existing data:

- Create several tabs, navigate each to a different URL, reorder them, select a
  non-first tab, force-close the app, and reopen it.
- Confirm the same tab IDs, URLs, titles, order, and active tab are restored.
- Close the active tab and confirm the selected replacement is restored after
  relaunch.
- Add a bookmark, restart the app, verify it remains, then delete it and verify
  it does not return.
- Visit the same URL multiple times and confirm the behavior matches the chosen
  history policy.
- Verify timestamps are ordered correctly and the retention policy removes only
  intended rows.
- Test navigation, bookmark, tab, and history actions while initialization is
  still pending.
- Test an interrupted or failed write and confirm the UI reports the failure
  without silently losing existing data.
- Test schema migration from the previous database version.

The persistence boundary is complete when the app can be killed and restarted
at any point without losing a successfully committed tab, bookmark, or history
record, while incomplete writes either roll back or are reported for retry.
