import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { BrowserTab, Bookmark, HistoryEntry } from "@/types/browser";

export const HOME_URL = "ion://home";

const makeTab = (url = HOME_URL): BrowserTab => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  url,
  title: url === HOME_URL ? "Home - ION" : "New Tab",
  isLoading: false,
  canGoBack: false,
  canGoForward: false,
});

type BrowserStore = {
  // array of data
  tabs: BrowserTab[]; // stores the currently present tabs
  activeTabId: string; // currently active/main tab it
  bookmarks: Bookmark[]; // array of bookmarks
  history: HistoryEntry[]; // array of history

  // functions of the browser
  addTab: (url?: string) => string;
  closeTab: (id: string) => void;
  setActiveTab: (id: string) => void;
  updateTab: (id: string, patch: Partial<BrowserTab>) => void;
  addBookmark: (item: Bookmark) => void;
  removeBookmark: (id: string) => void;
  addHistory: (item: HistoryEntry) => void;

  // data hydration - tracks whether saved state is restored or not
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
};

const firstTab = makeTab();

export const useBrowserStore = create<BrowserStore>()(
  persist(
    (set, get) => ({
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
          history: [
            item,
            ...state.history.filter((h) => h.url !== item.url),
          ].slice(0, 500),
        })),

      hasHydrated: false,
      setHasHydrated: (value) => {
        set({ hasHydrated: value });
      },
    }),
    {
      name: "ion-persistent-storage",
      storage: createJSONStorage(() => AsyncStorage),

      // save durable data and not the webview status
      partialize: (state) => ({
        tabs: state.tabs.map((tab) => ({
          ...tab,
          isLoading: false,
          canGoBack: false,
          canGoForward: false,
        })),
        activeTabId: state.activeTabId,
        bookmarks: state.bookmarks,
        history: state.history,
      }),

      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error(
            "Failed to hydrate memory with local storage : ",
            error,
          );
        }

        state?.setHasHydrated(true);
      },
    },
  ),
);

// export const useBrowserStorea = create<BrowserStore>((set, get) => ({
//   tabs: [firstTab],
//   activeTabId: firstTab.id,
//   bookmarks: [],
//   history: [],

//   addTab: (url = HOME_URL) => {
//     const tab = makeTab(url);
//     set((state) => ({
//       tabs: [...state.tabs, tab],
//       activeTabId: tab.id,
//     }));
//     return tab.id;
//   },

//   closeTab: (id) => {
//     const state = get();
//     if (state.tabs.length <= 1) {
//       const replacement = makeTab(HOME_URL);
//       set({ tabs: [replacement], activeTabId: replacement.id });
//       return;
//     }

//     const index = state.tabs.findIndex((tab) => tab.id === id);
//     const remaining = state.tabs.filter((tab) => tab.id !== id);
//     const nextActive =
//       state.activeTabId === id
//         ? (remaining[Math.max(0, index - 1)] ?? remaining[0])
//         : (remaining.find((tab) => tab.id === state.activeTabId) ??
//           remaining[0]);

//     set({ tabs: remaining, activeTabId: nextActive.id });
//   },

//   setActiveTab: (id) =>
//     set((state) =>
//       state.tabs.some((tab) => tab.id === id) ? { activeTabId: id } : state,
//     ),

//   updateTab: (id, patch) =>
//     set((state) => ({
//       tabs: state.tabs.map((tab) =>
//         tab.id === id ? { ...tab, ...patch } : tab,
//       ),
//     })),

//   addBookmark: (item) =>
//     set((state) =>
//       state.bookmarks.some((b) => b.url === item.url)
//         ? state
//         : { bookmarks: [item, ...state.bookmarks] },
//     ),

//   removeBookmark: (id) =>
//     set((state) => ({
//       bookmarks: state.bookmarks.filter((b) => b.id !== id),
//     })),

//   addHistory: (item) =>
//     set((state) => ({
//       history: [item, ...state.history.filter((h) => h.url !== item.url)].slice(
//         0,
//         500,
//       ),
//     })),
// }));
