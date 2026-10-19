import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useBrowserStore } from "@/stores/browserStore";
import { SafeAreaView } from "react-native-safe-area-context";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Bookmark01Icon, HistoryIcon } from "@hugeicons/core-free-icons";

export default function TabsScreen() {
  const router = useRouter();
  const tabs = useBrowserStore((s) => s.tabs);
  const activeTabId = useBrowserStore((s) => s.activeTabId);
  const setActiveTab = useBrowserStore((s) => s.setActiveTab);
  const addTab = useBrowserStore((s) => s.addTab);
  const closeTab = useBrowserStore((s) => s.closeTab);
  const bookmarks = useBrowserStore((s) => s.bookmarks);
  const addBookmark = useBrowserStore((s) => s.addBookmark);
  const removeBookmark = useBrowserStore((s) => s.removeBookmark);

  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.heading}>Tabs</Text>

      <FlatList
        data={tabs}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const isActive = item.id === activeTabId;

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
                  numberOfLines={1}
                  style={[styles.tabTitle, isActive && styles.activeTabTitle]}
                >
                  {item.title || "New Tab"}
                </Text>
              </Pressable>

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
                  bookmarks.some((bookmark) => bookmark.url === item.url)
                    ? "Remove bookmark"
                    : "Bookmark tab"
                }
                hitSlop={8}
                style={styles.bookmarkButton}
              >
                <HugeiconsIcon
                  icon={Bookmark01Icon}
                  size={20}
                  color={
                    bookmarks.some((bookmark) => bookmark.url === item.url)
                      ? "#B7A5FF"
                      : "#FFFFFF"
                  }
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
          );
        }}
      />

      <View style={styles.footer}>
        <Pressable
          onPress={() => {
            router.push("/history");
          }}
          accessibilityRole="button"
          accessibilityLabel="History"
          style={styles.utilButton}
        >
          <HugeiconsIcon icon={HistoryIcon} size={24} color="#FFFFFF" />
        </Pressable>
        <Pressable
          onPress={() => {
            router.push("/bookmarks");
          }}
          accessibilityRole="button"
          accessibilityLabel="Bookmarks"
          style={styles.utilButton}
        >
          <HugeiconsIcon icon={Bookmark01Icon} size={24} color="#FFFFFF" />
        </Pressable>
        <Pressable
          onPress={() => {
            addTab();
            router.back();
          }}
          accessibilityRole="button"
          accessibilityLabel="Add new tab"
          style={styles.addButton}
        >
          <Text style={styles.addText}>+</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#111121",
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  heading: {
    color: "white",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
  },
  list: {
    paddingBottom: 16,
  },
  tabCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 10,
    borderRadius: 14,
    backgroundColor: "#1B1B2D",
    borderWidth: 1,
    borderColor: "#29293B",
  },
  activeTabCard: {
    backgroundColor: "#292747",
    borderColor: "#7657E8",
  },
  tabButton: {
    flex: 1,
    justifyContent: "center",
  },
  tabTitle: {
    color: "#B5B5C7",
    fontSize: 15,
    fontWeight: "500",
  },
  activeTabTitle: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  closeButton: {
    width: 32,
    height: 32,
    marginLeft: 12,
    borderRadius: 10,
    backgroundColor: "#34202E",
    alignItems: "center",
    justifyContent: "center",
  },
  bookmarkButton: {
    width: 32,
    height: 32,
    marginLeft: 8,
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
    justifyContent: "flex-end",
    paddingVertical: 10,
    marginHorizontal: 16,
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
