import { View, Pressable, Text, StyleSheet } from "react-native";
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

  return (
    <View style={styles.mainContainer}>
      <HomeLiquid />
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View style={styles.shortcuts}>
          {favourites.map((item) => (
            <Pressable
              key={item.url}
              style={styles.shortcut}
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
        <View
          style={{
            width: "100%",
            alignItems: "flex-end",
            paddingHorizontal: 24,
          }}
        >
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
                  // shape: "roundedRectangle",
                  // cornerRadius: 6,
                }),
              ],
            }}
          />
        </View>
        <AddressBar value="" onSubmit={onNavigate} />
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
  shortcuts: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 20,
    marginVertical: 72,
    paddingHorizontal: 4,
    paddingVertical: 12,
    backgroundColor: "#ffffff4e",
    borderRadius: 24,
    alignContent: "center",
    justifyContent: "space-evenly",
    width: "80%",
  },
  shortcut: {
    alignItems: "center",
    width: 72,
  },
  shortcutIcon: {
    width: 52,
    height: 52,
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
  },
  tabButton: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: "#ffffff4e",
  },
  tabText: {
    color: "#D5D5E5",
  },
});
