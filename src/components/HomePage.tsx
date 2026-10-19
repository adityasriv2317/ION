import {
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useRouter } from "expo-router";

import HomeLiquid from "@/app/(adons)/HomeLiquid";
import AddressBar from "@/components/browser/AddressBar";

import AdaptiveButton from "@/components/ui/button";
import * as SwiftUI from "@expo/ui/swift-ui/modifiers";

type Props = {
  onNavigate: (url: string) => void;
};

const favourites = [
  { title: "YouTube", url: "https://www.youtube.com" },
  { title: "GitHub", url: "https://github.com" },
  { title: "Reddit", url: "https://www.reddit.com" },
  { title: "Wikipedia", url: "https://www.wikipedia.org" },
];

export default function HomePage({ onNavigate }: Props) {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const shortcutWidth = Math.min(76, Math.max(60, (width - 80) / 4));

  return (
    <View style={styles.mainContainer}>
      <HomeLiquid />
      <View style={styles.content}>
        <View style={styles.shortcuts}>
          {favourites.map((item) => (
            <Pressable
              key={item.url}
              style={[styles.shortcut, { width: shortcutWidth }]}
              onPress={() => onNavigate(item.url)}
            >
              <View style={styles.shortcutIcon}>
                <Text style={styles.shortcutInitial}>
                  {item.title.charAt(0)}
                </Text>
              </View>
              <Text style={styles.shortcutTitle}>{item.title}</Text>
            </Pressable>
          ))}
        </View>
        <View style={styles.tabsButton}>
          <AdaptiveButton
            label="Tabs"
            onPress={() => router.push("/tabs")}
            uiModifiers={{
              ios: [
                SwiftUI.glassEffect({
                  glass: {
                    variant: "regular",
                    interactive: false,
                    tint: "#ffffff43",
                  },
                }),
              ],
            }}
          />
        </View>

        <View style={styles.bottomDock}>
          <AddressBar value="" onSubmit={onNavigate} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 2,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 24,
    paddingBottom: 8,
  },
  shortcuts: {
    flexDirection: "row",
    flexWrap: "wrap",
    columnGap: 12,
    rowGap: 16,
    marginTop: 32,
    paddingHorizontal: 12,
    paddingVertical: 16,
    backgroundColor: "#ffffff4e",
    borderRadius: 24,
    alignContent: "center",
    justifyContent: "space-evenly",
    width: "92%",
    maxWidth: 420,
  },
  shortcut: {
    alignItems: "center",
    width: 72,
  },
  shortcutIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#252538",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  shortcutInitial: {
    color: "#B7A5FF",
    fontSize: 21,
    fontWeight: "700",
  },
  shortcutTitle: {
    color: "#D5D5E5",
    fontSize: 11,
    textAlign: "center",
  },
  tabsButton: {
    justifyContent: "flex-end",
    alignSelf: "flex-end",
    paddingHorizontal: 24,
  },
  tabText: {
    color: "#D5D5E5",
  },
  bottomDock: {
    width: "100%",
    paddingHorizontal: 8,
  },
});
