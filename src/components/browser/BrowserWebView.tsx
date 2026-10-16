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

type Props = {
  tabId: string;
  url: string;
  onRef?: (ref: WebViewType | null) => void;
  onSwipeBackToHome?: () => void;
  // addressBarProp: {
  //   value: string;
  //   onSubmit: (i: string) => {};
  // };
  // toolBarProp: {
  //   tabCount: number;
  //   onBack: () => {};
  //   onTabs: () => {};
  //   onForward: () => {};
  //   onReload: () => {};
  //   onHome: () => {};
  // };
};

export default function BrowserWebView({
  tabId,
  url,
  onRef,
  onSwipeBackToHome,
  // addressBarProp,
  // toolBarProp,
}: Props) {
  const ref = useRef<WebViewType>(null);
  const updateTab = useBrowserStore((s) => s.updateTab);
  const canGoBack = useBrowserStore(
    (s) => s.tabs.find((t) => t.id === tabId)?.canGoBack ?? false,
  );

  const onNavigationStateChange = (nav: WebViewNavigation) => {
    updateTab(tabId, {
      url: nav.url,
      title: nav.title || nav.url,
      isLoading: nav.loading,
      canGoBack: nav.canGoBack,
      canGoForward: nav.canGoForward,
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
    <View style={{ flex: 1, position: "absolute", inset: 0 }}>
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
        renderLoading={() => (
          <View
            style={{
              // StyleSheet.absoluteFillObject,
              // flex: 1,
              // alignItems: "center",
              // justifyContent: "center",
              // backgroundColor: "transparent",
              // justifyContent: "center",
              // alignItems: "center",
              // zIndex: 10,
              ...StyleSheet.absoluteFill,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "transparent",
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
