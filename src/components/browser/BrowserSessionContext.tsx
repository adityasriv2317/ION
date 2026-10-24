import {
  createContext,
  useContext,
  useMemo,
  type PropsWithChildren,
} from "react";
import type { WebView as WebViewType } from "react-native-webview";
import { HOME_URL } from "@/stores/browserStore";
import type { BrowserTab } from "@/types/browser";

type BrowserSessionValue = {
  activeTab: BrowserTab;
  tabCount: number;
  isHome: boolean;
  navigate: (input: string) => void;
  goBack: () => void;
  goForward: () => void;
  reload: () => void;
  openTabs: () => void;
};

type BrowserSessionProviderProps = PropsWithChildren<{
  activeTab: BrowserTab;
  tabCount: number;
  webViewsRef: { current: Map<string, WebViewType> };
  navigate: (input: string) => void;
  goBack: () => void;
  openTabs: () => void;
}>;

const BrowserSessionContext = createContext<BrowserSessionValue | null>(null);

export function BrowserSessionProvider({
  activeTab,
  tabCount,
  webViewsRef,
  navigate,
  goBack,
  openTabs,
  children,
}: BrowserSessionProviderProps) {
  const value = useMemo<BrowserSessionValue>(
    () => ({
      activeTab,
      tabCount,
      isHome: activeTab.url === HOME_URL,
      navigate,
      goBack,
      goForward: () => webViewsRef.current.get(activeTab.id)?.goForward(),
      reload: () => webViewsRef.current.get(activeTab.id)?.reload(),
      openTabs,
    }),
    [activeTab, goBack, navigate, openTabs, tabCount, webViewsRef],
  );

  return (
    <BrowserSessionContext.Provider value={value}>
      {children}
    </BrowserSessionContext.Provider>
  );
}

export function useBrowserSession() {
  const context = useContext(BrowserSessionContext);

  if (!context) {
    throw new Error(
      "useBrowserSession must be used within BrowserSessionProvider",
    );
  }

  return context;
}
