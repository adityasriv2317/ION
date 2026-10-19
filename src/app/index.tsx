import { useCallback, useEffect, useRef } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  View,
  BackHandler,
} from "react-native";
import type { WebView as WebViewType } from "react-native-webview";

import AddressBar from "@/components/browser/AddressBar";
import BrowserToolbar from "@/components/browser/BrowserToolbar";
import BrowserWebView from "@/components/browser/BrowserWebView";

import { useBrowserStore, HOME_URL } from "@/stores/browserStore";
import { resolveNavigationTarget } from "@/utils/resolveNavigationTarget";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import WebView from "react-native-webview";

import HomePage from "@/components/HomePage";
import { hidden } from "@expo/ui/swift-ui/modifiers";

export default function BrowserScreen() {
  const router = useRouter();
  const webRef = useRef<WebView>(null);
  const webViewsRef = useRef(new Map<string, WebViewType>());

  const tabs = useBrowserStore((s) => s.tabs);
  const activeTabId = useBrowserStore((s) => s.activeTabId);
  const updateTab = useBrowserStore((s) => s.updateTab);

  const hasHydrated = useBrowserStore((s) => s.hasHydrated);
  const activeTab = tabs.find((t) => t.id === activeTabId) ?? tabs[0];

  const activeWebView = activeTab
    ? webViewsRef.current.get(activeTab.id)
    : undefined;

  const navigate = useCallback(
    (input: string) => {
      if (input === "") {
        updateTab(activeTab.id, {
          url: activeTab.url,
        });
        return;
      }

      if (input === HOME_URL) {
        updateTab(activeTab.id, {
          url: HOME_URL,
          title: "Home - ION",
          isLoading: false,
          canGoBack: false,
          canGoForward: true,
        });
        return;
      }
      const target = resolveNavigationTarget(input);
      updateTab(activeTab.id, {
        url: target,
        title: target,
        isLoading: true,
        canGoBack: activeTab.url === HOME_URL ? false : activeTab.canGoBack,
        canGoForward: false,
      });
    },
    [activeTab, activeTab.canGoBack, updateTab],
  );

  const handleBack = useCallback(() => {
    if (!activeTab || activeTab.url === HOME_URL) return false;

    if (activeTab.canGoBack) {
      webRef.current?.goBack();
    } else {
      navigate(HOME_URL);
    }

    return true;
  }, [activeTab, navigate]);

  useEffect(() => {
    const subs = BackHandler.addEventListener("hardwareBackPress", handleBack);
    return () => subs.remove();
  }, [handleBack]);

  if (!hasHydrated) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "#11111B",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#B7A5FF" />
      </SafeAreaView>
    );
  }

  if (!activeTab) return <HomePage onNavigate={navigate} />;

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#11111B" }}
      edges={["top"]}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        keyboardVerticalOffset={0}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View
          style={{
            flex: 1,
            borderTopStartRadius: 18,
            borderTopEndRadius: 18,
            overflow: "hidden",
          }}
        >
          {tabs
            .filter((tab) => tab.url !== HOME_URL)
            .map((tab) => (
              <View
                key={tab.id}
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  bottom: 0,
                  left: 0,
                  opacity: tab.id === activeTabId ? 1 : 0,
                  zIndex: tab.id === activeTabId ? 1 : 0,
                }}
                pointerEvents={tab.id === activeTabId ? "auto" : "none"}
              >
                <BrowserWebView
                  tabId={tab.id}
                  url={tab.url}
                  onRef={(node) => {
                    if (node) {
                      webViewsRef.current.set(tab.id, node);
                    } else {
                      webViewsRef.current.delete(tab.id);
                    }
                  }}
                />
                <View
                  style={{
                    flex: 1,
                    position: "absolute",
                    bottom: 32,
                    width: "100%",
                  }}
                >
                  <AddressBar value={activeTab.url} onSubmit={navigate} />
                  <BrowserToolbar
                    canGoBack={true}
                    canGoForward={activeTab.canGoForward}
                    onBack={() => {
                      if (!activeTab.canGoBack) {
                        navigate(HOME_URL);
                        return;
                      }
                      activeWebView?.goBack();
                    }}
                    onForward={() => activeWebView?.goForward()}
                    onReload={() => activeWebView?.reload()}
                    onTabs={() => router.push("/tabs")}
                    tabCount={tabs.length}
                  />
                </View>
              </View>
            ))}
          {activeTab.url === HOME_URL && <HomePage onNavigate={navigate} />}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
