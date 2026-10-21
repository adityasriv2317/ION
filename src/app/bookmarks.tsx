import {
  FlatList,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SwiftUI from "@expo/ui/swift-ui/modifiers";

import { useBrowserStore } from "@/stores/browserStore";
import AdaptiveButton from "@/components/ui/button";
import { SystemIcons } from "@/constants/icons";

export default function BookmarksScreen() {
  const router = useRouter();
  const bookmarks = useBrowserStore((state) => state.bookmarks);
  const removeBookmark = useBrowserStore((state) => state.removeBookmark);
  const { width } = useWindowDimensions();
  const columns = width >= 700 ? 3 : 2;

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <AdaptiveButton
          label=""
          systemImage={SystemIcons.arrowBack}
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
        <Text style={styles.heading}>Bookmarks</Text>
        <View style={styles.headerSpacer} />
      </View>

      <FlatList
        data={bookmarks}
        numColumns={columns}
        keyExtractor={(item) => item.id}
        contentContainerStyle={
          bookmarks.length === 0 ? styles.emptyList : styles.list
        }
        columnWrapperStyle={columns > 1 ? styles.column : undefined}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.details}>
              <Text style={styles.title} numberOfLines={2}>
                {item.title || "Untitled bookmark"}
              </Text>
              <Text style={styles.url} numberOfLines={1}>
                {item.url}
              </Text>
            </View>
            <View style={styles.cardActions}>
              <AdaptiveButton
                label=""
                systemImage={SystemIcons.delete}
                onPressButton={() => removeBookmark(item.id)}
                backgroundColor="#34202E"
                textColor="#F4A5B5"
              />
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.message}>No bookmarks yet.</Text>
        }
      />
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
  emptyList: {
    flexGrow: 1,
    justifyContent: "center",
  },
  column: {
    gap: 12,
  },
  card: {
    flex: 1,
    minHeight: 154,
    backgroundColor: "#1B1B2D",
    borderColor: "#29293B",
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 12,
    padding: 14,
  },
  details: {
    flex: 1,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "600",
  },
  url: {
    color: "#77778D",
    fontSize: 11,
    marginTop: 8,
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 12,
  },
  message: {
    color: "#B5B5C7",
    fontSize: 15,
    textAlign: "center",
  },
});
