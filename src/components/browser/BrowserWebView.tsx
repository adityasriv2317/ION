import { useRef, useMemo } from "react";
import {
  View,
  ActivityIndicator,
  StyleSheet,
  PanResponder,
  Platform,
} from "react-native";
import WebView, { type WebView as WebViewType } from "react-native-webview";
import type { WebViewNavigation } from "react-native-webview/lib/WebViewTypes";
import { useBrowserStore } from "../../stores/browserStore";

import { recordVisit } from "@/db/history";

function createHistoryId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

type Props = {
  tabId: string;
  url: string;
  onRef?: (ref: WebViewType | null) => void;
  onSwipeBackToHome?: () => void;
};

const extractFaviconJS = `
  (function() {
    const getFavicon = () => {
      let favicon = undefined;
      const nodeList = document.getElementsByTagName("link");
      for (let i = 0; i < nodeList.length; i++) {
        if((nodeList[i].getAttribute("rel") === "icon") || (nodeList[i].getAttribute("rel") === "shortcut icon")) {
          favicon = nodeList[i].getAttribute("href");
        }
      }
      // Ensure the URL is absolute
      if (favicon && !favicon.startsWith('http')) {
        favicon = new URL(favicon, window.location.href).href;
      }
      return favicon;
    }

    const iconUrl = getFavicon();
    if (iconUrl) {
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'FAVICON',
        payload: iconUrl
      }));
    }
  })();
  true; // Required for injectedJavaScript to run silently
`;

export const getFaviconUrl = (pageUrl: string) => {
  if (!pageUrl) return undefined;

  try {
    // Force a protocol so new URL() doesn't fail on bare domains
    const validUrl = pageUrl.startsWith("http")
      ? pageUrl
      : `https://${pageUrl}`;
    const domain = new URL(validUrl).hostname;

    if (!domain || domain === "localhost") return undefined;

    return `https://www.google.com/s2/favicons?sz=64&domain_url=${domain}`;
  } catch (error) {
    return undefined;
  }
};

export default function BrowserWebView({
  tabId,
  url,
  onRef,
  onSwipeBackToHome,
}: Props) {
  const ref = useRef<WebViewType>(null);
  const pendingNavigationUrl = useRef<string | null>(null);
  const lastRecordedUrl = useRef<string | null>(null);
  const updateTab = useBrowserStore((s) => s.updateTab);
  const canGoBack = useBrowserStore(
    (s) =>
      (s.isIncognito ? s.incognitoTabs : s.tabs).find((t) => t.id === tabId)
        ?.canGoBack ?? false,
  );

  const onNavigationStateChange = (nav: WebViewNavigation) => {
    updateTab(tabId, {
      url: nav.url,
      title: nav.title || nav.url,
      isLoading: nav.loading,
      canGoBack: nav.canGoBack,
      canGoForward: nav.canGoForward,
    });

    if (nav.loading) {
      pendingNavigationUrl.current = nav.url;
      return;
    }

    const isCompletedNavigation =
      pendingNavigationUrl.current === nav.url ||
      (pendingNavigationUrl.current === null &&
        lastRecordedUrl.current !== nav.url);
    pendingNavigationUrl.current = null;

    if (!isCompletedNavigation || !/^https?:\/\//i.test(nav.url)) {
      return;
    }

    lastRecordedUrl.current = nav.url;
    if (useBrowserStore.getState().isIncognito) {
      return;
    }

    void recordVisit({
      id: createHistoryId(),
      url: nav.url,
      title: nav.title || nav.url,
      visitedAt: Date.now(),
    }).catch((error: unknown) => {
      console.error("Failed to save history entry.", error);
    });
  };

  const swipeHandler = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, st) => {
          return st.dx > 15 && Math.abs(st.dx) > Math.abs(st.dy) * 1.5;
        },
        onPanResponderRelease: (_, st) => {
          if (st.dx > 60 || st.vx > 0.5) {
            onSwipeBackToHome?.();
          }
        },
      }),
    [onSwipeBackToHome],
  );

  const onMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === "FAVICON" && data.payload) {
        // Save the favicon to the current tab in the store
        updateTab(tabId, { favicon: data.payload });
      }
    } catch (e) {
      // Ignore parse errors from other scripts
    }
  };

  return (
    <View style={styles.container}>
      <WebView
        ref={(node) => {
          ref.current = node;
          onRef?.(node);
        }}
        source={{ uri: url }}
        onNavigationStateChange={onNavigationStateChange}
        onLoadStart={() => updateTab(tabId, { isLoading: true })}
        onLoadEnd={() => updateTab(tabId, { isLoading: false })}
        onError={() => updateTab(tabId, { isLoading: false })}
        onHttpError={() => updateTab(tabId, { isLoading: false })}
        javaScriptEnabled
        domStorageEnabled
        setSupportMultipleWindows={false}
        startInLoadingState
        pullToRefreshEnabled
        allowsBackForwardNavigationGestures={true}
        scrollEnabled
        // onMessage={onMessage} // message listener
        // injectedJavaScript={extractFaviconJS} // Inject the script
        renderLoading={() => (
          <View
            style={{
              ...StyleSheet.absoluteFill,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#11111B",
              zIndex: 10,
            }}
          >
            <ActivityIndicator size="large" />
          </View>
        )}
      />

      {Platform.OS === "ios" && !canGoBack && (
        <View
          {...swipeHandler.panHandlers}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 24,
            zIndex: 20,
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "absolute",
    inset: 0,
    backgroundColor: "#11111B",
  },
});
