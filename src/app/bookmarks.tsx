import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { listBookmarks } from "@/db/bookmarks";
import type { Bookmark } from "@/types/browser";

export default function BookmarksScreen() {
  const router = useRouter();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    listBookmarks()
      .then((items) => {
        if (isMounted) setBookmarks(items);
      })
      .catch(() => {
        if (isMounted) setError("Unable to load bookmarks.");
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={10} accessibilityRole="button" accessibilityLabel="Go back">
          <Text style={styles.back}>‹</Text>
        </Pressable>
        <Text style={styles.heading}>Bookmarks</Text>
        <View style={styles.headerSpacer} />
      </View>

      {isLoading ? (
        <ActivityIndicator color="#B7A5FF" style={styles.center} />
      ) : error ? (
        <Text style={styles.message}>{error}</Text>
      ) : (
        <FlatList
          data={bookmarks}
          keyExtractor={(item) => item.id}
          contentContainerStyle={bookmarks.length === 0 ? styles.emptyList : styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.title} numberOfLines={1}>{item.title || "Untitled bookmark"}</Text>
              <Text style={styles.url} numberOfLines={1}>{item.url}</Text>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.message}>No bookmarks yet.</Text>}
        />
      )}
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
    backgroundColor: "#1B1B2D",
    borderColor: "#29293B",
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
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
  center: {
    flex: 1,
  },
  message: {
    color: "#B5B5C7",
    fontSize: 15,
    textAlign: "center",
  },
});