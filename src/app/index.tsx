import { useCallback, useRef } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  View,
  Pressable,
  Keyboard,
} from "react-native";
import type { WebView as WebViewType } from "react-native-webview";

import BrowserWebView from "@/components/browser/BrowserWebView";

import { useBrowserStore, HOME_URL } from "@/stores/browserStore";
import { resolveNavigationTarget } from "@/utils/resolveNavigationTarget";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import HomePage from "@/components/HomePage";
import BottomBar from "@/components/browser/BottomBar";
import { BrowserSessionProvider } from "@/components/browser/BrowserSessionContext";
import {
  useActiveTab,
  useActiveTabId,
  useHasHydrated,
  useVisibleTabs,
} from "@/stores/browserSelectors";

export default function BrowserScreen() {
  const router = useRouter();
  const webViewsRef = useRef(new Map<string, WebViewType>());

  const tabs = useVisibleTabs();
  const activeTabId = useActiveTabId();
  const updateTab = useBrowserStore((s) => s.updateTab);

  const hasHydrated = useHasHydrated();
  const activeTab = useActiveTab();

  const setWebViewRef = useCallback(
    (tabId: string, node: WebViewType | null) => {
      if (node) {
        webViewsRef.current.set(tabId, node);
      } else {
        webViewsRef.current.delete(tabId);
      }
    },
    [],
  );

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
    [activeTab, updateTab],
  );

  const handleBack = useCallback(() => {
    if (!activeTab || activeTab.url === HOME_URL) return false;

    if (activeTab.canGoBack) {
      webViewsRef.current.get(activeTab.id)?.goBack();
    } else {
      navigate(HOME_URL);
    }

    return true;
  }, [activeTab, navigate]);

  // useEffect(() => {
  //   const subs = BackHandler.addEventListener("hardwareBackPress", handleBack);
  //   return () => subs.remove();
  // }, [handleBack]);

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
                  // onRef={(node) => {
                  //   if (node) {
                  //     webViewsRef.current.set(tab.id, node);
                  //   } else {
                  //     webViewsRef.current.delete(tab.id);
                  //   }
                  // }}
                  onRef={(node) => setWebViewRef(tab.id, node)}
                />
              </View>
            ))}
          {activeTab.url === HOME_URL && <HomePage onNavigate={navigate} />}
          {/* <Pressable
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
            onPress={() => {
              Keyboard.dismiss();
            }}
          /> */}
          <BrowserSessionProvider
            activeTab={activeTab}
            tabCount={tabs.length}
            webViewsRef={webViewsRef}
            navigate={navigate}
            goBack={handleBack}
            openTabs={() => router.push("/tabs")}
          >
            <BottomBar />
          </BrowserSessionProvider>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
