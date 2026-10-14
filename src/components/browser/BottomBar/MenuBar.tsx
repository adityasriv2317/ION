import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  Download04Icon,
  RefreshIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  Settings02Icon,
  Bookmark01Icon,
} from "@hugeicons/core-free-icons";
import { Pressable, StyleSheet, View } from "react-native";
import { useContext } from "react";
import { BrowserContext } from "@/contexts/BrowserContext";
import { router } from "expo-router";

export default function MenuBar() {
  const {
    webRef,
    canGoBack,
    canGoForward,
    setCurrentUrl,
    setInputValue,
    setCanGoBack,
    setCanGoForward,
  } = useContext(BrowserContext);
  const menuItems = [
    {
      key: "back",
      icon: ArrowLeftIcon,
      label: "Back",
      onPress: () => {
        if (canGoBack) {
          webRef.current?.goBack();
          if (!webRef.current?.canGoBack) {
            setCanGoBack(false);
            setInputValue("");
            setCurrentUrl("");
          }
        }
      },
    },
    {
      key: "forward",
      icon: ArrowRightIcon,
      label: "Forward",
      onPress: () => {
        if (canGoForward) {
          webRef.current?.goForward();
        }
      },
    },
    {
      key: "refresh",
      icon: RefreshIcon,
      label: "Refresh",
      onPress: () => {
        if (webRef.current) {
          webRef.current.reload();
        }
      },
    },
    {
      key: "download",
      icon: Download04Icon,
      label: "Download",
      onPress: () => {},
    },
    {
      key: "bookmark",
      icon: Bookmark01Icon,
      label: "Bookmark",
      onPress: () => {},
    },
    {
      key: "settings",
      icon: Settings02Icon,
      label: "Settings",
      onPress: () => {
        router.push("/settings");
      },
    },
  ];

  return (
    <View style={styles.container}>
      {/* menu items */}
      <View style={styles.menuList}>
        {menuItems.map((item) => (
          <Pressable
            key={item.key}
            onPress={item.onPress}
            android_ripple={{ color: "#abcabc22", borderless: true }}
            style={styles.menuItem}
          >
            <HugeiconsIcon icon={item.icon} size={28} color="#fff" />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    maxHeight: "100%",
    minHeight: 64,
    marginBottom: 16,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  menuList: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
    borderRadius: 9999,
    gap: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  menuItem: {
    alignItems: "center",
    justifyContent: "center",
    width: 56,
    height: 56,
    borderRadius: 28,
    marginHorizontal: 4,
    padding: 4,
    marginVertical: 4,
  },
});
