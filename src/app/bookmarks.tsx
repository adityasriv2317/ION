import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Delete02Icon } from "@hugeicons/core-free-icons";

import { useBrowserStore } from "@/stores/browserStore";

export default function BookmarksScreen() {
  const router = useRouter();
  const bookmarks = useBrowserStore((state) => state.bookmarks);
  const removeBookmark = useBrowserStore((state) => state.removeBookmark);

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={10} accessibilityRole="button" accessibilityLabel="Go back">
          <Text style={styles.back}>‹</Text>
        </Pressable>
        <Text style={styles.heading}>Bookmarks</Text>
        <View style={styles.headerSpacer} />
      </View>

      <FlatList
        data={bookmarks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={bookmarks.length === 0 ? styles.emptyList : styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.details}>
              <Text style={styles.title} numberOfLines={1}>
                {item.title || "Untitled bookmark"}
              </Text>
              <Text style={styles.url} numberOfLines={1}>
                {item.url}
              </Text>
            </View>
            <Pressable
              onPress={() => removeBookmark(item.id)}
              accessibilityRole="button"
              accessibilityLabel={`Remove ${item.title || "bookmark"}`}
              hitSlop={8}
              style={styles.removeButton}
            >
              <HugeiconsIcon
                icon={Delete02Icon}
                size={20}
                color="#F4A5B5"
              />
            </Pressable>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.message}>No bookmarks yet.</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#111121",
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 20,
  },
  back: {
    color: "#FFFFFF",
    fontSize: 36,
    fontWeight: "300",
    lineHeight: 36,
    width: 32,
  },
  heading: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700",
    marginLeft: 8,
  },
  headerSpacer: {
    width: 32,
  },
  list: {
    paddingBottom: 16,
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: "center",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1B1B2D",
    borderColor: "#29293B",
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  details: {
    flex: 1,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 5,
  },
  url: {
    color: "#9D9DB2",
    fontSize: 13,
  },
  removeButton: {
    width: 36,
    height: 36,
    marginLeft: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  message: {
    color: "#B5B5C7",
    fontSize: 15,
    textAlign: "center",
  },
});