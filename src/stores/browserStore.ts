import { create } from "zustand";
import type { BrowserTab, Bookmark, HistoryEntry } from "@/types/browser";

const HOME_URL = "https://www.google.com/";

const makeTab = (url = HOME_URL): BrowserTab => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  url,
  title: "New Tab",
  isLoading: false,
  canGoBack: false,
  canGoForward: false,
});

type BrowserStore = {
  tabs: BrowserTab[];
  activeTabId: string;
  bookmarks: Bookmark[];
  history: HistoryEntry[];
  addTab: (url?: string) => string;
  closeTab: (id: string) => void;
  setActiveTab: (id: string) => void;
  updateTab: (id: string, patch: Partial<BrowserTab>) => void;
  addBookmark: (item: Bookmark) => void;
  removeBookmark: (id: string) => void;
  addHistory: (item: HistoryEntry) => void;
};

const firstTab = makeTab();

export const useBrowserStore = create<BrowserStore>((set, get) => ({
  tabs: [firstTab],
  activeTabId: firstTab.id,
  bookmarks: [],
  history: [],

  addTab: (url = HOME_URL) => {
    const tab = makeTab(url);
    set((state) => ({
      tabs: [...state.tabs, tab],
      activeTabId: tab.id,
    }));
    return tab.id;
  },

  closeTab: (id) => {
    const state = get();
    if (state.tabs.length <= 1) {
      const replacement = makeTab(HOME_URL);
      set({ tabs: [replacement], activeTabId: replacement.id });
      return;
    }

    const index = state.tabs.findIndex((tab) => tab.id === id);
    const remaining = state.tabs.filter((tab) => tab.id !== id);
    const nextActive =
      state.activeTabId === id
        ? (remaining[Math.max(0, index - 1)] ?? remaining[0])
        : (remaining.find((tab) => tab.id === state.activeTabId) ??
          remaining[0]);

    set({ tabs: remaining, activeTabId: nextActive.id });
  },

  setActiveTab: (id) =>
    set((state) =>
      state.tabs.some((tab) => tab.id === id) ? { activeTabId: id } : state,
    ),

  updateTab: (id, patch) =>
    set((state) => ({
      tabs: state.tabs.map((tab) =>
        tab.id === id ? { ...tab, ...patch } : tab,
      ),
    })),

  addBookmark: (item) =>
    set((state) =>
      state.bookmarks.some((b) => b.url === item.url)
        ? state
        : { bookmarks: [item, ...state.bookmarks] },
    ),

  removeBookmark: (id) =>
    set((state) => ({
      bookmarks: state.bookmarks.filter((b) => b.id !== id),
    })),

  addHistory: (item) =>
    set((state) => ({
      history: [item, ...state.history.filter((h) => h.url !== item.url)].slice(
        0,
        500,
      ),
    })),
}));
