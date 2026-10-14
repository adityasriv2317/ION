import { use, useCallback, useRef } from "react";
import { ActivityIndicator, KeyboardAvoidingView, View } from "react-native";

import AddressBar from "@/components/browser/AddressBar";
import BrowserToolbar from "@/components/browser/BrowserToolbar";
import BrowserWebView from "@/components/browser/BrowserWebView";

import { useBrowserStore, HOME_URL } from "@/stores/browserStore";
import { resolveNavigationTarget } from "@/utils/resolveNavigationTarget";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import WebView from "react-native-webview";

import HomePage from "@/components/HomePage";

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
      const target = resolveNavigationTarget(input);
      updateTab(activeTab.id, {
        url: target,
        title: target,
        isLoading: true,
        canGoBack: activeTab.canGoBack,
        canGoForward: false,
      });
    },
    [activeTab, activeTab.canGoBack, updateTab],
  );

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
      edges={["top", "bottom"]}
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
            // onRef=
            // addressBarProp={addressBarProp}
            // toolBarProp={toolBarProp}
          />

          {/* <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        > */}
          {/* <View></View> */}
          <AddressBar value={activeTab.url} onSubmit={navigate} />
          {/* </KeyboardAvoidingView> */}
          <BrowserToolbar
            canGoBack
            canGoForward
            onBack={() => webRef.current?.goBack()}
            onForward={() => webRef.current?.goForward()}
            onReload={() => webRef.current?.reload()}
            onTabs={() => router.push("/tabs")}
            tabCount={tabs.length}
          />
        </View>
        {/* </View> */}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
