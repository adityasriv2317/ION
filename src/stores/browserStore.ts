import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type {
  BrowserTab,
  Bookmark,
  Favourite,
  HistoryEntry,
} from "@/types/browser";

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
  incognitoTabs: BrowserTab[];
  activeTabId: string; // currently active/main tab it
  incognitoActiveTabId: string | null;
  bookmarks: Bookmark[]; // array of bookmarks
  favourites: Favourite[];
  history: HistoryEntry[]; // array of history
  isIncognito: boolean;

  // functions of the browser
  addTab: (url?: string) => string;
  closeTab: (id: string) => void;
  setActiveTab: (id: string) => void;
  updateTab: (id: string, patch: Partial<BrowserTab>) => void;
  addBookmark: (item: Bookmark) => void;
  removeBookmark: (id: string) => void;
  setFavourites: (items: Favourite[]) => void;
  addHistory: (item: HistoryEntry) => void;
  setIncognito: (value: boolean) => void;

  // data hydration - tracks whether saved state is restored or not
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
};

const firstTab = makeTab();

export const useBrowserStore = create<BrowserStore>()(
  persist(
    (set, get) => ({
      tabs: [firstTab],
      incognitoTabs: [],
      activeTabId: firstTab.id,
      incognitoActiveTabId: null,
      bookmarks: [],
      favourites: [
        { id: "youtube", title: "YouTube", url: "https://www.youtube.com" },
        { id: "github", title: "GitHub", url: "https://github.com" },
        { id: "reddit", title: "Reddit", url: "https://www.reddit.com" },
        {
          id: "wikipedia",
          title: "Wikipedia",
          url: "https://www.wikipedia.org",
        },
      ],
      history: [],
      isIncognito: false,

      addTab: (url = HOME_URL) => {
        const tab = makeTab(url);
        set((state) =>
          state.isIncognito
            ? {
                incognitoTabs: [...state.incognitoTabs, tab],
                incognitoActiveTabId: tab.id,
              }
            : {
                tabs: [...state.tabs, tab],
                activeTabId: tab.id,
              },
        );
        return tab.id;
      },

      closeTab: (id) => {
        const state = get();
        const currentTabs = state.isIncognito
          ? state.incognitoTabs
          : state.tabs;
        if (currentTabs.length <= 1) {
          const replacement = makeTab(HOME_URL);
          set(
            state.isIncognito
              ? {
                  incognitoTabs: [replacement],
                  incognitoActiveTabId: replacement.id,
                }
              : { tabs: [replacement], activeTabId: replacement.id },
          );
          return;
        }

        const index = currentTabs.findIndex((tab) => tab.id === id);
        const remaining = currentTabs.filter((tab) => tab.id !== id);
        const currentActiveTabId = state.isIncognito
          ? state.incognitoActiveTabId
          : state.activeTabId;
        const nextActive =
          currentActiveTabId === id
            ? (remaining[Math.max(0, index - 1)] ?? remaining[0])
            : (remaining.find((tab) => tab.id === currentActiveTabId) ??
              remaining[0]);

        set(
          state.isIncognito
            ? { incognitoTabs: remaining, incognitoActiveTabId: nextActive.id }
            : { tabs: remaining, activeTabId: nextActive.id },
        );
      },

      setActiveTab: (id) =>
        set((state) => {
          const currentTabs = state.isIncognito
            ? state.incognitoTabs
            : state.tabs;
          if (!currentTabs.some((tab) => tab.id === id)) return state;
          return state.isIncognito
            ? { incognitoActiveTabId: id }
            : { activeTabId: id };
        }),

      updateTab: (id, patch) =>
        set((state) => {
          // Check if the tab exists in the normal tabs array
          if (state.tabs.some((tab) => tab.id === id)) {
            return {
              tabs: state.tabs.map((tab) =>
                tab.id === id ? { ...tab, ...patch } : tab,
              ),
            };
          }
          // Check if the tab exists in the incognito array
          if (state.incognitoTabs.some((tab) => tab.id === id)) {
            return {
              incognitoTabs: state.incognitoTabs.map((tab) =>
                tab.id === id ? { ...tab, ...patch } : tab,
              ),
            };
          }
          return state;
        }),

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

      setFavourites: (items) => set({ favourites: items }),

      addHistory: (item) =>
        set((state) => ({
          history: [
            item,
            ...state.history.filter((h) => h.url !== item.url),
          ].slice(0, 500),
        })),

      setIncognito: (value) =>
        set((state) => {
          if (value === state.isIncognito) return state;

          if (value) {
            // Restore existing session, or create a new one if empty
            const hasExistingTabs = state.incognitoTabs.length > 0;
            const initialTab = makeTab(HOME_URL);

            return {
              isIncognito: true,
              incognitoTabs: hasExistingTabs
                ? state.incognitoTabs
                : [initialTab],
              incognitoActiveTabId: hasExistingTabs
                ? state.incognitoActiveTabId
                : initialTab.id,
            };
          }

          // Return to normal mode WITHOUT wiping the incognito background tabs
          const regularActiveTab =
            state.tabs.find((tab) => tab.id === state.activeTabId) ??
            state.tabs[0] ??
            makeTab(HOME_URL);

          return {
            isIncognito: false,
            tabs: state.tabs.length > 0 ? state.tabs : [regularActiveTab],
            activeTabId: regularActiveTab.id,
          };
        }),

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
        favourites: state.favourites,
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
