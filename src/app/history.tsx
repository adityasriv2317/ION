import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { Icon } from "@expo/ui";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import * as SwiftUI from "@expo/ui/swift-ui/modifiers";

import { clearHistory, listHistory } from "@/db/history";
import type { HistoryEntry } from "@/types/browser";
import AdaptiveButton from "@/components/ui/button";

const backIcon = Icon.select({
  ios: "chevron.left",
  android: import("@expo/material-symbols/arrow_back.xml"),
});
const deleteIcon = Icon.select({
  ios: "trash",
  android: import("@expo/material-symbols/delete.xml"),
});

export default function HistoryScreen() {
  const router = useRouter();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isClearing, setIsClearing] = useState(false);
  const { width } = useWindowDimensions();
  const columns = width >= 700 ? 3 : 2;

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
        <AdaptiveButton
          systemImage={backIcon}
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
        <Text style={styles.heading}>History</Text>
        {history.length > 0 && (
          <AdaptiveButton
            systemImage={deleteIcon}
            onPressButton={handleClearHistory}
            disabled={isClearing || history.length === 0}
            backgroundColor="#34202E"
            textColor="#F4A5B5"
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
        )}
        {history.length === 0 && <View style={styles.headerSpacer} />}
      </View>

      {isLoading ? (
        <ActivityIndicator color="#B7A5FF" style={styles.center} />
      ) : error ? (
        <Text style={styles.message}>{error}</Text>
      ) : (
        <FlatList
          data={history}
          numColumns={columns}
          keyExtractor={(item) => item.id}
          contentContainerStyle={
            history.length === 0 ? styles.emptyList : styles.list
          }
          columnWrapperStyle={columns > 1 ? styles.column : undefined}
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
    paddingHorizontal: 16,
    paddingTop: 6,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 56,
    marginBottom: 8,
  },
  heading: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700",
    marginLeft: 12,
  },
  headerSpacer: {
    width: 72,
  },
  list: {
    paddingBottom: 24,
  },
  column: {
    gap: 12,
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#1B1B2D",
    borderColor: "#29293B",
    borderRadius: 18,
    borderWidth: 1,
    flex: 1,
    minHeight: 154,
    marginBottom: 12,
    padding: 14,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "600",
    marginBottom: 5,
  },
  url: {
    color: "#77778D",
    fontSize: 11,
    marginTop: 8,
  },
  date: {
    color: "#77778E",
    fontSize: 12,
    marginTop: 12,
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
