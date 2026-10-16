import { useCallback, useEffect, useRef } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  View,
  BackHandler,
} from "react-native";

import AddressBar from "@/components/browser/AddressBar";
import BrowserToolbar from "@/components/browser/BrowserToolbar";
import BrowserWebView from "@/components/browser/BrowserWebView";

import { useBrowserStore, HOME_URL } from "@/stores/browserStore";
import { resolveNavigationTarget } from "@/utils/resolveNavigationTarget";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import WebView from "react-native-webview";

import HomePage from "@/components/HomePage";
import { goBack } from "expo-router/build/global-state/router";
import { setBackgroundColorAsync } from "expo-system-ui";

export default function BrowserScreen() {
  const router = useRouter();
  const webRef = useRef<WebView>(null);

  const tabs = useBrowserStore((s) => s.tabs);
  const activeTabId = useBrowserStore((s) => s.activeTabId);
  const updateTab = useBrowserStore((s) => s.updateTab);
  const addTab = useBrowserStore((s) => s.addTab);

  const hasHydrated = useBrowserStore((s) => s.hasHydrated);
  const activeTab = tabs.find((t) => t.id === activeTabId) ?? tabs[0];

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

  if (activeTab.url == HOME_URL) {
    return <HomePage onNavigate={navigate} />;
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#11111B" }}
      edges={["top"]}
    >
      {/* <View style={{ flex: 1, backgroundColor: "#11111B" }}> */}
      {/* <StatusBar barStyle="light-content" /> */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        keyboardVerticalOffset={0}
        behavior="padding"
      >
        <View
          style={{
            flex: 1,
            borderTopStartRadius: 14,
            borderTopEndRadius: 14,
            overflow: "hidden",
            // backgroundColor: "black",
          }}
        >
          <BrowserWebView
            key={activeTab.id}
            tabId={activeTab.id}
            url={activeTab.url}
            onRef={(node) => {
              webRef.current = node;
            }}
            // addressBarProp={addressBarProp}
            // toolBarProp={toolBarProp}
          />

          {/* <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        > */}
          {/* <View></View> */}
          <View
            style={{
              flex: 1,
              position: "absolute",
              bottom: 32,
              width: "100%",
              // inset: 1,
            }}
          >
            <AddressBar value={activeTab.url} onSubmit={navigate} />
            {/* </KeyboardAvoidingView> */}
            <BrowserToolbar
              canGoBack={true}
              canGoForward={activeTab.canGoForward}
              onBack={() => {
                if (!activeTab.canGoBack) {
                  navigate(HOME_URL);
                  return;
                }
                webRef.current?.goBack();
              }}
              onForward={() => webRef.current?.goForward()}
              onReload={() => webRef.current?.reload()}
              onTabs={() => router.push("/tabs")}
              tabCount={tabs.length}
            />
          </View>
        </View>
        {/* </View> */}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
