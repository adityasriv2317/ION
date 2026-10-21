import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useBrowserStore } from "@/stores/browserStore";
import { SafeAreaView } from "react-native-safe-area-context";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Bookmark01Icon } from "@hugeicons/core-free-icons";
import { Icon } from "@expo/ui";
import AdaptiveButton from "@/components/ui/button";

import * as SwiftUI from "@expo/ui/swift-ui/modifiers";
import * as Jetpack from "@expo/ui/jetpack-compose/modifiers";

const Icons = {
  backIcon: Icon.select({
    ios: "chevron.left",
    android: import("@expo/material-symbols/arrow_back.xml"),
  }),
  bookmarkIcon: Icon.select({
    ios: "bookmark",
    android: import("@expo/material-symbols/bookmark.xml"),
  }),
  historyIcon: Icon.select({
    ios: "clock.arrow.circlepath",
    android: import("@expo/material-symbols/history.xml"),
  }),
  plusIcon: Icon.select({
    ios: "plus",
    android: import("@expo/material-symbols/add.xml"),
  }),
  incognito: Icon.select({
    ios: "eye",
    android: import("@expo/material-symbols/eyeglasses.xml"),
  }),
  incognitoOff: Icon.select({
    ios: "eye.slash",
    android: import("@expo/material-symbols/owl.xml"),
  }),
};

const buttonUI = {
  ios: [
    SwiftUI.glassEffect({
      glass: {
        variant: "clear",
        interactive: true,
        tint: "#7657E8",
      },
      shape: "roundedRectangle",
      cornerRadius: 12,
    }),
  ],
  android: [Jetpack.clip(Jetpack.Shapes.RoundedCorner(16))],
};

const plusButtonUI = {
  ios: [
    SwiftUI.frame({
      width: 48,
      height: 48,
    }),
    SwiftUI.glassEffect({
      glass: {
        variant: "regular",
        interactive: true,
        tint: "#7657E8",
      },
      shape: "circle",
    }),
  ],
  android: [
    Jetpack.size(64, 64),
    Jetpack.clip(Jetpack.Shapes.RoundedCorner(16)),
    Jetpack.background("#7657E8"),
  ],
};

const getIncognitoButtonUI = (isIncognito: boolean) => ({
  ios: [
    SwiftUI.buttonStyle("glass"),
    SwiftUI.glassEffect({
      glass: {
        variant: "clear",
        interactive: true,
        tint: isIncognito ? "#7657E8" : "#292747",
      },
      shape: "capsule",
    }),
    SwiftUI.buttonBorderShape("capsule"),
  ],
  android: [
    Jetpack.clip(Jetpack.Shapes.RoundedCorner(28)),
    Jetpack.background(isIncognito ? "#7657E8" : "#292747"),
  ],
});

