import { useState } from "react";
import {
  KeyboardAvoidingView,
  View,
  Pressable,
  Text,
  StyleSheet,
} from "react-native";

import HomeLiquid from "@/app/(adons)/HomeLiquid";
import AddressBar from "@/components/browser/AddressBar";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

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
  const [query, setQuery] = useState("");
  const router = useRouter();

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#11111B" }}
      //   edges={["top", "bottom"]}
    >
      <HomeLiquid />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        keyboardVerticalOffset={0}
        behavior="padding"
      >
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
            <Pressable
              style={styles.tabButton}
              onPress={() => router.push("/tabs")}
            >
              <Text style={styles.tabText}>Tabs</Text>
            </Pressable>
          </View>
          <AddressBar value="" onSubmit={onNavigate} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  shortcuts: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 20,
    marginVertical: 72,
    paddingHorizontal: 4,
    paddingVertical: 12,
    backgroundColor: "#ffffff4e",
    borderRadius: 24,
  },
  shortcut: {
    alignItems: "center",
    width: 65,
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
