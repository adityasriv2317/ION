import { useRef } from "react";
import { View, ActivityIndicator, Text } from "react-native";
import WebView, { type WebView as WebViewType } from "react-native-webview";
import type { WebViewNavigation } from "react-native-webview/lib/WebViewTypes";
import { useBrowserStore } from "../../stores/browserStore";

type Props = {
  tabId: string;
  url: string;
  onRef?: (ref: WebViewType | null) => void;
};

export default function BrowserWebView({ tabId, url, onRef }: Props) {
  const ref = useRef<WebViewType>(null);
  const updateTab = useBrowserStore((s) => s.updateTab);

  const onNavigationStateChange = (nav: WebViewNavigation) => {
    updateTab(tabId, {
      url: nav.url,
      title: nav.title || nav.url,
      isLoading: nav.loading,
      canGoBack: nav.canGoBack,
      canGoForward: nav.canGoForward,
    });
  };

  return (
    <View style={{ flex: 1 }}>
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
        renderLoading={() => (
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <ActivityIndicator />
            <Text style={{ marginTop: 8 }}>Loading</Text>
          </View>
        )}
      />
    </View>
  );
}