export default function TabsScreen() {
  const router = useRouter();
  const tabs = useBrowserStore((s) =>
    s.isIncognito ? s.incognitoTabs : s.tabs,
  );
  const activeTabId = useBrowserStore((s) =>
    s.isIncognito ? s.incognitoActiveTabId : s.activeTabId,
  );
  const setActiveTab = useBrowserStore((s) => s.setActiveTab);
  const addTab = useBrowserStore((s) => s.addTab);
  const closeTab = useBrowserStore((s) => s.closeTab);
  const bookmarks = useBrowserStore((s) => s.bookmarks);
  const addBookmark = useBrowserStore((s) => s.addBookmark);
  const removeBookmark = useBrowserStore((s) => s.removeBookmark);
  const isIncognito = useBrowserStore((s) => s.isIncognito);
  const setIncognito = useBrowserStore((s) => s.setIncognito);
  const { width } = useWindowDimensions();
  const columns = width >= 700 ? 3 : 2;

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <AdaptiveButton
          systemImage={Icons.backIcon}
          onPressButton={() => router.back()}
          backgroundColor="#292747"
          textColor="#FFFFFF"
          uiModifiers={{
            ios: [
              SwiftUI.glassEffect({
                glass: {
                  variant: "clear",
                  interactive: true,
                },
                shape: "circle",
              }),
            ],
          }}
        />
        <Text style={styles.heading}>Tabs</Text>
        <View style={styles.headerSpacer} />
      </View>

      <FlatList
        data={tabs}
        numColumns={columns}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        columnWrapperStyle={columns > 1 ? styles.column : undefined}
        renderItem={({ item }) => {
          const isActive = item.id === activeTabId;
          const isBookmarked = bookmarks.some(
            (bookmark) => bookmark.url === item.url,
          );

          return (
            <View style={[styles.tabCard, isActive && styles.activeTabCard]}>
              <Pressable
                onPress={() => {
                  setActiveTab(item.id);
                  router.back();
                }}
                style={styles.tabButton}
              >
                <Text
                  numberOfLines={2}
                  style={[styles.tabTitle, isActive && styles.activeTabTitle]}
                >
                  {item.title || "New Tab"}
                </Text>
                <Text numberOfLines={1} style={styles.tabUrl}>
                  {item.url}
                </Text>
              </Pressable>

              <View style={styles.cardActions}>
                <Pressable
                  onPress={() => {
                    const bookmark = bookmarks.find(
                      (bookmarkItem) => bookmarkItem.url === item.url,
                    );

                    if (bookmark) {
                      removeBookmark(bookmark.id);
                      return;
                    }

                    addBookmark({
                      id: `${item.id}-${Date.now()}`,
                      url: item.url,
                      title: item.title,
                      createdAt: Date.now(),
                    });
                  }}
                  accessibilityRole="button"
                  accessibilityLabel={
                    isBookmarked ? "Remove bookmark" : "Bookmark tab"
                  }
                  hitSlop={8}
                  style={styles.bookmarkButton}
                >
                  <HugeiconsIcon
                    icon={Bookmark01Icon}
                    size={20}
                    color={isBookmarked ? "#B7A5FF" : "#FFFFFF"}
                  />
                </Pressable>

                <Pressable
                  onPress={() => closeTab(item.id)}
                  accessibilityRole="button"
                  accessibilityLabel="Close tab"
                  hitSlop={8}
                  style={styles.closeButton}
                >
                  <Text style={styles.closeText}>×</Text>
                </Pressable>
              </View>
            </View>
          );
        }}
      />

      <View style={styles.footer}>
        <AdaptiveButton
          systemImage={isIncognito ? Icons.incognitoOff : Icons.incognito}
          uiModifiers={getIncognitoButtonUI(isIncognito)}
          onPressButton={() => setIncognito(!isIncognito)}
          backgroundColor={isIncognito ? "#7657E8" : "#292747"}
          textColor="#FFFFFF"
        />
        <View style={styles.footerActions}>
          <AdaptiveButton
            uiModifiers={buttonUI}
            systemImage={Icons.bookmarkIcon}
            onPressButton={() => router.push("/bookmarks")}
          />
          <AdaptiveButton
            uiModifiers={buttonUI}
            systemImage={Icons.historyIcon}
            onPressButton={() => router.push("/history")}
          />
          <AdaptiveButton
            uiModifiers={plusButtonUI}
            systemImage={Icons.plusIcon}
            onPressButton={() => {
              addTab();
              router.back();
            }}
            backgroundColor="#7657E8"
            textColor="#ffffff"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#111121",
    paddingHorizontal: 16,
    paddingTop: 6,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 56,
    marginBottom: 8,
  },
  headerSpacer: {
    width: 72,
  },
  heading: {
    flex: 1,
    color: "white",
    fontSize: 24,
    fontWeight: "700",
    marginLeft: 12,
  },
  list: {
    paddingBottom: 96,
  },
  column: {
    gap: 12,
  },
  tabCard: {
    flex: 1,
    minHeight: 154,
    padding: 14,
    marginBottom: 12,
    borderRadius: 18,
    backgroundColor: "#1B1B2D",
    borderWidth: 1,
    borderColor: "#29293B",
    overflow: "hidden",
  },
  activeTabCard: {
    backgroundColor: "#292747",
    borderColor: "#7657E8",
  },
  tabButton: {
    flex: 1,
    justifyContent: "flex-start",
    paddingRight: 4,
  },
  tabTitle: {
    color: "#B5B5C7",
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "600",
  },
  activeTabTitle: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  tabUrl: {
    color: "#77778D",
    fontSize: 11,
    marginTop: 8,
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 8,
    marginTop: 12,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#34202E",
    alignItems: "center",
    justifyContent: "center",
  },
  bookmarkButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  closeText: {
    color: "#F4A5B5",
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    bottom: "5%",
    justifyContent: "space-between",
    left: 16,
    position: "absolute",
    right: 16,
    zIndex: 2,
  },
  footerActions: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
  addButton: {
    width: 64,
    height: 64,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#7657E8",
    borderRadius: 14,
  },
  utilButton: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#7657E8",
    borderRadius: 14,
  },
  addText: {
    color: "white",
    fontSize: 28,
    fontWeight: "400",
    lineHeight: 32,
  },
});
