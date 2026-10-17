import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Delete02Icon, Loading02Icon } from "@hugeicons/core-free-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { clearHistory, listHistory } from "@/db/history";
import type { HistoryEntry } from "@/types/browser";
import ArrowLeft01Icon from "@hugeicons/core-free-icons/ArrowLeft01Icon";

export default function HistoryScreen() {
  const router = useRouter();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isClearing, setIsClearing] = useState(false);

  useEffect(() => {
    let isMounted = true;

    listHistory()
      .then((items) => {
        if (isMounted) setHistory(items);
      })
      .catch((e) => {
        if (isMounted) setError("Unable to load history.");
        console.log(e);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleClearHistory = () => {
    Alert.alert(
      "Clear history?",
      "This will permanently remove all browsing history.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: () => {
            setIsClearing(true);
            void clearHistory()
              .then(() => {
                setHistory([]);
                setError(null);
              })
              .catch((clearError: unknown) => {
                console.error("Failed to clear history.", clearError);
                setError("Unable to clear history.");
              })
              .finally(() => {
                setIsClearing(false);
              });
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={24} color="#FFFFFF" />
        </Pressable>
        <Text style={styles.heading}>History</Text>
        {history.length > 0 && (
          <Pressable
            onPress={handleClearHistory}
            disabled={isClearing || history.length === 0}
            accessibilityRole="button"
            accessibilityLabel="Clear history"
            style={styles.clearButton}
          >
            {isClearing ? (
              <HugeiconsIcon icon={Loading02Icon} size={24} color="#FFFFFF" />
            ) : (
              <HugeiconsIcon icon={Delete02Icon} size={24} color="#FFFFFF" />
            )}
          </Pressable>
        )}
      </View>

      {isLoading ? (
        <ActivityIndicator color="#B7A5FF" style={styles.center} />
      ) : error ? (
        <Text style={styles.message}>{error}</Text>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          contentContainerStyle={
            history.length === 0 ? styles.emptyList : styles.list
          }
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.title} numberOfLines={1}>
                {item.title || "Untitled page"}
              </Text>
              <Text style={styles.url} numberOfLines={1}>
                {item.url}
              </Text>
              <Text style={styles.date}>
                {new Date(item.visitedAt).toLocaleDateString()}
              </Text>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.message}>No history yet.</Text>
          }
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
  clearButton: {
    minWidth: 52,
    alignItems: "flex-end",
    paddingVertical: 8,
  },
  clearText: {
    color: "#B7A5FF",
    fontSize: 14,
    fontWeight: "600",
  },
  disabledText: {
    color: "#5F5F73",
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
  date: {
    color: "#77778E",
    fontSize: 12,
    marginTop: 8,
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
