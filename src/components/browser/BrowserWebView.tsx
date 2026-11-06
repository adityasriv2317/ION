import { useRef, useMemo, useState } from "react";
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

const androidPullToRefreshScript = `
(function () {
  if (window.__ionPullToRefreshInstalled) {
    return true;
  }

  window.__ionPullToRefreshInstalled = true;
  var startY = 0;
  var shouldRefresh = false;
  var refreshPending = false;

  document.addEventListener("touchstart", function (event) {
    if (event.touches.length === 1) {
      startY = event.touches[0].clientY;
      shouldRefresh = false;
    }
  }, { capture: true, passive: true });

  document.addEventListener("touchmove", function (event) {
    if (event.touches.length !== 1 || refreshPending) {
      return;
    }

    var scrollTop = document.scrollingElement
      ? document.scrollingElement.scrollTop
      : window.scrollY;
    var distance = event.touches[0].clientY - startY;
    shouldRefresh = scrollTop <= 0 && distance > 72;
  }, { capture: true, passive: true });

  document.addEventListener("touchend", function () {
    if (shouldRefresh && !refreshPending && window.ReactNativeWebView) {
      refreshPending = true;
      window.ReactNativeWebView.postMessage("ion-pull-to-refresh");
      window.setTimeout(function () {
        refreshPending = false;
      }, 1000);
    }

    startY = 0;
    shouldRefresh = false;
  }, { capture: true, passive: true });
})();
true;
`;

function createHistoryId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

type Props = {
  tabId: string;
  url: string;
  onRef?: (ref: WebViewType | null) => void;
  onSwipeBackToHome?: () => void;
};

export const getFaviconUrl = (pageUrl: string) => {
  if (!pageUrl) return undefined;

  try {
    const validUrl = pageUrl.includes("://")
      ? pageUrl
      : `https://${pageUrl}`;
    const parsedUrl = new URL(validUrl);

    if (!["http:", "https:"].includes(parsedUrl.protocol)) return undefined;

    const domain = parsedUrl.hostname;

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
  const [isRefreshing, setIsRefreshing] = useState(false);
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
        onLoadEnd={() => {
          updateTab(tabId, { isLoading: false });
          setIsRefreshing(false);
        }}
        onError={() => {
          updateTab(tabId, { isLoading: false });
          setIsRefreshing(false);
        }}
        onHttpError={() => {
          updateTab(tabId, { isLoading: false });
          setIsRefreshing(false);
        }}
        onMessage={(event) => {
          if (
            Platform.OS === "android" &&
            event.nativeEvent.data === "ion-pull-to-refresh"
          ) {
            setIsRefreshing(true);
            ref.current?.reload();
          }
        }}
        javaScriptEnabled
        domStorageEnabled
        setSupportMultipleWindows={false}
        startInLoadingState
        pullToRefreshEnabled={Platform.OS === "ios"}
        injectedJavaScript={
          Platform.OS === "android" ? androidPullToRefreshScript : undefined
        }
        allowsBackForwardNavigationGestures={true}
        scrollEnabled
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
