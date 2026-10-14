import * as SQLite from "expo-sqlite";

export const tabsPromis = SQLite.openDatabaseAsync("ion-browser.db");
