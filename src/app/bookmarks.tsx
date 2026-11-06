import {
  FlatList,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SwiftUI from "@expo/ui/swift-ui/modifiers";

import { useBrowserStore } from "@/stores/browserStore";
import AdaptiveButton from "@/components/ui/button";
import { SystemIcons } from "@/constants/icons";
import { useTheme } from "@/stores/themeContext";

export default function BookmarksScreen() {
  const router = useRouter();
  const bookmarks = useBrowserStore((state) => state.bookmarks);
  const addTab = useBrowserStore((state) => state.addTab);
  const removeBookmark = useBrowserStore((state) => state.removeBookmark);
  const { width } = useWindowDimensions();
  const { colors } = useTheme();
  const columns = width >= 700 ? 3 : 2;

  const openBookmark = (url: string) => {
    addTab(url);
    router.replace("/");
  };

  return (
    <SafeAreaView
      style={[styles.screen, { backgroundColor: colors.background }]}
    >
      <View style={styles.header}>
        <AdaptiveButton
          label=""
          systemImage={SystemIcons.arrowBack}
          onPressButton={() => router.back()}
          backgroundColor={colors.buttonBg}
          textColor={colors.text}
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
        <Text style={[styles.heading, { color: colors.text }]}>Bookmarks</Text>
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
          <Pressable
            style={[
              styles.card,
              {
                backgroundColor: colors.backgroundElement,
                borderColor: colors.border,
              },
            ]}
            onPress={() => openBookmark(item.url)}
            accessibilityRole="button"
            accessibilityLabel={`Open ${item.title || item.url}`}
          >
            <View style={styles.details}>
              <Text
                style={[styles.title, { color: colors.text }]}
                numberOfLines={2}
              >
                {item.title || "Untitled bookmark"}
              </Text>
              <Text
                style={[styles.url, { color: colors.textSecondary }]}
                numberOfLines={1}
              >
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
          </Pressable>
        )}
        ListEmptyComponent={
          <Text style={[styles.message, { color: colors.textSecondary }]}>
            No bookmarks yet.
          </Text>
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
