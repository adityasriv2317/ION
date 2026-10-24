import { useBrowserStore } from "@/stores/browserStore";

export const useVisibleTabs = () =>
  useBrowserStore((state) =>
    state.isIncognito ? state.incognitoTabs : state.tabs,
  );

export const useActiveTabId = () =>
  useBrowserStore((state) =>
    state.isIncognito ? state.incognitoActiveTabId : state.activeTabId,
  );

export const useActiveTab = () =>
  useBrowserStore((state) => {
    const tabs = state.isIncognito ? state.incognitoTabs : state.tabs;
    const activeTabId = state.isIncognito
      ? state.incognitoActiveTabId
      : state.activeTabId;

    return tabs.find((tab) => tab.id === activeTabId) ?? tabs[0];
  });

export const useHasHydrated = () =>
  useBrowserStore((state) => state.hasHydrated);

